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
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(() => ({
  container: {
    padding: '10px 0',
    display: 'flex',
    flexDirection: 'column'
  },
  form: {
    display: 'flex',
    // alignItems: 'flex-end',
    flexWrap: 'wrap'
  },
  textField: {
    display: 'flex',
    flex: '1 46%',
    justifyContent: 'space-between',
    '&:not(:nth-child(4n)):not(:nth-child(2n))': {
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
  }
}));

const SickLeave = ({ fields, onCreate }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState(fields);
  const [selectData, setSelectData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userError, setUserError] = useState(null);

  useEffect(() => fetchUsers(), []);
  const fetchUsers = async () => {
    const users = await getAll({});
    const { data: { rows } } = users;

    setSelectData(rows);
  }

  const schema = {
    diagnostic: Joi.string().required().label(data.diagnostic.label),
    startDate: Joi.date().raw().required().label(data.startDate.label),
    endDate: Joi.date().min(Joi.ref('startDate')).raw().required().label(data.endDate.label)
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const certificate = {
      diagnostic: data.diagnostic.value,
      startDate: data.startDate.value || data.startDate.defaultValue,
      endDate: data.endDate.value || data.startDate.defaultValue
    };
    let formIsValid = true;
    const result = Joi.validate(certificate, schema, { abortEarly: false });

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
        certificate.userId = selectedUser.id;
        await create(certificate);

        onCreate();
        setData(fields);
        setSelectedUser(null);
        showSuccess('Concediul medical a fost trimis cu succes catre pacient');
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

export default SickLeave;
