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
`;

const OptionButtons = styled.div`
  display: flex;
  flex-direction: row;
  width: 60%;
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
  width: 45%;
  margin-left: 5%;
  &:hover {
    cursor: pointer;
    background: #6943C4;
  }
`;

const FileContents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  text-align: left;
  background: black;
  padding: 15px 15px;
  margin-top: 15px;
  margin-bottom: 15px;
  max-height: 50vh;
  overflow: scroll;
  width: 90%;
`;

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [contents, setContents] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const readFile = () => {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (e) => {
      const c = e.target.result.split('\n');
      setContents(c);
    };
  };

  const uploadLog = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('http://localhost:8000/upload_log', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if(response.data.message === 'OK') {
        navigate("/dashboard");
      } else {
        if(response.data.message === 'ERROR') setError(response.data.data);
        else setError('Backend server malfunction. Please, contact your supplier');
      }
    } catch (err) {
      setError(err);
      console.error('Error fetching request:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  };

  useEffect(() => {
    if (!token) {
      console.error('Token not found');
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(
    <Wrap>
      <Menu />
      <ActionBlock>
        <ActionBlockDiv>
          <Header>
            <HeaderLogo src={logo} />
            <h1>Upload Log File</h1>
          </Header>
          <ActionBlockDivInner>
            <InputField type='file' id='file' name='file' placeholder="File" onChange={handleFileChange} />
            <OptionButtons>
              <SubmitButton type='submit' id='submit' name='submit' onClick={uploadLog} value="Upload File!" />
              <SubmitButton type='submit' id='submit' name='submit' onClick={readFile} value="Read" />
            </OptionButtons>
          </ActionBlockDivInner>
          {contents && <FileContents>
            { contents.map(l => <pre>{l}</pre>) }
          </FileContents>}
        </ActionBlockDiv>
      </ActionBlock>
    </Wrap>
  );
};

export default Upload;