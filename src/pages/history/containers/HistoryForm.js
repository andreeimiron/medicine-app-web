import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import CreateIcon from '@material-ui/icons/Create';
import Joi from "joi-browser";
import { create } from '../api';
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

const HistoryForm = ({ fields, onCreate, patient, onUserError,  }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState(fields);

  const schema = {
    diagnostic: Joi.string().required().label(data.diagnostic.label),
    date: Joi.date().raw().required().label(data.date.label),
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const certificate = {
      diagnostic: data.diagnostic.value,
      date: data.date.value || data.date.defaultValue
    };
    let formIsValid = true;
    const result = Joi.validate(certificate, schema, { abortEarly: false });

    const dataClone = { ...data };
    Object.keys(dataClone).forEach((key) => {
      dataClone[key].error = '';
    });
    onUserError(null);

    if (result.error) {
      formIsValid = false;
      result.error.details.forEach((err) => {
        dataClone[err.path[0]].error = err.message.replaceAll('"', '');
      });
    }

    setData(dataClone);

    if (!patient) {
      formIsValid = false;
      onUserError('Pacientul is not allowed to be empty');
    }

    if (formIsValid) {
      setLoading(true);
      setDisabled(true);

      try {
        certificate.userId = patient.id;
        await create(certificate);

        onCreate();
        setData(fields);
        showSuccess('Patologia a fost salvata cu succes');
      } catch (error) {
        showError(error);
      }

      setLoading(false);
      setDisabled(false);
    }
  };


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
            Salveaza patologie
          </Button>
        </form>
      </div>
    </Paper>
  )
};

export default HistoryForm;
