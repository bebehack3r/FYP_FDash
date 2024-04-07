import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Block = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const ActiveSpan = styled.span`
  cursor: pointer;
`;

const Logs = ({ setDisplayContents }) => {
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [Logs, setLogs] = useState(null);
  const [focusedLog, setFocusedLog] = useState(null);
  const [contentsLog, setContentsLog] = useState(null);
  // const [alertsAPI, setAlertsAPI] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/list_logs', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if(response.data.message === 'OK') setLogs(response.data.data);
        else {
          if(response.data.message === 'ERROR') setError(response.data.data);
          else setError('Backend server malfunction. Please, contact your supplier');
        }
      } catch (error) {
        console.log(error);
        setError('Frontend server malfunction. Please, contact your supplier');
      }
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    if(!focusedLog) return;
    const fetchLogContents = async (id) => {
      try {
        const response = await axios.get(`http://localhost:8000/get_log/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if(response.data.message === 'OK') {
          setContentsLog(response.data.data);
        } else {
          if(response.data.message === 'ERROR') setError(response.data.data);
          else setError('Backend server malfunction. Please, contact your supplier');
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
        setError('Frontend server malfunction. Please, contact your supplier');
      }
    };
    fetchLogContents(focusedLog.id);
  }, [focusedLog]);

  useEffect(() => {
    if(!contentsLog || !focusedLog) return;
    const analyzeLog = async (id) => {
      try {
        const response = await axios.post('http://localhost:8000/analyze_log/', { id }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if(response.data.message === 'OK') {
          setDisplayContents({ alerts: response.data.data, source: contentsLog, target: focusedLog });
          setContentsLog(null);
          setFocusedLog(null);
        } else {
          if(response.data.message === 'ERROR') setError(response.data.data);
          else setError('Backend server malfunction. Please, contact your supplier');
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
        setError('Frontend server malfunction. Please, contact your supplier');
      }
    };
    analyzeLog(focusedLog.id);
  }, [contentsLog]);

  // useEffect(() => {
  //   if(!focusedLog || !contentsAPI || !alertsAPI) return;
  //   console.log(focusedLog);
  //   console.log(contentsAPI);
  //   console.log(alertsAPI);
  // }, [focusedLog, contentsAPI, alertsAPI]);

  const handleSelectLog = (id) => {
    setDisplayContents(null);
    setFocusedLog(Logs.filter(log => log.id === id)[0]);
  };

  const handleRemoveLog = async (id) => {
    try {
      const response = await axios.post('http://localhost:8000/remove_log/', { id }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.data.message === 'OK') {
        window.location.reload(false);
      } else {
        if(response.data.message === 'ERROR') setError(response.data.data);
        else setError('Backend server malfunction. Please, contact your supplier');
      }
    } catch (error) {
      console.error('Error removing log:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  };

  return(
    <Block>
      <h1>Snort Logs</h1>
      { 
        Logs && Logs.map(log => <Row>
          <ActiveSpan onClick={()=>{ handleRemoveLog(log.id) }} style={{ marginRight: '10px' }}>❌</ActiveSpan>
          <ActiveSpan onClick={() => { handleSelectLog(log.id) }} style={{ fontWeight: 'bold' }}>{log.fname}</ActiveSpan>
        </Row>) 
      }
    </Block>
  );
};

export default Logs;