import React, { useEffect, useState } from 'react';
import Certificate from './Certificate';
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

const Certificates = () => {
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
    recomandation: {
      type: 'text',
      label: 'Recomandare',
      name: 'recomandation',
      value: '',
      error: '',
      required: false
    },
    releaseReason: {
      type: 'text',
      label: 'Motivul eliberarii',
      name: 'releaseReason',
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
    },
    ableFor: {
      type: 'text',
      label: 'Apt pentru',
      name: 'ableFor',
      value: '',
      error: '',
      required: false
    },
    result: {
      type: 'text',
      label: 'Rezultate investigatii',
      name: 'result',
      value: '',
      error: '',
      required: false
    },
    conclusion: {
      type: 'text',
      label: 'Concluzii',
      name: 'conclusion',
      value: '',
      error: '',
      required: false
    },
  };
  const [showAddCertificate, setShowAddCertificate] = useState(false);
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
    const selectedSickLeave = await getById(docId);
    const {
      id,
      diagnostic,
      recomandation,
      releaseReason,
      startDate,
      endDate,
      ableFor,
      result,
      conclusion,
    } = selectedSickLeave;
    const {
      firstName,
      lastName,
      cnp,
      address,
      gender,
      birthDate,
      insuredCode
    } = selectedSickLeave.User;
    const {
      firstName: doctorFirstName,
      lastName: doctorLastName,
      medicalCode,
    } = selectedSickLeave.User.User;

    const filename = `AM${id}`;
    const title = 'ADEVERINTA MEDICALA';
    const subtitle = `- seria si nr. ${filename} -`
    const document = `
        Se adevereste ca ${lastName} ${firstName},
      sexul ${gender}, CNP ${cnp},
      nascut la data de ${birthDate.slice(0, 10)},
      cu domiciuliu in ${address},
      cod CNAS ${insuredCode}
        
        Este suferind(a) de: ${diagnostic}
        Se recomanda: ${recomandation || '-'}
        Eliberat pentru: ${releaseReason || '-'}
        Apt pentru: ${ableFor || '-'}
        Rezultate investigatii: ${result || '-'}
        Concluzii: ${conclusion || '-'}
      
      MEDIC
        Nume si prenume: ${doctorFirstName} ${doctorLastName}
        Cod parafa: ${medicalCode}
        
      ${startDate.slice(0, 10) === endDate.slice(0, 10)
      ? `DATA ELIBERARII: ${startDate.slice(0, 10)}`
      : `PERIOADA: ${startDate.slice(0, 10)} - ${endDate.slice(0, 10)}`} 
    `;

    generatePdf(title, subtitle, document, filename)
  };

  return (
    <div>
      <Typography variant="h5" style={{ marginBottom: '25px'}} gutterBottom>
        Adeverinte medicale eliberate
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
            onClick={() => setShowAddCertificate(!showAddCertificate)}
            endIcon={showAddCertificate ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          >
            Elibereaza o noua adeverinta
          </Button>
          {showAddCertificate && (
            <Certificate
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
          Solicita o adeverinta
        </Button>
      )}
    </div>
  )
};

export default Certificates;
