import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import Menu from "../Menu/Menu.jsx";

import logo from "./logo.png";

const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

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
  justify-content: start;
  border-radius: 5px;
  box-shadow: 1px 1px 15px rgba(0,0,0,0.5);
  background: #161414;
  width: 60vw;
  min-height: 30vh;
  margin-top: 10vh;
  color: white;
`;

const ActionBlockDivInner = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
  font-size: 14pt;
  text-align: center;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: start;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 60px;
`;

const HeaderLogo = styled.img`
  height: 80px;
  margin-right: 50px;
`;

const InputField = styled.input`
  font-size: 14pt;
  margin-bottom: 18px;
  margin-top: 8px;
  padding: 5px 10px;
  width: 70%;
`;

const OptionButtons = styled.div`
  display: flex;
  flex-direction: row;
  width: 30%;
`;

const SubmitButton = styled.input`
  background: #8454F6;
  border: none;
  border-radius: 5px;
  padding-top: 15px;
  padding-bottom: 15px;
  font-size: 16pt;
  color: black;
  margin-bottom: 15px;
  width: 95%;
  margin-left: 5%;
  &:hover {
    cursor: pointer;
    background: #6943C4;
  }
`;

const Api = () => {
  const navigate = useNavigate();
  const [url, setURL] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const handleAPIChange = (e) => {
    if (e.target.files) setURL(e.target.files[0]);
  };

  const addAPI = async () => {
    try {
      const response = await axios.post('http://localhost:8000/add_endpoint', { url }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if(response.data.message == 'OK') {
        navigate("/dashboard");
      } else {
        if(response.data.message == 'ERROR') setError(response.data.data);
        else setError('Backend server malfunction. Please, contact your supplier');
      }
    } catch (error) {
      console.error('Error fetching request:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  };

  useEffect(() => {
    if (!token) {
      console.error('Token not found');
      navigate("/login");
    }
  }, []);

  return(
    <Wrap>
      <Menu />
      <ActionBlock>
        <ActionBlockDiv>
          <Header>
            <HeaderLogo src={logo} />
            <h1>Add Suricata API Endpoint</h1>
          </Header>
          <ActionBlockDivInner>
            <InputField type='text' id='url' name='url' placeholder='API URL' onChange={handleAPIChange} />
            <OptionButtons>
              <SubmitButton type='submit' id='submit' name='submit' onClick={addAPI} value="Add Endpoint!" />
            </OptionButtons>
          </ActionBlockDivInner>
        </ActionBlockDiv>
      </ActionBlock>
    </Wrap>
  );
};

export default Api;