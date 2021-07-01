import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Joi from 'joi-browser';
import LoginImage from '../../../assets/images/login.jpg';
import Typography from "@material-ui/core/Typography";
import { login } from '../api';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from "react-router-dom";
import Logo from '../../../assets/images/logo.png';
import { showError } from "../../../utils/notification";

const useStyles = makeStyles(() => ({
  wrapper: {
    background: `url(${LoginImage})`,
    backgroundSize: 'cover',
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  loginForm: {
    display: 'flex',
    minWidth: '400px',
    width: '30vw',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: '180px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 6px 12px 0 rgb(0 0 0 / 15%)',
  },
  submitButton: {
    margin: '15px 0'
  },
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0 10px'
  },
  appLogo: {
    marginBottom: '100px',
    width: '400px',
    height: 'auto'
  }
}));

const Login = () => {
  let history = useHistory()
  const classes = useStyles();
  const defaultData = {
    email: {
      type: 'text',
      label: 'Email',
      name: 'email',
      value: '',
      error: '',
    },
    password: {
      type: 'password',
      label: 'Parola',
      name: 'password',
      value: '',
      error: '',
    },
  };
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [loginData, setLoginData] = useState(defaultData);
  const loggedUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (loggedUser) {
      history.push('/');
    }
  }, loggedUser)

  const schema = {
    email: Joi.string().required().email({ minDomainAtoms: 2 }).label(loginData.email.label),
    password: Joi.string().required().min(8).label(loginData.password.label),
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const user = {
      email: loginData.email.value,
      password: loginData.password.value,
    };
    let formIsValid = true;
    const result = Joi.validate(user, schema, { abortEarly: false });

    const loginDataClone = { ...loginData };
    Object.keys(loginDataClone).forEach((key) => {
      loginDataClone[key].error = '';
    });

    if (result.error) {
      formIsValid = false;
      result.error.details.forEach((err) => {
        loginDataClone[err.path[0]].error = err.message.replaceAll('"', '');
      });
    }

    setLoginData(loginDataClone);

    if (formIsValid) {
      setLoading(true);
      setDisabled(true);

      try {
        const loggedUser = await login(user);

        localStorage.setItem('user', JSON.stringify(loggedUser));
        localStorage.setItem('token', loggedUser.token);

        setLoginData(defaultData);
        history.push('/');
      } catch (error) {
        showError(error)
      }

      setLoading(false);
      setDisabled(false);
    }
  };

  const onChange = (event) => {
    const { value, name } = event.target;

    setLoginData((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value,
        error: ''
      },
    }));
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.loginForm}>
        <img className={classes.appLogo} src={Logo} alt="MyMedData" />
        <form noValidate>
          {Object.values(loginData).map((field) => (
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id={field.name}
                label={field.label}
                name={field.name}
                type={field.type}
                autoComplete="email"
                autoFocus
                onChange={onChange}
                error={field.error}
                helperText={field.error}
              />
            )
          )}
          <Button
            type="submit"
            size="large"
            disabled={disabled}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submitButton}
            startIcon={loading && <CircularProgress size="20px" />}
            onClick={onSubmit}
          >
            Conectare
          </Button>
          <Typography variant="body1" align="left">
            * Acest camp este obligatoriu
          </Typography>
        </form>
      </div>
    </div>
  );
};

export default Login;
