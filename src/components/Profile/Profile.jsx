import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Profile = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [userID, setUserID] = useState(1);
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

  const edit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/update_user_profile', { id: userID, email, name, pass });
      if(response.message == 'OK') navigate("/login");
      else {
        if(response.message == 'ERROR') setError(response.data);
        else setError('Backend server malfunction. Please, contact your supplier');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  };

  useEffect(async () => {
    if (!token) {
      console.error('Token not found');
      navigate("/login");
    }
    try {
      const response = await axios.get(`http://localhost:8000/get_user_profile/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.message == 'OK') {
        setName(response.data.name);
        setEmail(response.data.email);
        setPass(response.data.pass);
      } else {
        if(response.message == 'ERROR') setError(response.data);
        else setError('Backend server malfunction. Please, contact your supplier');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  }, []);

  return(
    <Wrap>
      <input type='text' id='name' name='name' placeholder='name' value={name} onChange={handleName} />
      <input type='text' id='email' name='email' placeholder='e-mail' value={email} onChange={handleEmail} />
      <input type='password' id='password' name='password' placeholder='password' value={pass} onChange={handlePass} />
      <input type='submit' id='submit' name='submit' onClick={edit} value="Edit" />
    </Wrap>
  );
};

export default Profile;