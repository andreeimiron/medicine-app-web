import React, {useEffect, useState} from 'react';
import Referral from './Referral';
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
import { generatePdf } from "../../../utils/generatePdf";

const useStyles = makeStyles(() => ({
  button: {
    marginTop: '25px'
  },
}));

const Referrals = () => {
  let history = useHistory();
  const classes = useStyles();
  const defaultData = {
    priority: {
      type: 'text',
      label: 'Caz prioritar',
      name: 'priority',
      value: '',
      error: '',
      required: true
    },
    diagnostic: {
      type: 'text',
      label: 'Diagnostic',
      name: 'diagnostic',
      value: '',
      error: '',
      required: true
    },
    releaseDate: {
      type: 'date',
      label: 'Data eliberarii',
      name: 'releaseDate',
      value: new Date().toISOString().slice(0, 10),
      error: '',
      required: true
    },
    investigations: {
      type: 'text',
      label: 'Investigatii',
      name: 'investigations',
      value: '',
      error: '',
      required: false
    },
  };
  const [showAddReferral, setShowAddReferral] = useState(false);
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
          const priority = row.priority ? 'DA' : 'NU';
          delete row.User;
          delete row.priority;
          delete row.updatedAt;
          delete row.createdAt;
          delete row.userId;

          return {
            id: row.id,
            fullName: `${user.lastName} ${user.firstName}`,
            priority,
            ...row,
            releaseDate: row.releaseDate.slice(0, 10),
            investigation: (row.investigation || []).join(', ')
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
          const priority = row.priority ? 'DA' : 'NU';
          delete row.User;
          delete row.priority;
          delete row.updatedAt;
          delete row.createdAt;
          delete row.userId;

          return {
            id: row.id,
            priority,
            ...row,
            releaseDate: row.releaseDate.slice(0, 10),
            investigation: (row.investigation || []).join(', ')
          };
        });

        setRows(updatedRows);
        setTotalRows(totalRows);
      }
    } catch (error) {
      setRows([]);
    }
  }

  const handleChangePage = (newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (newLimit) => {
    setRowsPerPage(newLimit);
    setPage(1);
  };

  const handleDownload = async (docId) => {
    const selectedReferral = await getById(docId);
    const {
      id,
      priority,
      diagnostic,
      investigation,
      releaseDate
    } = selectedReferral;
    const {
      firstName,
      lastName,
      cnp,
      address,
      insuredCode,
      insuredType
    } = selectedReferral.User;
    const {
      firstName: doctorFirstName,
      lastName: doctorLastName,
      medicalCode,
    } = selectedReferral.User.User;
    const splittedInvestigations = (investigation || []).join('\n\t');

    const filename = `BT${id}`;
    const title = 'BILET DE TRIMITERE';
    const subtitle = `- seria si nr. ${filename} -`
    const document = `
      CAZ PRIORITAR/URGENTA: ${priority ? 'DA' : 'NU'}
    
      ASIGURAT
        Nume si prenume: ${lastName} ${firstName}
        CNP: ${cnp}
        Domiciliu: ${address}
        Cod CNAS: ${insuredCode}
        Tip asigurat: ${insuredType}
        
      DIAGNOSTIC:
        ${diagnostic}
      
      INVESTIGATII INDICATE:
        ${splittedInvestigations}
      
      MEDIC
        Nume si prenume: ${doctorFirstName} ${doctorLastName}
        Cod parafa: ${medicalCode}
        
      DATA ELIBERARII: ${releaseDate.slice(0, 10)}
      
      * valabil 60 zile de la data eliberarii
    `;

    generatePdf(title, subtitle, document, filename)
  };

  return (
    <div>
      <Typography variant="h5" style={{ marginBottom: '25px'}} gutterBottom>
        Bilete de trimitere eliberate
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
            onClick={() => setShowAddReferral(!showAddReferral)}
            endIcon={showAddReferral ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          >
            Elibereaza un nou bilet de trimitere
          </Button>
          {showAddReferral && (
            <Referral
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
          Solicita un bilet de trimitere
        </Button>
      )}
    </div>
  )
};

export default Referrals;
