import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Autocomplete from '@material-ui/lab/Autocomplete';
import CreateIcon from '@material-ui/icons/Create';
import Joi from "joi-browser";
import { create } from '../api';
import { getAll } from '../../patients/api';
import CircularProgress from '@material-ui/core/CircularProgress';
import { showError, showSuccess } from '../../../utils/notification';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(() => ({
  container: {
    padding: '10px 0',
    display: 'flex',
    flexDirection: 'column'
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    display: 'flex',
    flex: '1 46%',
    justifyContent: 'space-between',
    '&:not(:nth-child(2n))': {
      marginRight: '15px'
    }
  },
  submitButton: {
    display: 'flex',
    flex: '1 46%',
    margin: '15px 0',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  footer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  list: {
    position: 'relative',
    overflow: 'auto',
    maxHeight: 150,
    display: 'flex',
    flex: '1 46%',
    flexDirection: 'column',
    marginRight: '15px'
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  listUl: {
    backgroundColor: 'inherit',
    padding: 0,
  },
}));

const Referral = ({ fields, onCreate }) => {
  const updatedFields = {
    diagnostic: {
      ...fields['diagnostic']
    },
    releaseDate: {
      ...fields['releaseDate']
    }
  };
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState(updatedFields);
  const [selectData, setSelectData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userError, setUserError] = useState(null);
  const [medicamentations, setMedicamentations] = useState([]);
  const [newMedicamentation, setNewMedicamentation] = useState('');
  const [medicamentationError, setMedicamentationError] = useState(null);

  useEffect(() => fetchUsers(), []);
  const fetchUsers = async () => {
    const users = await getAll({});
    const { data: { rows } } = users;

    setSelectData(rows);
  }

  const schema = {
    diagnostic: Joi.string().required().label(data.diagnostic.label),
    releaseDate: Joi.date().raw().required().label(data.releaseDate.label),
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const prescription = {
      diagnostic: data.diagnostic.value,
      releaseDate: data.releaseDate.value,
    };
    let formIsValid = true;
    const result = Joi.validate(prescription, schema, { abortEarly: false });

    const dataClone = { ...data };
    Object.keys(dataClone).forEach((key) => {
      dataClone[key].error = '';
    });
    setUserError(null);

    if (result.error) {
      formIsValid = false;
      result.error.details.forEach((err) => {
        dataClone[err.path[0]].error = err.message.replaceAll('"', '');
      });
    }

    setData(dataClone);

    if (!selectedUser) {
      formIsValid = false;
      setUserError('Pacientul is not allowed to be empty');
    }

    if (formIsValid) {
      setLoading(true);
      setDisabled(true);

      try {
        prescription.userId = selectedUser.id;
        prescription.medicamentation = medicamentations;
        await create(prescription);

        onCreate();
        setData(updatedFields);
        setSelectedUser(null);
        setNewMedicamentation('');
        setMedicamentations([]);
        setMedicamentationError(null);
        showSuccess('Reteta medicala a fost trimis cu succes catre pacient');
      } catch (error) {
        showError(error);
      }

      setLoading(false);
      setDisabled(false);
    }
  };

  const onSelect = (event, value) => {
    setSelectedUser(value);
    setUserError(null);
  }

  const onChangeMedicamentation = (event) => {
    const { value } = event.target;

    setNewMedicamentation(value);
  }

  const onAddMedicamentation = () => {
    if (newMedicamentation) {
      setMedicamentations([newMedicamentation, ...medicamentations]);
      setNewMedicamentation('');
      setMedicamentationError(null);
    } else {
      setMedicamentationError('Medicamentatie is not allowed to be empty');
    }
  }

  const onChange = (event) => {
    const { value, name } = event.target;

    setData((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value,
        error: ''
      },
    }));
  };

  return (
    <Paper style={{ padding: '0 15px', marginTop: '10px' }}>
      <div className={classes.container}>
        <form noValidate className={classes.form}>
          <Autocomplete
            id="pacient-combo-box"
            options={selectData}
            groupBy={(option) => option.lastName[0]}
            getOptionLabel={(option) => `${option.lastName} ${option.firstName} [CNP: ${option.cnp}]` }
            style={{ paddingTop: '16px' }}
            className={classes.textField}
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
          <TextField
            className={classes.textField}
            margin="normal"
            required={data.diagnostic.required}
            fullWidth
            id={data.diagnostic.name}
            label={data.diagnostic.label}
            name={data.diagnostic.name}
            type={data.diagnostic.type}
            autoComplete={data.diagnostic.name}
            value={data.diagnostic.value}
            InputLabelProps={data.diagnostic.type === 'date' ? {shrink: true} : null}
            autoFocus
            onChange={onChange}
            error={data.diagnostic.error}
            helperText={data.diagnostic.error}
          />
          <div className={classes.textField} style={{ position: 'relative' }}>
            <TextField
              margin="normal"
              fullWidth
              id='medicamentation'
              label='Medicamentatie'
              name='investigatie'
              type='text'
              autoComplete='investigatie'
              value={newMedicamentation}
              autoFocus
              onChange={onChangeMedicamentation}
              error={medicamentationError}
              helperText={medicamentationError}
            />
            <IconButton
              style={{ position: 'absolute', right: 0, marginTop: '20px' }}
              aria-label="add medicamentation"
              onClick={onAddMedicamentation}
            >
              <AddCircleIcon />
            </IconButton>
          </div>
          <TextField
            className={classes.textField}
            margin="normal"
            required={data.releaseDate.required}
            fullWidth
            id={data.releaseDate.name}
            label={data.releaseDate.label}
            name={data.releaseDate.name}
            type={data.releaseDate.type}
            autoComplete={data.releaseDate.name}
            value={data.releaseDate.value}
            InputLabelProps={data.releaseDate.type === 'date' ? {shrink: true} : null}
            autoFocus
            onChange={onChange}
            error={data.releaseDate.error}
            helperText={data.releaseDate.error}
          />
          <List className={classes.list}>
            {medicamentations.map((value, index) => (
              <ListItem key={`item-${index}`}>
                <ListItemIcon>
                  <CheckBoxIcon />
                </ListItemIcon>
                <ListItemText primary={value}/>
              </ListItem>
            ))}
          </List>
          <div className={classes.textField} />
          <Typography
            variant="body1"
            align="left"
            style={{ marginTop: '20px' }}
            className={classes.textField}
          >
            * Acest camp este obligatoriu
          </Typography>
          <Button
            type="submit"
            size="medium"
            variant="contained"
            color="primary"
            disabled={disabled}
            className={classes.submitButton}
            onClick={onSubmit}
            startIcon={loading ? <CircularProgress size="20px" /> : <CreateIcon />}
          >
            Semneaza si genereaza
          </Button>
        </form>
      </div>
    </Paper>
  )
};

export default Referral;
