import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: '#3f51b5', //'#80D0F4',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    height: '64px',
    paddingLeft: '239px'
  },
}));

const Footer = () => {
  const classes = useStyles();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg" className={classes.footer}>
        <Typography variant="subtitle1" align="center" color="inherit" component="p">
          {`Medical App - Un mod mai simplu de comunicare cu medicul de familie. Copyright © Andrei Miron ${currentYear}.`}
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;
