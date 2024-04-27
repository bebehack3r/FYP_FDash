import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Wrap = styled.div`
  width: 100vw;
  height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
  position: absolute;
  top: 0;
  left: 0;
`;

const NavItem = styled.div`
  padding: 15px 30px;
  color: white;
  font-size: 13pt;

  &:hover {
    cursor: pointer;
    color: rgba(255,255,255,0.8);
  }
`;

const Menu = () => {
  const megaRoles = ['admin', 'superAdmin', 'gigaAdmin'];
  const ownerWide = ['gigaAdmin'];

  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  // if(!token) {
  //   console.error('No token found!');
  //   // navigate('/');
  //   return;
  // }
  let role = null;
  if(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    role = JSON.parse(jsonPayload)['role'];
  };

  const dashboard = () => {
    navigate('/dashboard');
  };

  const addAPI = () => {
    navigate('/api');
  };

  const uploadFile = () => {
    navigate('/upload');
  };

  const monitoring = () => {
    navigate('/monitoring');
  }

  const createAcc = () => {
    navigate('/register');
  };

  const manageUsers = () => {
    navigate('/manageUsers');
  };

  const profile = () => {
    navigate('/profile');
  };

  const logOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const logIn = () => {
    navigate('/login');
  };

  const signUp = () => {
    return;
  };

  return(
    <Wrap>
      { token && <NavItem onClick={dashboard}>Dashboard</NavItem> }
      { token && <NavItem onClick={addAPI}>Add API</NavItem> }
      { token && <NavItem onClick={uploadFile}>Upload Log</NavItem> }
      { token && <NavItem onClick={profile}>Profile</NavItem> }
      { ownerWide.includes(role) && <NavItem onClick={monitoring}>Access Logs</NavItem> }
      { megaRoles.includes(role) && <NavItem onClick={createAcc}>Create New Account</NavItem> }
      { megaRoles.includes(role) && <NavItem onClick={manageUsers}>Manage Users</NavItem> }
      { token ? <NavItem onClick={logOut}>Log Out</NavItem> : <NavItem onClick={logIn}>Log In</NavItem> }
      { !token && <NavItem onClick={signUp}>Sign Up</NavItem> }
    </Wrap>
  );
};

export default Menu;