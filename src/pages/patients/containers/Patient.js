import React, { useState } from 'react';
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
import Paper from "@material-ui/core/Paper";
import GetAppIcon from "@material-ui/icons/GetApp";

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
    flex: '1 30%',
    justifyContent: 'space-between',
    '&:not(:nth-child(3n))': {
      marginRight: '15px'
    }
  },
  submitButton: {
    display: 'flex',
    flex: '1 30%',
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
    flex: '1 30%',
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
  download: {
    cursor: 'pointer',
    transition: 'all .2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.2)',
    }
  }
}));

const Patient = ({ fields, onCreate, showMode, addMode, editMode, selectedUser, onDownload, download }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState(fields);
  const loggedUser = JSON.parse(localStorage.getItem('user')) || {};

  const schema = {
    lastName: Joi.string().required().label(data.lastName.label),
    firstName: Joi.string().required().label(data.firstName.label),
    email: Joi.string().required().email({ minDomainAtoms: 2 }).label(data.email.label),
    password: Joi.string().required().min(8).label(data.password.label),
    role: Joi.string().required().label(data.role.label),
    cnp: Joi.string().required().min(13).label(data.cnp.label),
    serialNumber: Joi.string().required().min(8).label(data.serialNumber.label),
    nationality: Joi.string().required().label(data.nationality.label),
    birthDate: Joi.date().raw().required().label(data.birthDate.label),
    birthPlace: Joi.string().required().label(data.birthPlace.label),
    address: Joi.string().required().label(data.address.label),
    gender: Joi.string().required().label(data.gender.label),
    motherName: Joi.string().required().label(data.motherName.label),
    fatherName: Joi.string().allow(null, '').label(data.fatherName.label),
    jobTitle: Joi.string().allow(null, '').label(data.jobTitle.label),
    companyName: Joi.string().allow(null, '').label(data.companyName.label),
    phoneNumber: Joi.string().allow(null, '').min(10).label(data.phoneNumber.label),
    emergencyContactName: Joi.string().allow(null, '').label(data.emergencyContactName.label),
    emergencyContactPhoneNumber: Joi.string().allow(null, '').min(10).label(data.emergencyContactPhoneNumber.label),
    medicalCode: Joi.string().allow(null, '').label(data.medicalCode.label),
    insuredCode: Joi.string().allow(null, '').label(data.insuredCode.label),
    currentMedication: Joi.array().allow(null, '').label(data.currentMedication.label),
    bloodType: Joi.string().required().label(data.bloodType.label),
    allergies: Joi.array().allow(null, '').label(data.fatherName.label),
    insuredType: Joi.string().required().label(data.insuredType.label),
    birthType: Joi.string().required().label(data.birthType.label),
    weight: Joi.number().allow(null, '').label(data.weight.label),
    height: Joi.number().label(data.height.label),
    lastPeriod: Joi.date().raw().label(data.lastPeriod.label)
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const user = {
      lastName: data.lastName.value,
      firstName: data.firstName.value,
      email: data.email.value,
      password: data.password.value,
      role: data.role.value,
      cnp: data.cnp.value,
      serialNumber: data.serialNumber.value,
      nationality: data.nationality.value,
      birthDate: data.birthDate.value,
      birthPlace: data.birthPlace.value,
      address: data.address.value,
      gender: data.gender.value,
      motherName: data.motherName.value,
      fatherName: data.fatherName.value,
      jobTitle: data.jobTitle.value,
      companyName: data.companyName.value,
      phoneNumber: data.phoneNumber.value,
      emergencyContactName: data.emergencyContactName.value,
      emergencyContactPhoneNumber: data.emergencyContactPhoneNumber.value,
      medicalCode: data.medicalCode.value,
      insuredCode: data.insuredCode.value,
      currentMedication: data.currentMedication.listData,
      bloodType: data.bloodType.value,
      allergies: data.allergies.listData,
      insuredType: data.insuredType.value,
      birthType: data.birthType.value,
      weight: data.weight.value,
      height: data.height.value,
      lastPeriod: data.lastPeriod.value
    };
    let formIsValid = true;
    const result = Joi.validate(user, schema, { abortEarly: false });

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
        if (showMode || editMode) {
          user.id = showMode ? selectedUser.id : loggedUser.id
          delete user.password;

          const updatedUser = await update(user);

          if (editMode) {
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
          showSuccess('Datele au fost actualizate cu succes');
        }

        if (addMode) {
          user.doctorId = loggedUser.id;
          await create(user);

          showSuccess('Pacientul a fost adaugat cu succes');
          setData(fields);
        }

        onCreate();
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
            if ((showMode && key !== 'role' && key !== 'password' && key !== 'medicalCode') ||
              (addMode && key !== 'password' && key !== 'medicalCode') ||
              (editMode && loggedUser.role === 'pacient' && key !== 'medicalCode' && key !== 'password') ||
              (editMode && loggedUser.role === 'medic' && key !== 'password')) {
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
              } else {
                if (key !== 'lastPeriod' || key === 'lastPeriod' && data.gender.value === 'feminin') {
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
              }
            }
          })}
          {addMode && data.gender.value === 'masculin' && <div className={classes.textField} />}
          {showMode && data.gender.value === 'masculin' && <div className={classes.textField} />}
          {showMode && <div className={classes.textField} />}
          {editMode && data.role.value === 'medic' && <div className={classes.textField} />}
          {editMode && data.role.value === 'medic' && <div className={classes.textField} />}
          {editMode && data.gender.value === 'masculin' && <div className={classes.textField} />}
          <Typography
            variant="body1"
            align="left"
            style={{ marginTop: '20px' }}
            className={classes.textField}
          >
            * Acest camp este obligatoriu
          </Typography>
          {download ? (
            <Typography variant="body2" className={classes.textField}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <GetAppIcon
                  className={classes.download}
                  onClick={() => onDownload()}
                />
                Descarca informatiile
              </div>
            </Typography>
          ) : <div className={classes.textField} />}
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
            {addMode ? 'Adauga pacient' : 'Salveaza datele'}
          </Button>
        </form>
      </div>
    </Paper>
  )
};

export default Patient;
