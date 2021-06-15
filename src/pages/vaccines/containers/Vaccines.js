import React, { useEffect, useState } from 'react';
import Vaccine from './Vaccine';
import Table from "../../../components/PaginatedTable";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { getAllByUser, getAllByDoctor } from "../api";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { generatePdfFromTable } from "../../../utils/generatePdf";
import { getById } from '../../patients/api';

const useStyles = makeStyles(() => ({
  button: {
    marginTop: '25px'
  },
}));

const Vaccines = () => {
  const classes = useStyles();
  const defaultData = {
    type: {
      type: 'text',
      label: 'Tip Vaccin',
      name: 'type',
      value: '',
      error: '',
      required: true
    },
    description: {
      type: 'text',
      label: 'Descriere',
      name: 'description',
      value: '',
      error: '',
      required: true
    },
    date: {
      type: 'date',
      label: 'Data efectuarii',
      name: 'date',
      value: new Date().toISOString().slice(0, 10),
      error: '',
      required: true,
    },
  };
  const [showAddVaccine, setShowAddVaccine] = useState(false);
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
            date: row.date.slice(0, 10)
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
            date: row.date.slice(0, 10)
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

  const handleTableDownload = async () => {
    const filename = 'lista-vaccinuri';
    const title = 'LISTA VACCINURI EFECTUATE';
    let document = '';

    if (!isDoctor) {
      const doctor = await getById(loggedUser.doctorId);
      const {
        firstName,
        lastName,
        cnp,
        address,
        insuredCode
      } = loggedUser;
      const {
        firstName: doctorFirstName,
        lastName: doctorLastName,
        medicalCode
      } = doctor;

      document = `
      PACIENT
        Nume si prenume: ${lastName} ${firstName}
        CNP: ${cnp}
        Domiciliu: ${address}
        Cod CNAS: ${insuredCode}
        
      MEDIC
        Nume si prenume: ${doctorFirstName} ${doctorLastName}
        Cod parafa: ${medicalCode}
      `;
    } else {
      const {
        firstName,
        lastName,
        medicalCode
      } = loggedUser;

      document = `
      MEDIC
        Nume si prenume: ${firstName} ${lastName}
        Cod parafa: ${medicalCode}
      `;
    }

    generatePdfFromTable(title, document, 'vaccine-table', filename);
  };

  return (
    <div>
      <Typography variant="h5" style={{ marginBottom: '25px'}} gutterBottom>
        Vaccinuri realizate
      </Typography>
      {totalRows ?
        <Table
          id='vaccine-table'
          rows={rows}
          columns={columns}
          onPageChange={handleChangePage}
          onLimitChange={handleChangeRowsPerPage}
          totalRows={totalRows}
          onClick={() => {}}
          downloadTable={true}
          onTableDownload={() => handleTableDownload()}
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
            onClick={() => setShowAddVaccine(!showAddVaccine)}
            endIcon={showAddVaccine ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          >
            Inregistreaza un nou vaccin
          </Button>
          {showAddVaccine && (
            <Vaccine
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
          href='https://www.cnscbt.ro/index.php/calendarul-national-de-vaccinare'
          target="_blank"
          endIcon={<KeyboardArrowRightIcon />}
        >
          Vezi calendarul national de vaccinare
        </Button>
      )}
    </div>
  )
};

export default Vaccines;
