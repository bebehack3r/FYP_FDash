import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

import logo from './logo.png';

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
  height: 50vh;
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

  &:hover {
    cursor: pointer;
    background: #6943C4;
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState(null);

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePass = (e) => {
    setPass(e.target.value);
  };

  const login = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/login', { email, pass });
      if(response.data.message === 'OK') {
        localStorage.setItem('token', response.data.data);
        navigate('/dashboard');
      } else {
        if(response.data.message === 'ERROR') setError(response.data.data);
        else setError('Backend server malfunction. Please, contact your supplier');
      }
    } catch (err) {
      if(err.response?.data?.message === 'NULL') setError('Incorrect e-mail and/or password, please, try again');
      else setError('Frontend server malfunction. Please, contact your supplier');
    }
  };

  useEffect(() => {
    if (token) {
      console.error('Token found');
      navigate('/dashboard');
    } else setToken(localStorage.getItem('token'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(
    <Wrap>
      <ActionBlock>
        <h1>Welcome to Dash!</h1>
        <h1>Web-based IDS System</h1>
        <ActionBlockDiv>
          {error && <h3 style={{ width: '80%', textAlign: 'center' }}>{ error }</h3>}
          <ActionBlockDivInner>
            <LabelField htmlFor='login'>E-mail</LabelField>
            <InputField type='text' id='login' name='login' onChange={handleEmail} placeholder='Enter your e-mail' />
            <LabelField htmlFor='password'>Password</LabelField>
            <InputField type='password' id='password' name='password' onChange={handlePass} placeholder='Enter your password' />
            <SubmitButton type='submit' id='submit' name='submit' onClick={login} value='Log In' />
          </ActionBlockDivInner>
        </ActionBlockDiv>
      </ActionBlock>
      <LogoBlock>
        <LogoImage src={logo} />
      </LogoBlock>
    </Wrap>
  );
};

export default Login;