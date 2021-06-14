import { useEffect } from 'react';
import { useHistory } from "react-router";

const Logout = () => {
  let history = useHistory();

  useEffect(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    history.push('/login');
  });

  return null;
}

export default Logout;
