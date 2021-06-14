import React, {useEffect, useState} from 'react';
import Request from './Request';
import Table from "../../../components/PaginatedTable";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { getAllByUser, getAllByDoctor, getById } from "../api";
import 'react-notifications/lib/notifications.css';
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

const useStyles = makeStyles(() => ({
  button: {
    marginTop: '25px'
  },
}));

const Requests = () => {
  const classes = useStyles();
  const loggedUser = JSON.parse(localStorage.getItem('user')) || {};
  const isDoctor = loggedUser.role === 'medic';
  const defaultData = {
    type: {
      type: 'text',
      label: 'Tip document',
      name: 'type',
      value: 'reteta medicala',
      error: '',
      required: true,
      selectData: ['reteta medicala', 'adeverinta medicala', 'bilet de trimitere', 'concediu medical'],
      disabled: isDoctor ? true : false
    },
    reason: {
      type: 'text',
      label: 'Motiv necesitate',
      name: 'reason',
      value: '',
      error: '',
      required: true,
      disabled: isDoctor ? true : false
    },
    date: {
      type: 'date',
      label: 'Data',
      name: 'date',
      value: new Date().toISOString().slice(0, 10),
      error: '',
      required: true,
      disabled: true
    },
    solved: {
      type: 'text',
      label: 'Rezolvat',
      name: 'solved',
      value: false,
      error: '',
      required: true,
      checkbox: true,
      disabled: !isDoctor ? true : false
    }
  };
  const [showAddRequest, setShowAddRequest] = useState(false);

  const tableHead = Object.values(defaultData).map(({ name, label }) => ({ id: name, label })) || [];
  const columns = isDoctor
    ? [{id: 'id', label: 'ID Ref.'}, { id: 'fullName', label: 'Nume si prenume' }, ...tableHead]
    : [{id: 'id', label: 'ID Ref.'}, ...tableHead];
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRequest,  setSelectedRequest] = useState(null);
  const [data, setData] = useState(defaultData);
  const [showNewReferral, setShowNewReferral] = useState(false);

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
          const solved = row.solved ? 'DA' : 'NU';
          delete row.updatedAt;
          delete row.createdAt;
          delete row.userId;

          return {
            id: row.id,
            fullName: `${user.lastName} ${user.firstName}`,
            ...row,
            date: row.date.slice(0, 10),
            solved
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
          const solved = row.solved ? 'DA' : 'NU';
          delete row.updatedAt;
          delete row.createdAt;
          delete row.userId;

          return {
            id: row.id,
            ...row,
            date: row.date.slice(0, 10),
            solved
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

  const onTableRowClick = async (requestId) => {
    const request = await getById(requestId);
    setSelectedRequest(request);

    delete request.createdAt;
    delete request.updatedAt;

    const dataClone = {...data};

    Object.entries(request).forEach(([key, value]) => {
      if (dataClone[key]) {
        if (dataClone[key].type === 'date') {
          if (value) {
            dataClone[key].value = value.slice(0, 10);
          }
        } else {
          dataClone[key].value = value;
        }
      }
    });

    setData(dataClone);
  }

  return (
    <div>
      <Typography variant="h5" style={{ marginBottom: '25px'}} gutterBottom>
        Documente solicitate
      </Typography>
      {totalRows ?
        <Table
          rows={rows}
          columns={columns}
          onPageChange={handleChangePage}
          onLimitChange={handleChangeRowsPerPage}
          totalRows={totalRows}
          onClick={(requestId) => onTableRowClick(requestId)}
          pointer={isDoctor}
        /> :
        <Typography variant="body1" style={{ display: 'flex', alignItems: 'center' }}gutterBottom>
          <ErrorOutlineIcon style={{ marginRight: '5px' }} />
          Nu exista date inregistrate
        </Typography>
      }
      {isDoctor && selectedRequest && (
        <React.Fragment>
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={() => setShowAddRequest(!showAddRequest)}
            endIcon={showAddRequest ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          >
            {`Solutioneaza cererea nr. ${selectedRequest.id}`}
          </Button>
          {showAddRequest && (
            <Request
              fields={data}
              onCreate={() => fetchData()}
              selectedRequest={selectedRequest}
            />
          )}
        </React.Fragment>
      )}
      {!isDoctor && (
        <React.Fragment>
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={() => setShowNewReferral(!showNewReferral)}
            endIcon={showNewReferral ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          >
            Solicita un document
          </Button>
          {showNewReferral && (
            <Request
              fields={defaultData}
              onCreate={() => fetchData()}
            />
          )}
        </React.Fragment>
      )}
    </div>
  )
};

export default Requests;
