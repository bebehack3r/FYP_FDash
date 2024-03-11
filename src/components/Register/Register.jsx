import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Register = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
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

  const register = async () => {
    if(pass != rePass) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/register', { email, name, pass });
      if(response.message == 'OK') navigate("/login");
      else {
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
      <input type='text' id='name' name='name' placeholder='name' onChange={handleName} />
      <input type='text' id='email' name='email' placeholder='e-mail' onChange={handleEmail} />
      <input type='password' id='password' name='password' placeholder='password' onChange={handlePass} />
      <input type='password' id='repassword' name='repassword' placeholder='re-type password' onChange={handleRePass} />
      <input type='submit' id='submit' name='submit' onClick={register} value="Sign Up" />
    </Wrap>
  );
};

export default Register;