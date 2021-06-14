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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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
  const [priority, setPriority] = useState(false);
  const [investigations, setInvestigations] = useState([]);
  const [newInvestigation, setNewInvestigation] = useState('');
  const [investigationError, setInvestigationError] = useState(null);

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

    const referral = {
      diagnostic: data.diagnostic.value,
      releaseDate: data.releaseDate.value,
    };
    let formIsValid = true;
    const result = Joi.validate(referral, schema, { abortEarly: false });

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
        referral.userId = selectedUser.id;
        referral.priority = priority;
        referral.investigation = investigations;
        await create(referral);

        onCreate();
        setData(updatedFields);
        setSelectedUser(null);
        setNewInvestigation('');
        setInvestigations([]);
        setInvestigationError(null);
        showSuccess('Biletul de trimitere a fost trimis cu succes catre pacient');
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

  const onChangeInvestigation = (event) => {
    const { value } = event.target;

    setNewInvestigation(value);
  }

  const onAddInvestigation = () => {
    if (newInvestigation) {
      setInvestigations([newInvestigation, ...investigations]);
      setNewInvestigation('');
      setInvestigationError(null);
    } else {
      setInvestigationError('Investigatie is not allowed to be empty');
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
          {Object.values(data).map((field) => (
              <TextField
                className={classes.textField}
                margin="normal"
                required={field.required}
                fullWidth
                id={field.name}
                label={field.label}
                name={field.name}
                type={field.type}
                autoComplete={field.name}
                value={field.value}
                InputLabelProps={field.type === 'date' ? {shrink: true} : null}
                autoFocus
                onChange={onChange}
                error={field.error}
                helperText={field.error}
              />
            )
          )}
          <div className={classes.textField}>
            <FormControlLabel
              style={{ marginBottom: '-25px' }}
              control={
                <Checkbox
                  checked={priority}
                  onChange={() => setPriority(!priority)}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Caz prioritar"
            />
          </div>
          <div className={classes.textField} style={{ position: 'relative' }}>
            <TextField
              margin="normal"
              fullWidth
              id='investigation'
              label='Investigatie'
              name='investigatie'
              type='text'
              autoComplete='investigatie'
              value={newInvestigation}
              autoFocus
              onChange={onChangeInvestigation}
              error={investigationError}
              helperText={investigationError}
            />
            <IconButton
              style={{ position: 'absolute', right: 0, marginTop: '20px' }}
              aria-label="add investigation"
              onClick={onAddInvestigation}
            >
              <AddCircleIcon />
            </IconButton>
          </div>
          <div className={classes.textField} />
          <List className={classes.list}>
            {investigations.map((value, index) => (
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
