import React, {useEffect, useState} from 'react';
import Consultation from './Consultation';
import Table from "../../../components/PaginatedTable";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { getAllByUser } from "../api";
import { getAll } from "../../patients/api";
import 'react-notifications/lib/notifications.css';
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles((theme) => ({
  selectPatient: {
    width: '46%',
    marginBottom: '20px'
  },
  button: {
    marginTop: '25px'
  }
}));

const Consultations = () => {
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
    observations: {
      type: 'text',
      label: 'Observatii',
      name: 'observations',
      value: '',
      error: '',
      required: false
    },
    date: {
      type: 'date',
      label: 'Data consultatiei',
      name: 'date',
      value: new Date().toISOString().slice(0, 10),
      error: '',
      required: true
    }
  };
  const [showAddConsultation, setShowAddConsultation] = useState(false);
  const loggedUser = JSON.parse(localStorage.getItem('user')) || {};
  const isDoctor = loggedUser.role === 'medic';
  const tableHead = Object.values(defaultData).map(({ name, label }) => ({ id: name, label })) || [];
  const columns = [{id: 'id', label: 'ID Ref.'}, ...tableHead];
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectData, setSelectData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userError, setUserError] = useState(null);

  useEffect(() => fetchUsers(), []);

  useEffect( () => {
    if (selectedUser || !isDoctor) {
      fetchData();
    }
  }, [page, rowsPerPage, selectedUser])

  const fetchUsers = async () => {
    const users = await getAll({});
    const { data: { rows } } = users;

    setSelectData(rows);
  }

  const fetchData = async () => {
    try {
      const data = await getAllByUser({
        userId: isDoctor ? selectedUser.id : loggedUser.id,
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

  const onSelect = (event, value) => {
    setSelectedUser(value);
    setUserError(null);
  }

  return (
    <div>
      <Typography variant="h5" style={{ marginBottom: '25px'}} gutterBottom>
        {!isDoctor ? 'Istoric consultatii' : 'Istoric consulatii pacient'}
      </Typography>
      {isDoctor && (
        <React.Fragment>
          <Autocomplete
            id="pacient-combo-box"
            options={selectData}
            groupBy={(option) => option.lastName[0]}
            getOptionLabel={(option) => `${option.lastName} ${option.firstName} [CNP: ${option.cnp}]` }
            style={{ paddingTop: '16px' }}
            className={classes.selectPatient}
            value={selectedUser}
            onChange={onSelect}
            renderInput={(params) =>
              <TextField
                {...params}
                error={userError}
                helperText={userError}
                required
                label="Alege pacietul"
              />
            }
          />
          {selectedUser && (
            <React.Fragment>
              {totalRows ?
                <Table
                  rows={rows}
                  columns={columns}
                  onPageChange={handleChangePage}
                  onLimitChange={handleChangeRowsPerPage}
                  totalRows={totalRows}
                  onClick={() => {}}
                /> :
                <Typography variant="body1" style={{ display: 'flex', alignItems: 'center' }}gutterBottom>
                  <ErrorOutlineIcon style={{ marginRight: '5px' }} />
                  Nu exista date inregistrate pentru acest pacient
                </Typography>
              }
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={() => setShowAddConsultation(!showAddConsultation)}
                endIcon={showAddConsultation ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              >
                Adauga o noua consultatie
              </Button>
              {showAddConsultation && (
                <Consultation
                  fields={defaultData}
                  onCreate={() => fetchData()}
                  patient={selectedUser}
                  onUserError={(error) => setUserError(error)}

                />
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      )}
      {!isDoctor && (totalRows ?
          <Table
            rows={rows}
            columns={columns}
            onPageChange={handleChangePage}
            onLimitChange={handleChangeRowsPerPage}
            totalRows={totalRows}
            onClick={() => {}}
          /> :
          <Typography variant="body1" style={{ display: 'flex', alignItems: 'center' }} gutterBottom>
            <ErrorOutlineIcon style={{ marginRight: '5px' }} />
            Nu exista date inregistrate
          </Typography>
      )}
    </div>
  )
};

export default Consultations;
