import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

import Menu from "../Menu/Menu.jsx";

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

const LogsList = styled.div`
  display: flex;
  flex-direction: column;
  width: 20vw;
  border-radius: 5px;
  background: #161414;
  color: white;
  margin-top: 10vh;
  margin-left: 5vw;
  box-shadow: 1px 1px 5px rgba(0,0,0,0.5);
  min-height: 80vh;
`;

const LogsListTitle = styled.h1`
  margin-left: 7%;
`;

const LogsListEntry = styled.ul`
  display: flex;
  flex-direction: row;
  padding: 0;
  padding-left: 20px;
  margin: 0;
`;

const LogLink = styled.p`
  &:hover {
    cursor: pointer;
  }
`;

const RemoveLog = styled.p`
  margin-right: 15px;

  &:hover {
    cursor: pointer;
  }
`;

const RightSide = styled.div`
  display: flex;
  flex-direction: row;
  width: 69vw;
  border-radius: 5px;
  background: #161414;
  color: white;
  margin-top: 10vh;
  margin-left: 1vw;
  box-shadow: 1px 1px 5px rgba(0,0,0,0.5);
  min-height: 80vh;
`;

const Mini = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  margin-left: 2%;
`;

const Miniblock = styled.div`
  width: 100%;
`;

const Contentsblock = styled.div`
  width: 64%;
  margin-left: 2%;
`;

const FileContent = styled.pre`
  width: 96%;
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 15px;
  padding-bottom: 15px;
  background: black;
  overflow: scroll;
  height: 60vh;
`;

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [logContent, setLogContent] = useState(null);
  const [logAnalysis, setLogAnalysis] = useState(null);
  const [simpleThreats, setSimpleThreats] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const analyzeLog = async (id) => {
    try {
      const response = await axios.post('http://localhost:8000/analyze_log/', { id }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.data.message == 'OK') {
        setLogAnalysis(response.data.data);
      } else {
        if(response.data.message == 'ERROR') setError(response.data.data);
        else setError('Backend server malfunction. Please, contact your supplier');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  }

  const viewMore = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/get_log/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.data.message == 'OK') {
        setLogContent(response.data.data);
        analyzeLog(id);
      } else {
        if(response.data.message == 'ERROR') setError(response.data.data);
        else setError('Backend server malfunction. Please, contact your supplier');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  };

  const removeLog = async (id) => {
    try {
      const response = await axios.post('http://localhost:8000/remove_log/', { id }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.data.message == 'OK') {
        window.location.reload(false);
      } else {
        if(response.data.message == 'ERROR') setError(response.data.data);
        else setError('Backend server malfunction. Please, contact your supplier');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  };

  useEffect(() => {
    if(!logAnalysis) return;
    if(logAnalysis.length == 0) return setSimpleThreats(null);
    const threats = logAnalysis.map(e => {
      if(e.type == 'sus') {
        return { text: `Suspicious Activity at line ${e.number}`, line: e.number };
      } else if(e.type == 'scan') {
        return { text: `Scan Activity at line ${e.number}`, line: e.number };
      } else if(e.type == 'policy') {
        return { text: `Custom Policy Violation at line ${e.number}`, line: e.number };
      }
    });
    setSimpleThreats(threats);
  }, [logAnalysis]);

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
        if(response.data.message == 'OK') setLogs(response.data.data);
        else {
          if(response.data.message == 'ERROR') setError(response.data.data);
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
      <Menu />
      <Workstage>
        <LogsList>
        {!error && <>
          <LogsListTitle>Log Files</LogsListTitle>
          {logs.map(log => (
            <LogsListEntry key={log.id}>
              <RemoveLog onClick={()=>{removeLog(log.id)}}>✘</RemoveLog>
              <LogLink onClick={()=>{viewMore(log.id)}}>{log.fname}</LogLink>
            </LogsListEntry>
          ))}
        </>}
        {error && <p>error</p>}
        </LogsList>
        <RightSide>
          {logContent && <><Mini>
            <Miniblock>
              <h1>Alerts:</h1>
              <p>No alerts yet...</p>
            </Miniblock>
            <Miniblock>
              <h1>Threats:</h1>
              { !simpleThreats && <p>No threats yet...</p> }
              { simpleThreats && simpleThreats.map(t => <p key={t.line}>{t.text}</p>)}
            </Miniblock>
          </Mini>
          <Contentsblock>
            <h1>Contents:</h1>
            { logContent && <FileContent>{logContent}</FileContent>}
          </Contentsblock></> }
        </RightSide>
      </Workstage>
    </Wrap>
  );
};

export default Dashboard;