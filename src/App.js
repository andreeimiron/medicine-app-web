import React, {useEffect, useState} from 'react';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import { withRouter, Switch } from 'react-router';
import { NotificationContainer } from 'react-notifications';
import styled from 'styled-components';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/home/containers/Home';
import Certificates from './pages/certificates/containers/Certificates';
import Login from './pages/auth/containers/Login';
import Logout from './pages/auth/containers/Logout';
import Vaccines from "./pages/vaccines/containers/Vaccines";
import Referrals from "./pages/referrals/containers/Referrals";
import Prescriptions from "./pages/prescriptions/containers/Prescriptions";
import SickLeaves from "./pages/sickLeaves/containers/SickLeaves";
import History from "./pages/history/containers/History";
import Patients from "./pages/patients/containers/Patients";
import Requests from "./pages/request/containers/Requests";
import Consultations from "./pages/consultations/containers/Consultations";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
  height: 100vh;
`;

const AuthenticationWrapper = withRouter(({ children }) => {
  if (!localStorage.getItem('user')) {
    document.location.href = '/login';
  }

  return children;
});

const convertedComponent = (Component) => (
  <AuthenticationWrapper>
    <Navigation>
      <Component />
    </Navigation>
    <Footer />
  </AuthenticationWrapper>
);


const App = () => {
  const [isDoctor, setIsDoctor] = useState(false);
  const loggedUser = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    setIsDoctor(loggedUser && loggedUser.role === 'medic');
  }, [loggedUser, isDoctor]);

  const HomeComponent = () => isDoctor ? (
    <React.Fragment>
      <Consultations/>
      <Home/>
    </React.Fragment>
  ) : <Home/>;

  return (
    <AppContainer>
      <BrowserRouter>
          <Switch>
            <Route exact path="/" component={() => convertedComponent(HomeComponent)} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/certificates" component={() => convertedComponent(Certificates)} />
            <Route exact path="/vaccines" component={() => convertedComponent(Vaccines)} />
            <Route exact path="/referrals" component={() => convertedComponent(Referrals)} />
            <Route exact path="/prescriptions" component={() => convertedComponent(Prescriptions)} />
            <Route exact path="/sickLeaves" component={() => convertedComponent(SickLeaves)} />
            <Route exact path="/history" component={() => convertedComponent(History)} />
            <Route exact path="/patients" component={() => convertedComponent(Patients)} />
            <Route exact path="/profile" component={() => convertedComponent(Patients)} />
            <Route exact path="/requests" component={() => convertedComponent(Requests)} />
            <Route exact path="/logout" component={() => convertedComponent(Logout)} />
            <Route exact path="/consultations" component={() => convertedComponent(Consultations)} />
            <Redirect to="/" />
          </Switch>
      </BrowserRouter>
      <NotificationContainer />
    </AppContainer>
  );
}

export default App;
