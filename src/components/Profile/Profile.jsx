import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

import Menu from '../Menu/Menu.jsx';

import logo from './logo.png';
import avatar from './avatar.png';
import { Wrap, Block, Row, Column } from '../Styles/styles.js';


const ActionBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: white;
`;

const ActionBlockDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  box-shadow: 1px 1px 15px rgba(0,0,0,0.5);
  background: #161414;
  width: 60vw;
  height: 80vh;
  margin-top: 10vh;
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

const AvatarImageBlock = styled.div`
  width: 180px;
  height: 180px;
  background: white;
  border-radius: 90px;
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const AvatarImage = styled.img`
  width: 150px;
`;

const Profile = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [role, setRole] = useState('');
  const [userID, setUserID] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
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

  const edit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/update_user_profile', {
        id: userID,
        email,
        name,
        pass
      }, { 
        headers: {
          Authorization: `Bearer ${token}`
        } 
      });
      if(response.data.message === 'OK') navigate('/profile');
      else {
        if(response.data.message === 'ERROR') setError(response.data.data);
        else setError('Backend server malfunction. Please, contact your supplier');
      }
    } catch (err) {
      setError(err);
      console.error('Error fetching logs:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  };

  const goBack = () => {
    navigate('/dashboard');
  }

  useEffect(() => {
    if (!token) {
      console.error('Token not found');
      setToken(localStorage.getItem('token'));
      navigate('/login');
    }

    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const { id } = JSON.parse(jsonPayload);
    setUserID(id);

    const loadProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/get_user_profile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if(response.data.message === 'OK') {
          setName(response.data.data.name);
          setEmail(response.data.data.email);
          setPass(response.data.data.pass);
          setRole(response.data.data.role);
        } else {
          if(response.data.message === 'ERROR') setError(response.data.data);
          else setError('Backend server malfunction. Please, contact your supplier');
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
        setError('Frontend server malfunction. Please, contact your supplier');
      }
    }
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(
    <Wrap>
      <Menu />
      <ActionBlock>
        <ActionBlockDiv>
          <Header>
            <HeaderLogo src={logo} />
            <h1>User Profile</h1>
          </Header>
          <AvatarImageBlock>
            <AvatarImage src={avatar} />
          </AvatarImageBlock>
          <ActionBlockDivInner>
            <LabelField htmlFor='name'>Name</LabelField>
            <InputField type='text' id='name' name='name' placeholder='Enter your name' value={name} onChange={handleName} />
            <LabelField htmlFor='email'>E-mail</LabelField>
            <InputField type='text' id='email' name='email' placeholder='Enter your e-mail' value={email} onChange={handleEmail} />
            <LabelField htmlFor='password'>Password</LabelField>
            <InputField type='password' id='password' name='password' placeholder='Enter your password' value={pass} onChange={handlePass} />
            <LabelField htmlFor='role'>Role</LabelField>
            <InputField type='role' id='role' name='role' placeholder='Your role' disabled={true} value={role} />
            <SubmitButton type='submit' id='submit' name='submit' onClick={edit} value='Update Info' />
            <SubmitButton type='submit' id='goBack' name='goBack' onClick={goBack} value='Back' />
          </ActionBlockDivInner>
        </ActionBlockDiv>
      </ActionBlock>
    </Wrap>
  );
};

export default Profile;