import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import right from "./right.png";
import logo from "./logo.png";

const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
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
`;

const ActionBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 4;
  color: white;
`;

const ActionBlockDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background: #161414;
  width: 40vw;
  height: 80vh;
  color: white;
`;

const ActionBlockDivInner = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  font-size: 14pt;
  text-align: center;
`;

const LabelField = styled.label`
  text-align: left;
`;

const InputField = styled.input`
  font-size: 14pt;
  margin-bottom: 18px;
  margin-top: 8px;
  padding: 5px 10px;
`;

const SubmitButton = styled.input`
  background: #8454F6;
  border: none;
  border-radius: 5px;
  padding-top: 15px;
  padding-bottom: 15px;
  width: 50%;
  margin-left: 25%;
  font-size: 16pt;
  color: black;
  margin-bottom: 15px;

  &:hover {
    cursor: pointer;
    background: #6943C4;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: start;
  justify-content: center;
`;

const HeaderLogo = styled.img`
  height: 80px;
  margin-right: 50px;
`;

const Register = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [pass, setPass] = useState("");
  const [rePass, setRePass] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [error, setError] = useState(null);

  const handleName = (e) => {
    setName(e.target.value);
  };
  
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePass = (e) => {
    setPass(e.target.value);
  };

  const handleRePass = (e) => {
    setRePass(e.target.value);
  };

  const handleRole = (e) => {
    setRole(e.target.value);
  };

  const register = async () => {
    if(pass !== rePass) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/register', { email, name, pass, role }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.data.message === 'OK') navigate("/successUser");
      else {
        if(response.data.message === 'ERROR') setError(response.data.data);
        else setError('Backend server malfunction. Please, contact your supplier');
      }
    } catch (error) {
      console.error('Error fetching request:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  };

  const goBack = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    if (!token) {
      console.error('Token not found');
      setToken(localStorage.getItem('token'));
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(
    <Wrap>
      <ActionBlock>
        <ActionBlockDiv>
          <Header>
            <HeaderLogo src={logo} />
            <h1>Create Account</h1>
          </Header>
          <h3>{error ? error : 'Sysadmin page to create new accounts'}</h3>
          <ActionBlockDivInner>
            <LabelField htmlFor='name'>Name</LabelField>
            <InputField type='text' id='name' name='name' placeholder='Enter name' onChange={handleName} />
            <LabelField htmlFor='email'>E-mail</LabelField>
            <InputField type='text' id='email' name='email' placeholder='Enter e-mail' onChange={handleEmail} />
            <LabelField htmlFor='role'>Role</LabelField>
            <InputField type='text' id='role' name='role' placeholder='Enter role' onChange={handleRole} />
            <LabelField htmlFor='password'>Password</LabelField>
            <InputField type='password' id='password' name='password' placeholder='Enter password' onChange={handlePass} />
            <LabelField htmlFor='repassword'>Confirm password</LabelField>
            <InputField type='password' id='repassword' name='repassword' placeholder='Confirm password' onChange={handleRePass} />
            <SubmitButton type='submit' id='submit' name='submit' onClick={register} value="Create New Account" />
            <SubmitButton type='submit' id='submit' name='submit' onClick={goBack} value="Go Back" />
          </ActionBlockDivInner>
        </ActionBlockDiv>
      </ActionBlock>
      <LogoBlock>
        <LogoImage src={right} />
      </LogoBlock>
    </Wrap>
  );
};

export default Register;