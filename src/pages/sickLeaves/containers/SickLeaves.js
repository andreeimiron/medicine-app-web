import React, {useEffect, useState} from 'react';
import SickLeave from './SickLeave';
import Table from "../../../components/PaginatedTable";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { getAllByUser, getAllByDoctor, getById } from "../api";
import 'react-notifications/lib/notifications.css';
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { useHistory } from "react-router-dom";
import { generatePdf } from '../../../utils/generatePdf';

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: '25px'
  },
}));

const SickLeaves = () => {
  let history = useHistory()
  const classes = useStyles();
  const defaultData = {
    diagnostic: {
      type: 'text',
      label: 'Diagnostic',
      name: 'diagnostic',
      value: '',
      error: '',
      required: true
    },
    startDate: {
      type: 'date',
      label: 'Data inceput',
      name: 'startDate',
      value: new Date().toISOString().slice(0, 10),
      error: '',
      required: true
    },
    endDate: {
      type: 'date',
      label: 'Data sfarsit',
      name: 'endDate',
      value: new Date().toISOString().slice(0, 10),
      error: '',
      required: true
    }
  };
  const [showAddSickLeave, setShowAddSickLeave] = useState(false);
  const loggedUser = JSON.parse(localStorage.getItem('user')) || {};
  const isDoctor = loggedUser.role === 'medic';
  const tableHead = Object.values(defaultData).map(({ name, label }) => ({ id: name, label })) || [];
  const columns = isDoctor
    ? [{id: 'id', label: 'ID Ref.'}, { id: 'fullName', label: 'Nume si prenume' }, ...tableHead]
    : [{id: 'id', label: 'ID Ref.'}, ...tableHead];
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect( () => {
    fetchData();
  }, [page, rowsPerPage])

  const fetchData = async () => {
    try {
      if (isDoctor) {
        const data = await getAllByDoctor({
          doctorId: loggedUser.id,
          page,
          limit: rowsPerPage
        });
        const { data: { rows }, totalRows } = data;

        const updatedRows = rows.map((row) => {
          const user = row.User;
          delete row.User;
          delete row.updatedAt;
          delete row.createdAt;
          delete row.userId;

          return {
            id: row.id,
            fullName: `${user.lastName} ${user.firstName}`,
            ...row,
            endDate: row.endDate.slice(0, 10),
            startDate: row.startDate.slice(0, 10)
          };
        });

        setRows(updatedRows);
        setTotalRows(totalRows);
      } else {
        const data = await getAllByUser({
          userId: loggedUser.id,
          page,
          limit: rowsPerPage
        });
        const { data: { rows }, totalRows } = data;

        const updatedRows = rows.map((row) => {
          delete row.updatedAt;
          delete row.createdAt;
          delete row.userId;

          return {
            id: row.id,
            ...row,
            endDate: row.endDate.slice(0, 10),
            startDate: row.startDate.slice(0, 10)
          };
        });

        setRows(updatedRows);
        setTotalRows(totalRows);
      }
    } catch (error) {
      console.log('error', error);
      setRows([]);
    }
  }

  const handleDownload = async (docId) => {
    const selectedSickLeave = await getById(docId);
    const {
      id,
      diagnostic,
      startDate,
      endDate
    } = selectedSickLeave;
    const {
      lastName,
      firstName,
      cnp,
      address,
      companyName,
      insuredCode,
      insuredType,
    } = selectedSickLeave.User;
    const {
      firstName: doctorFirstName,
      lastName: doctorLastName,
      medicalCode,
    } = selectedSickLeave.User.User;

    const filename = `CM${id}`;
    const title = 'CONCEDIU MEDICAL';
    const subtitle = `- seria si nr. ${filename} -`
    const document = `
      ASIGURAT
        Nume si prenume: ${lastName} ${firstName}
        CNP: ${cnp}
        Domiciliu: ${address}
        Cod CNAS: ${insuredCode}
        Diagnostic: ${diagnostic}
        Periaoda: ${startDate.slice(0, 10)} - ${endDate.slice(0, 10)}
      
      PLATITOR
        Companie: ${companyName}
        Tip asigurat: ${insuredType}
      
      MEDIC
        Nume si prenume: ${doctorFirstName} ${doctorLastName}
        Cod parafa: ${medicalCode}
    `;

    generatePdf(title, subtitle, document, filename)
  };

  const handleChangePage = (newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (newLimit) => {
    setRowsPerPage(newLimit);
    setPage(1);
  };

  return (
    <div>
      <Typography variant="h5" style={{ marginBottom: '25px'}} gutterBottom>
        Concedii medicale eliberate
      </Typography>
      {totalRows ?
        <Table
          rows={rows}
          columns={columns}
          onPageChange={handleChangePage}
          onLimitChange={handleChangeRowsPerPage}
          totalRows={totalRows}
          onClick={() => {}}
          download={true}
          onDownload={handleDownload}
        /> :
        <Typography variant="body1" style={{ display: 'flex', alignItems: 'center' }}gutterBottom>
          <ErrorOutlineIcon style={{ marginRight: '5px' }} />
          Nu exista date inregistrate
        </Typography>
      }
      {isDoctor ? (
        <React.Fragment>
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={() => setShowAddSickLeave(!showAddSickLeave)}
            endIcon={showAddSickLeave ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          >
            Elibereaza un nou concediu medical
          </Button>
          {showAddSickLeave && (
            <SickLeave
              fields={defaultData}
              onCreate={() => fetchData()}
            />
          )}
        </React.Fragment>
      ) : (
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={() => history.push('/requests')}
          endIcon={<KeyboardArrowRightIcon />}
        >
          Solicita un concediu medical
        </Button>
      )}
    </div>
  )
};

export default SickLeaves;
