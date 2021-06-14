import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import CreateIcon from '@material-ui/icons/Create';
import Joi from "joi-browser";
import {create, update} from '../api';
import CircularProgress from '@material-ui/core/CircularProgress';
import { showError, showSuccess } from '../../../utils/notification';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
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

const Request = ({ fields, onCreate, selectedRequest }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState(fields);
  const loggedUser = JSON.parse(localStorage.getItem('user')) || {};
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    setSolved(fields.solved.value)
  }, [fields.solved.value]);

  const schema = {
    type: Joi.string().required().label(data.type.label),
    reason: Joi.string().required().label(data.type.label),
    date: Joi.date().raw().required().label(data.reason.label)
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const request = {
      type: data.type.value,
      reason: data.reason.value,
      date: data.date.value
    };
    let formIsValid = true;
    const result = Joi.validate(request, schema, { abortEarly: false });

    const dataClone = { ...data };
    Object.keys(dataClone).forEach((key) => {
      dataClone[key].error = '';
    });

    if (result.error) {
      formIsValid = false;
      result.error.details.forEach((err) => {
        dataClone[err.path[0]].error = err.message.replaceAll('"', '');
      });
    }

    setData(dataClone);

    if (formIsValid) {
      setLoading(true);
      setDisabled(true);

      try {
        request.solved = solved;
        if (loggedUser.role === 'medic') {
          request.id = selectedRequest.id;
          await update(request);

          showSuccess('Cererea a fost modificata cu succes');
        } else {
          request.userId = loggedUser.id;
          await create(request);

          showSuccess('Cererea a fost efectuata cu succes');
        }

        onCreate();
        setData(fields);
      } catch (error) {
        showError(error);
      }

      setLoading(false);
      setDisabled(false);
    }
  };

  const onAddToList = (key, value) => {
    if (value) {
      setData((prevState) => ({
        ...prevState,
        [key]: {
          ...prevState[key],
          value: '',
          listData: [value, ...prevState[key].listData]
        },
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        [key]: {
          ...prevState[key],
          error: 'This field is not allowed to be empty'
        },
      }));
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

  const onSelectChange = (key, value) => {
    setData((prevState) => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        value,
        error: ''
      },
    }));
  }

  return (
    <Paper style={{ padding: '0 15px', marginTop: '10px' }}>
      <div className={classes.container}>
        <form noValidate className={classes.form}>
          {Object.entries(data).map(([key, field]) => {
              if (field.selectData) {
                return (
                  <TextField
                    className={classes.textField}
                    margin="normal"
                    select
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
                    disabled={field.disabled}
                  >
                    {field.selectData.map((value) => (
                      <MenuItem
                        key={value}
                        value={value}
                        onClick={() => onSelectChange(key, value)}
                      >
                        {value}
                      </MenuItem>
                    ))}
                  </TextField>
                );
              } else if (field.listData) {
                return (
                  <React.Fragment>
                    <div className={classes.textField} style={{ position: 'relative', flexDirection: 'column' }}>
                      <TextField
                        margin="normal"
                        fullWidth
                        id={field.name}
                        label={field.label}
                        name={field.name}
                        type={field.type}
                        autoComplete={field.name}
                        value={field.value}
                        autoFocus
                        onChange={onChange}
                        error={field.error}
                        helperText={field.error}
                        disabled={field.disabled}
                      />
                      <IconButton
                        style={{ position: 'absolute', right: 0, marginTop: '20px' }}
                        aria-label={`add-${field.name}`}
                        onClick={() => onAddToList(key, field.value)}
                        disabled={field.disabled}
                      >
                        <AddCircleIcon />
                      </IconButton>
                      <List className={classes.list}>
                        {field.listData.map((value, index) => (
                          <ListItem key={`item-${index}`}>
                            <ListItemIcon>
                              <CheckBoxIcon />
                            </ListItemIcon>
                            <ListItemText primary={value}/>
                          </ListItem>
                        ))}
                      </List>
                    </div>

                  </React.Fragment>
                )
              } else if (field.checkbox) {
                  return (
                    <div className={classes.textField}>
                      <FormControlLabel
                        style={{ marginBottom: '-25px' }}
                        control={
                          <Checkbox
                            checked={solved}
                            onChange={() => setSolved(!solved)}
                            disabled={field.disabled}
                            name='solved'
                            color="primary"
                          />
                        }
                        label='Rezolvat'
                      />
                    </div>
                  )
              } else {
                return (
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
                    disabled={field.disabled}
                  />
                );
              }
          })}
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
            {loggedUser.role === 'medic' ? 'Modifica cererea' : `Solicita ${data.type.value}`}
          </Button>
        </form>
      </div>
    </Paper>
  )
};

export default Request;
