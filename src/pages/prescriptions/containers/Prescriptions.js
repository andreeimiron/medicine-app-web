import React, {useEffect, useState} from 'react';
import Prescription from './Prescription';
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

const Prescriptions = () => {
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
    releaseDate: {
      type: 'date',
      label: 'Data eliberarii',
      name: 'releaseDate',
      value: new Date().toISOString().slice(0, 10),
      error: '',
      required: true
    },
    medicamentations: {
      type: 'text',
      label: 'Medicamentatie',
      name: 'medicamentations',
      value: '',
      error: '',
      required: false
    },
  };
  const [showAddPrescription, setShowAddPrescription] = useState(false);
  const loggedUser = JSON.parse(localStorage.getItem('user')) || {};
  const isDoctor = loggedUser.role === 'medic';
  const tableHead = [{ id: 'priority', label: 'Caz prioritar' }, { id: 'diagnostic', label: 'Diagnostic' }, { id: 'medicamentation', label: 'Medicamentatie' }, { id: 'releaseDate', label: 'Data eliberarii' },]
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
            medicamentation: (row.medicamentation || []).join(', ')
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
          delete row.priority;
          delete row.updatedAt;
          delete row.createdAt;
          delete row.userId;

          return {
            id: row.id,
            priority,
            ...row,
            releaseDate: row.releaseDate.slice(0, 10),
            medicamentation: (row.medicamentation || []).join(', ')
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

  const handleChangePage = (newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (newLimit) => {
    setRowsPerPage(newLimit);
    setPage(1);
  };

  const handleDownload = async (docId) => {
    const selectedPrescription = await getById(docId);
    const {
      id,
      diagnostic,
      releaseDate,
      medicamentation
    } = selectedPrescription;
    const {
      firstName,
      lastName,
      cnp,
      address,
      insuredCode
    } = selectedPrescription.User;
    const {
      firstName: doctorFirstName,
      lastName: doctorLastName,
      medicalCode,
    } = selectedPrescription.User.User;
    const splittedMedicamentation = (medicamentation || []).join('\n\t');

    const filename = `RM${id}`;
    const title = 'RETETA MEDICALA';
    const subtitle = `- seria si nr. ${filename} -`;
    const document = `
      ASIGURAT
        Nume si prenume: ${lastName} ${firstName}
        CNP: ${cnp}
        Domiciliu: ${address}
        Cod CNAS: ${insuredCode}
 
      DIAGNOSTIC:
        ${diagnostic}
      
      MEDICAMENTATIE:
        ${splittedMedicamentation}
      
      MEDIC
        Nume si prenume: ${doctorFirstName} ${doctorLastName}
        Cod parafa: ${medicalCode}
        
      DATA ELIBERARII: ${releaseDate.slice(0, 10)}
    `;

    generatePdf(title, subtitle, document, filename)
  }

  return (
    <div>
      <Typography variant="h5" style={{ marginBottom: '25px'}} gutterBottom>
        Retete medicale eliberate
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
            onClick={() => setShowAddPrescription(!showAddPrescription)}
            endIcon={showAddPrescription ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          >
            Elibereaza o noua reteta medicala
          </Button>
          {showAddPrescription && (
            <Prescription
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
          Solicita o reteta medicala
        </Button>
      )}

    </div>
  )
};

export default Prescriptions;
