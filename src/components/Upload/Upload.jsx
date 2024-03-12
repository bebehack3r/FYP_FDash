import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

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
  height: 30vh;
  margin-top: 35vh;
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

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const uploadLog = async () => {
    try {
      const response = await axios.post('http://localhost:8000/upload_log', { file });
      if(response.message == 'OK') {
        navigate("/dashboard");
      } else {
        if(response.message == 'ERROR') setError(response.data);
        else setError('Backend server malfunction. Please, contact your supplier');
      }
    } catch (error) {
      console.error('Error fetching request:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  };

  useEffect(() => {
    // if (!token) {
    //   console.error('Token not found');
    //   navigate("/login");
    // }
  }, []);

  return(
    <Wrap>
      <ActionBlock>
        <ActionBlockDiv>
          <Header>
            <HeaderLogo src={logo} />
            <h1>Upload Log File</h1>
          </Header>
          <ActionBlockDivInner>
            <InputField type='file' id='file' name='file' placeholder="File" onChange={handleFileChange} />
            <SubmitButton type='submit' id='submit' name='submit' onClick={uploadLog} value="Upload File!" />
          </ActionBlockDivInner>
        </ActionBlockDiv>
      </ActionBlock>
    </Wrap>
  );
};

export default Upload;