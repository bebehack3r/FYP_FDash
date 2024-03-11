import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Upload = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const uploadLog = async () => {
    try {
      const response = await axios.post('http://localhost:8000/upload_log', { });
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
    if (!token) {
      console.error('Token not found');
      navigate("/login");
    }
  }, []);

  return(
    <Wrap>
      <input type='text' id='file' name='file' placeholder="File" />
      <input type='submit' id='submit' name='submit' onClick={uploadLog} value="Log In" />
    </Wrap>
  );
};

export default Upload;