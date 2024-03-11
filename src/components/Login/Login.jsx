import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [error, setError] = useState(null);

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePass = (e) => {
    setPass(e.target.value);
  };

  const login = async () => {
    try {
      const response = await axios.post('http://localhost:8000/login', { email, pass });
      if(response.message == 'OK') {
        setToken(response.data);
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
    if (token) {
      console.error('Token found');
      navigate("/dashboard");
    }
  }, []);

  return(
    <Wrap>
      <input type='text' id='login' name='login' onChange={handleEmail} placeholder="e-mail" />
      <input type='password' id='password' name='password' onChange={handlePass} placeholder="password" />
      <input type='submit' id='submit' name='submit' onClick={login} value="Log In" />
    </Wrap>
  );
};

export default Login;