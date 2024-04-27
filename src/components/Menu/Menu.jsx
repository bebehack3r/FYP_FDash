import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from './logo.png';

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
  background: #1A1818;
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

const HeaderLogo = styled.img`
  height: 60px; // Maintains logo height
  position: relative;
  margin-right: auto;
  margin-left: 5px;
  &:hover {
    cursor: pointer;
    color: rgba(255,255,255,0.8);
`;

const Button = styled.button`
background-color: #6943C4;
border: none;
color: black;
font-size: 10pt;
padding: 10px 16px;
margin: 2px 2px;
cursor: pointer;
border-radius: 12px;
&:hover {
  cursor: pointer;
  color: rgba(255,255,255,0.8);
}

  `;

const Menu = () => {
  const megaRoles = ['admin', 'superAdmin', 'gigaAdmin'];

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
      <HeaderLogo  onClick={dashboard} src={logo} />
      { token && <NavItem onClick={dashboard}>Dashboard</NavItem> }
      { token && <NavItem onClick={addAPI}>Add API</NavItem> }
      { token && <NavItem onClick={uploadFile}>Upload Log</NavItem> }
      { token && <NavItem onClick={profile}>Profile</NavItem> }
      { megaRoles.includes(role) && <NavItem onClick={createAcc}>Create New Account</NavItem> }
      { megaRoles.includes(role) && <NavItem onClick={manageUsers}>Manage Users</NavItem> }
      { token ? <NavItem onClick={logOut}><Button>Log Out</Button></NavItem> : <NavItem onClick={logIn}>Log In</NavItem> }
      { !token && <NavItem onClick={signUp}><Button>Sign Up</Button></NavItem> }
    </Wrap>
  );
};

export default Menu;
