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
  margin-bottom: 50px;
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

const RowBlock = styled.div`
  display: flex;
  flex-direction: row;
`;

const CreateAlertButton = styled.h3`
  &:hover {
    cursor: pointer
  }
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

const CustomAlertInput = styled.input`
  width: 95%;
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 8px;
  padding-bottom: 8px;
  margin-bottom: 8px;
`;

const CutomAlertButton = styled.input`
  background: #8454F6;
  border: none;
  border-radius: 5px;
  padding-top: 8px;
  padding-bottom: 8px;
  width: 50%;
  margin-left: 50%;
  font-size: 12pt;
  color: white;
  margin-bottom: 15px;

  &:hover {
    cursor: pointer;
    background: #6943C4;
  }
`;

const CustomAlertEdit = styled.span`
  &:hover {
    cursor: pointer;
  }
`;

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [logID, setLogID] = useState(null);
  const [logContent, setLogContent] = useState(null);
  const [logAnalysis, setLogAnalysis] = useState(null);
  const [simpleThreats, setSimpleThreats] = useState(null);
  const [customThreats, setCustomThreats] = useState(null);
  const [customAlertInit, setCustomAlertInit] = useState(false);
  const [customAlertDesc, setCustomAlertDesc] = useState(null);
  const [customAlertType, setCustomAlertType] = useState(null);
  const [customEditAlertInit, setCustomEditAlertInit] = useState(false);
  const [customEditAlertID, setCustomEditAlertID] = useState(null);
  const [customEditAlertDesc, setCustomEditAlertDesc] = useState(null);
  const [customEditAlertDate, setCustomEditAlertDate] = useState(null);
  const [customEditAlertType, setCustomEditAlertType] = useState(null);
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

  const fetchAlerts = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/list_threat_notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.data.message == 'OK') {
        setCustomThreats(response.data.data);
      } else {
        if(response.data.message == 'ERROR') setError(response.data.data);
        else setError('Backend server malfunction. Please, contact your supplier');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  };

  const viewMore = async (id) => {
    setLogID(id);
    try {
      const response = await axios.get(`http://localhost:8000/get_log/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.data.message == 'OK') {
        setLogContent(response.data.data);
        fetchAlerts(id);
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

  const initCreateAlert = () => {
    setCustomAlertInit(true);
  };

  const createAlert = async () => {
    try {
      const response = await axios.post('http://localhost:8000/create_threat_notification/', {
        logID: logID, 
        type: customAlertType,
        desc: customAlertDesc
      }, {
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

  const removeAlert = async (id) => {
    try {
      const response = await axios.post('http://localhost:8000/remove_threat_notification/', { id }, {
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

  const handleAlertDesc = (e) => {
    setCustomAlertDesc(e.target.value);
  };

  const handleEditAlertDesc = (e) => {
    setCustomEditAlertDesc(e.target.value);
  };

  const handleAlertType = (e) => {
    setCustomAlertType(e.target.value);
  };

  const handleEditAlertType = (e) => {
    setCustomEditAlertType(e.target.value);
  };

  const editAlertInit = (t) => {
    setCustomEditAlertID(t.id);
    setCustomEditAlertDesc(t.description);
    setCustomEditAlertType(t.type);
    setCustomEditAlertDate(t.date);
    setCustomEditAlertInit(true);
  };

  const editAlert = async (id) => {
    try {
      const response = await axios.post('http://localhost:8000/update_threat_notification/', {
        id: customEditAlertID, 
        type: customEditAlertType,
        desc: customEditAlertDesc,
        date: customEditAlertDate
      }, {
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
              <RemoveLog onClick={()=>{removeLog(log.id)}}>❌</RemoveLog>
              <LogLink onClick={()=>{viewMore(log.id)}}>{log.fname}</LogLink>
            </LogsListEntry>
          ))}
        </>}
        {error && <p>error</p>}
        </LogsList>
        <RightSide>
          {logContent && <><Mini>
            <Miniblock>
              <RowBlock>
                <h1>Alerts:</h1>
                <CreateAlertButton onClick={initCreateAlert}>&nbsp;&nbsp;+create</CreateAlertButton>
              </RowBlock>
              { customAlertInit && <>
                <CustomAlertInput type="text" id="desc" name="desc" placeholder="Describe alert" onChange={handleAlertDesc} />
                <CustomAlertInput type="text" id="type" name="type" placeholder="Give alert type" onChange={handleAlertType} />
                <CutomAlertButton type="submit" id="submit" name="submit" onClick={createAlert} value="Create" />
              </> }
              { customEditAlertInit && <>
                <CustomAlertInput type="text" id="desc" name="desc" placeholder="Describe alert" value={customEditAlertDesc} onChange={handleEditAlertDesc} />
                <CustomAlertInput type="text" id="type" name="type" placeholder="Give alert type" value={customEditAlertType} onChange={handleEditAlertType} />
                <CutomAlertButton type="submit" id="submit" name="submit" onClick={editAlert} value="Update" />
              </> }
              { !customThreats && <p>No alerts yet...</p> }
              { customThreats && customThreats.map(t => {
                return <p key={t.id}>
                  <CustomAlertEdit onClick={()=>{removeAlert(t.id)}}>❌&nbsp;&nbsp;</CustomAlertEdit>
                  <CustomAlertEdit onClick={() => { editAlertInit(t); }}>✏️&nbsp;&nbsp;</CustomAlertEdit> 
                  @{t.type}: {t.description}
                </p>
              })}
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