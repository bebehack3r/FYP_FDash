import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if(!token) {
    console.error("No token found!");
    navigate("/login");
    return;
  }
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  const { role } = JSON.parse(jsonPayload);

  const dashboard = () => {
    navigate("/dashboard");
  };

  const addAPI = () => {
    navigate("/api");
  };

  const uploadFile = () => {
    navigate("/upload");
  };

  const createAcc = () => {
    navigate("/register");
  };

  const manageUsers = () => {
    navigate("/manageUsers");
  };

  const profile = () => {
    navigate("/profile");
  };

  const logOut = () => {
    localStorage.removeItem('token');
    navigate("/login");
  };

  return(
    <Wrap>
      <NavItem onClick={dashboard}>Dashboard</NavItem>
      <NavItem onClick={addAPI}>Add API</NavItem>
      <NavItem onClick={uploadFile}>Upload Log</NavItem>
      <NavItem onClick={profile}>Profile</NavItem>
      { role === "admin" && <NavItem onClick={createAcc}>Create New Account</NavItem> }
      { role === "admin" && <NavItem onClick={manageUsers}>Manage Users</NavItem> }
      <NavItem onClick={logOut}>Log Out</NavItem>
    </Wrap>
  );
};

export default Menu;