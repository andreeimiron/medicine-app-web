import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Link from "@material-ui/core/Link";
import HomeIcon from '@material-ui/icons/Home';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import PeopleIcon from '@material-ui/icons/People';
import InfoIcon from '@material-ui/icons/Info';
import HistoryIcon from '@material-ui/icons/History';
import DescriptionIcon from '@material-ui/icons/Description';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SendIcon from '@material-ui/icons/Send';
import HotelIcon from '@material-ui/icons/Hotel';
import ListIcon from '@material-ui/icons/List';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useHistory } from "react-router-dom";
import Logo from "../assets/images/white-logo.png";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
    height: '100%'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: '64px',
    paddingBottom: '100px',
    minHeight: 'calc(100vh - 128px)',
    height: '100%'
  },
  contact: {
    display: 'flex',
    alignItems: 'center',

  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  active: {
    color: '#3f51b5',
  },
  activeTitle: {
    fontWeight: 'bold',
  },
  appLogo: {
    width: '200px',
    height: 'auto',
  }
}));

const Navigation = ({ children }) => {
  let history = useHistory();
  const classes = useStyles();
  const loggedUser = JSON.parse(localStorage.getItem('user')) || {};
  const isDoctor = loggedUser.role === 'medic';
  const pathname = window.location.pathname;

  const pages = [
    {
      title: 'Home',
      url: '/',
      icon: <HomeIcon />
    },
    {
      title: isDoctor ? 'Solicitari' : 'Cereri',
      url: '/requests',
      icon: <AnnouncementIcon />
    },
    {
      title: isDoctor ? 'Pacienti' : 'Consultatii',
      url: isDoctor ? '/patients' : '/consultations',
      icon: isDoctor ? <PeopleIcon /> : <ListIcon />
    },
    {
      title: 'Informatii generale',
      url: '/profile',
      icon: <InfoIcon />
    },
    {
      title: 'Istoric patologic',
      url: '/history',
      icon: <HistoryIcon />
    },
    {
      title: 'Vaccinuri',
      url: '/vaccines',
      icon: <PlaylistAddCheckIcon />
    },
    {
      title: 'Adeverinte medicale',
      url: '/certificates',
      icon: <AssignmentIcon />
    },
    {
      title: 'Bilete de trimitere',
      url: '/referrals',
      icon: <SendIcon />
    },
    {
      title: 'Retete medicale',
      url: '/prescriptions',
      icon: <DescriptionIcon />
    },
    {
      title: 'Concediu medical',
      url: '/sickLeaves',
      icon: <HotelIcon />
    },
    {
      title: 'Deconectare',
      url: '/logout',
      icon: <ExitToAppIcon />
    }
  ];

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <img className={classes.appLogo} src={Logo} alt="MyMedData" />
          <Typography variant="h6" noWrap className={classes.contact}>
            <PhoneIphoneIcon style={{ marginRight: '5px' }} />
            Programari:
            <Link
              component="button"
              variant="body2"
              color="inherit"
              href="tel:+40264044192"
            >
              <Typography variant="h6" noWrap style={{ marginLeft: '5px' }}>
                0264 044 192
              </Typography>
            </Link>
          </Typography>
          {loggedUser && (
            <Typography variant="h6" noWrap className={classes.contact}>
              <AccountCircleIcon style={{ marginRight: '5px'}} />
              {`${loggedUser.firstName} ${loggedUser.lastName}`}
            </Typography>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {pages.map((page, index) => (
              <React.Fragment>
                <ListItem
                  selected={pathname === page.url}
                  className={pathname === page.url && classes.active}
                  button
                  key={page.title}
                  onClick={() => history.push(page.url)}
                  style={index === pages.length - 1 ? { marginTop: 'auto' } : null}
                >
                  <ListItemIcon className={pathname === page.url && classes.active}>{page.icon}</ListItemIcon>
                  <ListItemText
                    className={pathname === page.url && {
                      primary: classes.activeTitle,
                    }}
                    primary={page.title}
                  />
                </ListItem>
                {(index === 2 || index === 5) && <Divider /> }
              </React.Fragment>
            ))}

          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        {children}
      </main>

    </div>
  );
}

export default Navigation;
