import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      console.error('No token found');
      return;
    }

    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/list_logs', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if(response.message == 'OK') setLogs(response.data);
        else {
          if(response.message == 'ERROR') setError(response.data);
          else setError('Backend server malfunction. Please, contact your supplier');
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
        setError('Frontend server malfunction. Please, contact your supplier');
      }
    };

    fetchLogs();
  }, []);

  return(
    <Wrap>
      {!error && logs.map(log => (
        <li key={log.id}>{log.filename}</li>
      ))}
      {error && <p>error</p>}
    </Wrap>
  );
};

export default Dashboard;