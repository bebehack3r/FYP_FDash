import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import Menu from '../Menu/Menu.jsx';

const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Workstage = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

const AccessLogsList = styled.div`
  display: flex;
  flex-direction: column;
  width: 80vw;
  border-radius: 5px;
  background: #161414;
  color: white;
  margin-top: 10vh;
  margin-left: 10vw;
  box-shadow: 1px 1px 5px rgba(0,0,0,0.5);
  min-height: 80vh;
  margin-bottom: 5vh;
`;

const AccessLogsListTitle = styled.h1`
  margin-left: 5%;
`;

const AccessLogsListTable = styled.table`
  width: 90%;
  margin-left: 5%;
  margin-bottom: 5vh;
`;

const AccessLogsListEntry = styled.tr`
  padding: 0;
  margin: 0;
`;

const AccessLogsListCell = styled.td`
  border: 1px solid white;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
`;

const Monitoring = () => {
  const [accessLogs, setAccessLogs] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      console.error('No token found');
      return;
    }
    const fetchAccessLogs = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACKEND_URL + '/list_access_logs', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data.data);
        if(response.data.message === 'OK') setAccessLogs(response.data.data);
        else {
          if(response.data.message === 'ERROR') setError(response.data.data);
          else setError('Backend server malfunction. Please, contact your supplier');
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
        setError('Frontend server malfunction. Please, contact your supplier');
      }
    };
    fetchAccessLogs();
  }, []);

  return(
    <Wrap>
      <Menu />
      <Workstage>
        <AccessLogsList>
        {!error && <>
          <AccessLogsListTitle>Access Logs</AccessLogsListTitle>
          <AccessLogsListTable>
            <AccessLogsListCell style={{ width: '5vw' }}><b>Date</b></AccessLogsListCell>
            <AccessLogsListCell style={{ width: '6vw' }}><b>IP</b></AccessLogsListCell>
            <AccessLogsListCell style={{ width: '8vw' }}><b>Endpoint</b></AccessLogsListCell>
            <AccessLogsListCell><b>Request Body</b></AccessLogsListCell>
            {accessLogs && accessLogs.map(log => (
              <AccessLogsListEntry key={log.id}>
                <AccessLogsListCell>{new Date(log.date).toLocaleDateString()}</AccessLogsListCell>
                <AccessLogsListCell>{log.ip}</AccessLogsListCell>
                <AccessLogsListCell>{log.endpoint}</AccessLogsListCell>
                <AccessLogsListCell>{log.body}</AccessLogsListCell>
              </AccessLogsListEntry>
            ))}
          </AccessLogsListTable>
        </>}
        {error && <p>error</p>}
        </AccessLogsList>
      </Workstage>
    </Wrap>
  );
};

export default Monitoring;