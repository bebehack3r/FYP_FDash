import React from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import styled from "styled-components";

import logo from "./logo.png";

const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const LogoBlock = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex: 5;
`;

const LogoImage = styled.img`
  height: 80%;
  border-radius: 20px;
  margin-top: 40px;
`;

const ActionBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 4;
  color: white;
`;

const SubmitButton = styled.input`
  background: #8454F6;
  border: none;
  border-radius: 5px;
  padding-top: 15px;
  padding-bottom: 15px;
  width: 40%;
  font-size: 16pt;
  color: black;

  &:hover {
    cursor: pointer;
    background: #6943C4;
  }
`;

const SuccessUser = () => {

  const navigate = useNavigate();

  const goBack = () => {
    navigate("/dashboard");
  };

  return(
    <Wrap>
      <LogoBlock>
        <LogoImage src={logo} />
      </LogoBlock>
      <ActionBlock>
        <h1>Welcome to Dash!</h1>
        <h3>New User Account has been created. Please, share login and password to log in.</h3>
        <SubmitButton type='submit' id='submit' name='submit' onClick={goBack} value="Go Back" />
      </ActionBlock>
    </Wrap>
  );
};

export default SuccessUser;