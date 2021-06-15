import React, {useEffect, useState} from 'react';
import Patient from './Patient';
import Table from "../../../components/PaginatedTable";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { getAllByDoctor, getById } from "../api";
import 'react-notifications/lib/notifications.css';
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import {generatePdf} from "../../../utils/generatePdf";

const useStyles = makeStyles(() => ({
  button: {
    marginTop: '25px'
  },
}));


const Patients = () => {
  const classes = useStyles();
  const pathname = window.location.pathname;
  const defaultData = {
    lastName: {
      type: 'text',
      label: 'Nume',
      name: 'lastName',
      value: '',
      error: '',
      required: true
    },
    firstName: {
      type: 'text',
      label: 'Prenume',
      name: 'firstName',
      value: '',
      error: '',
      required: true
    },
    email: {
      type: 'text',
      label: 'Email',
      name: 'email',
      value: '',
      error: '',
      required: true
    },
    password: {
      type: 'password',
      label: 'Parola',
      name: 'password',
      value: 'asdf1234',
      error: '',
      required: true
    },
    role: {
      type: 'text',
      label: 'Tip cont',
      name: 'role',
      value: 'pacient',
      error: '',
      required: true,
      disabled: true
    },
    cnp: {
      type: 'text',
      label: 'CNP',
      name: 'cnp',
      value: '',
      error: '',
      required: true,
      disabled: pathname === '/profile' ? true : false
    },
    serialNumber: {
      type: 'text',
      label: 'Serie si nr. buletin',
      name: 'serialNumber',
      value: '',
      error: '',
      required: true
    },
    nationality: {
      type: 'text',
      label: 'Nationalitate',
      name: 'nationality',
      value: '',
      error: '',
      required: true
    },
    birthDate: {
      type: 'date',
      label: 'Data nasterii',
      name: 'birthDate',
      value: new Date().toISOString().slice(0, 10),
      error: '',
      required: true,
      disabled: pathname === '/profile' ? true : false
    },
    birthPlace: {
      type: 'text',
      label: 'Locul nasterii',
      name: 'birthPlace',
      value: '',
      error: '',
      required: true,
      disabled: pathname === '/profile' ? true : false
    },
    address: {
      type: 'text',
      label: 'Adresa',
      name: 'address',
      value: '',
      error: '',
      required: true
    },
    gender: {
      type: 'text',
      label: 'Sex',
      name: 'gender',
      value: 'feminin',
      error: '',
      required: true,
      selectData: ['feminin', 'masculin'],
      disabled: pathname === '/profile' ? true : false
    },
    motherName: {
      type: 'text',
      label: 'Nume mama',
      name: 'motherName',
      value: '',
      error: '',
      required: true
    },
    fatherName: {
      type: 'text',
      label: 'Nume tata',
      name: 'fatherName',
      value: '',
      error: '',
      required: false
    },
    jobTitle: {
      type: 'text',
      label: 'Ocupatie',
      name: 'jobTitle',
      value: '',
      error: '',
      required: false
    },
    companyName: {
      type: 'text',
      label: 'Nume companie',
      name: 'companyName',
      value: '',
      error: '',
      required: false
    },
    phoneNumber: {
      type: 'text',
      label: 'Numar de telefon',
      name: 'phoneNumber',
      value: '',
      error: '',
      required: false
    },
    emergencyContactName: {
      type: 'text',
      label: 'Persoana de contact in caz de urgenta',
      name: 'emergencyContactName',
      value: '',
      error: '',
      required: false
    },
    emergencyContactPhoneNumber: {
      type: 'text',
      label: 'Nr. telefon persoana de contact',
      name: 'emergencyContactPhoneNumber',
      value: '',
      error: '',
      required: false
    },
    medicalCode: {
      type: 'text',
      label: 'Cod parafa',
      name: 'medicalCode',
      value: '',
      error: '',
      required: false,
      disabled: pathname === '/profile' ? true : false
    },
    insuredCode: {
      type: 'text',
      label: 'Nr. asigurat CNAS',
      name: 'insuredCode',
      value: '',
      error: '',
      required: false
    },
    currentMedication: {
      type: 'text',
      label: 'Medicatie curenta',
      name: 'currentMedication',
      value: '',
      error: '',
      required: false,
      listData: [],
      disabled: pathname === '/profile' ? true : false
    },
    bloodType: {
      type: 'text',
      label: 'Grupa sanguina',
      name: 'bloodType',
      value: 'O-',
      error: '',
      required: true,
      selectData: ['O-','O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      disabled: pathname === '/profile' ? true : false
    },
    allergies: {
      type: 'text',
      label: 'Alergii',
      name: 'allergies',
      value: '',
      error: '',
      required: false,
      listData: [],
      disabled: pathname === '/profile' ? true : false
    },
    insuredType: {
      type: 'text',
      label: 'Tip asigurat',
      name: 'insuredType',
      value: 'salariat',
      error: '',
      required: true,
      selectData: ['salariat', 'coasigurat', 'liber profesionist', 'copil (<18 ani)', 'elev/student (18-26 ani)', 'gravida/lehuza', 'pensionar', 'veteran', 'revolutionar', 'handicap', 'ajutor social', 'somaj', 'card european (CE)', 'acorduri internationale', 'alte categorii'],
      disabled: pathname === '/profile' ? true : false
    },
    birthType: {
      type: 'text',
      label: 'Tip nastere',
      name: 'birthType',
      value: 'naturala',
      error: '',
      required: true,
      selectData: ['naturala', 'cezariana'],
      disabled: pathname === '/profile' ? true : false
    },
    weight: {
      type: 'number',
      label: 'Greutate (kg)',
      name: 'weight',
      value: '0',
      error: '',
      required: false
    },
    height: {
      type: 'number',
      label: 'Inaltime (cm)',
      name: 'height',
      value: '0',
      error: '',
      required: false
    },
    lastPeriod: {
      type: 'date',
      label: 'Ultima menstruatie',
      name: 'lastPeriod',
      value: new Date().toISOString().slice(0, 10),
      error: '',
      required: false
    }
  };
  const loggedUser = JSON.parse(localStorage.getItem('user')) || {};
  const isDoctor = loggedUser.role === 'medic';
  const columns = [{id: 'id', label: 'ID Ref.'}, { id: 'lastName', label: 'Nume' }, { id: 'firstName', label: 'Prenume' }, { id: 'cnp', label: 'CNP' }, { id: 'gender', label: 'Sex' }, { id: 'phoneNumber', label: 'Numar de telefon' }]
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState(null);
  const [data, setData] = useState(defaultData);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showPatient, setShowPatient] = useState(false);

  useEffect( () => {
    fetchData();
  }, [page, rowsPerPage]);

  const fetchData = async () => {
    try {
      if (isDoctor && pathname === '/patients') {
        const data = await getAllByDoctor({
          doctorId: loggedUser.id,
          page,
          limit: rowsPerPage
        });
        const { data: { rows }, totalRows } = data;
        const updatedRows = rows.map((row) => {
          return {
            id: row.id,
            lastName: row.lastName,
            firstName: row.firstName,
            cnp: row.cnp,
            gender: row.gender,
            phoneNumber: row.phoneNumber
          };
        });

        setRows(updatedRows);
        setTotalRows(totalRows);
      } else {
        // const user = await getById(loggedUser.id);
        onTableRowClick(loggedUser.id)

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

  const onTableRowClick = async (userId) => {
    const user = await getById(userId);
    setSelectedUser(user);

    delete user.createdAt;
    delete user.updatedAt;

    const dataClone = {...data};

    Object.entries(user).forEach(([key, value]) => {
      if (dataClone[key]) {
        if (key === 'allergies' || key === 'currentMedication') {
          dataClone[key].listData = value;
        } else {
         if (dataClone[key].type === 'date') {
           if (value) {
             dataClone[key].value = value.slice(0, 10);
           }
         } else {
           dataClone[key].value = value;
         }
        }
      }
    });

    setData(dataClone);
  };

  const handleDownload = async (userId) => {
    const selUser = await getById(userId);
    const doctor = await getById(selUser.doctorId);
    const {
      id,
      lastName,
      firstName,
      email,
      cnp,
      serialNumber,
      nationality,
      birthDate,
      birthPlace,
      address,
      gender,
      motherName,
      fatherName,
      jobTitle,
      phoneNumber,
      emergencyContactName,
      emergencyContactPhoneNumber,
      insuredCode,
      currentMedication,
      bloodType,
      allergies,
      insuredType,
      birthType,
      weight,
      height,
      lastPeriod
    } = selUser;
    const {
      firstName: doctorFirstName,
      lastName: doctorLastName,
      medicalCode,
    } = doctor;

    const filename = `IGP${id}`;
    const title = 'INFORMATII GENERALE PACIENT';
    const subtitle = `- ref. pacient ${filename} -`
    const today = new Date().toISOString().slice(0, 10);
    const document = `
      PACIENT
        Nume si prenume: ${lastName} ${firstName}
        Email: ${email}
        CNP: ${cnp}
        CI/Pasaport: ${serialNumber}
        Nationalitate: ${nationality}
        Data nasterii: ${birthDate.slice(0, 10)}
        Locul naterii: ${birthPlace}
        Domiciliu: ${address}
        Sex: ${gender}
        Numele mamei: ${motherName}
        Numele tatalui: ${fatherName || '-'}
        Ocupatie: ${jobTitle || '-'}
        Nr. telefon: ${phoneNumber}
        Persoana contact in caz de urgenta: ${emergencyContactName}
        Nr. telefon persoana de contact: ${emergencyContactPhoneNumber}
        Medicatie curenta:
          ${(currentMedication || []).join('\n\t  ') || '-'}
        Grupa sanguina: ${bloodType}
        Alergii:
          ${(allergies || []).join('\n\t  ') || '-'}
        Cod CNAS: ${insuredCode}
        Tip asigurat: ${insuredType}
        Tip nastere: ${birthType}
        Greutate: ${weight}kg
        Inaltime: ${height}cm
        ${gender === 'feminin' ? `Ultima menstruatie: ${lastPeriod.slice(0, 10)}` : ''}
      
      MEDIC
        Nume si prenume: ${doctorFirstName} ${doctorLastName}
        Cod parafa: ${medicalCode}
        
      DATA ELIBERARII: ${today}
    `;

    generatePdf(title, subtitle, document, filename);
  };

  return (
    <div>
      <Typography variant="h5" style={{ marginBottom: '25px'}} gutterBottom>
        {pathname === '/patients' ? 'Pacienti' : 'Informatii generale'}
      </Typography>
      {isDoctor && pathname === '/patients' && (
        <React.Fragment>
          {totalRows ?
            <Table
              rows={rows}
              columns={columns}
              onPageChange={handleChangePage}
              onLimitChange={handleChangeRowsPerPage}
              totalRows={totalRows}
              onClick={(userId) => onTableRowClick(userId)}
              download={true}
              onDownload={(userId) => handleDownload(userId)}
              pointer={true}
            /> :
            <Typography variant="body1" style={{ display: 'flex', alignItems: 'center' }} gutterBottom>
              <ErrorOutlineIcon style={{ marginRight: '5px' }} />
              Nu exista date inregistrate
            </Typography>
          }
          {selectedUser && (
            <div>
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={() => setShowPatient(!showPatient)}
                endIcon={showPatient ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              >
                {`Informatii generale despre ${selectedUser.lastName} ${selectedUser.firstName}`}
              </Button>
              {showPatient && (
                <Patient
                  fields={data}
                  onCreate={() => fetchData()}
                  showMode={true}
                  selectedUser={selectedUser}
                />
              )}
            </div>
          )}
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={() => setShowAddPatient(!showAddPatient)}
            endIcon={showAddPatient ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          >
            Adauga un nou pacient
          </Button>
          {showAddPatient && (
            <Patient
              fields={defaultData}
              onCreate={() => fetchData()}
              addMode={true}
            />
          )}
        </React.Fragment>
      )}
      {pathname === '/profile' && (
        <Patient
          fields={data}
          onCreate={() => fetchData()}
          editMode={true}
          download={true}
          onDownload={() => handleDownload(loggedUser.id)}
        />
      )}
    </div>
  )
};

export default Patients;
