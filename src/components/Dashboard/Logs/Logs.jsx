import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import styled from 'styled-components';
import axios from 'axios';

import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility';

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

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Table = styled.table`
  border: 1px solid white;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  width: 100%;
`;

const TableCell = styled.td`
  padding: 8px 15px;
  border: 1px solid white;
  border-collapse: collapse;
`;

const TableHeader = styled(TableCell)`
  background: #2D2828;
  font-weight: bold;
`;

const FileContent = styled.pre`
  width: 96%;
  margin: 0;
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 15px;
  padding-bottom: 15px;
  background: black;
  overflow: scroll;
  height: 40vh;
`;

const CreateAlertButton = styled.h3`
  &:hover {
    cursor: pointer
  }
`;

const CustomAlertInput = styled.input`
  width: 44%;
  padding-left: 0.5%;
  padding-right: 0.5%;
  padding-top: 4px;
  padding-bottom: 4px;
  margin-bottom: 8px;
`;

const CustomAlertInputLeft = styled(CustomAlertInput)`
  margin-right: 1%;
`;

const CutomAlertButton = styled.input`
  background: #8454F6;
  border: none;
  border-radius: 3px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin-bottom: 8px;
  font-size: 12pt;
  width: 11%;
  margin-left: 1%;
  color: white;

  &:hover {
    cursor: pointer;
    background: #6943C4;
  }
`;

const CustomAlertActionButton = styled.span`
  &:hover {
    cursor: pointer;
  }
`;

const Logs = ({ setDisplayContents, token, focusPoint, setFocusPoint, role }) => {
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState(null);
  const [focusedLog, setFocusedLog] = useState(null);
  const [contentsLog, setContentsLog] = useState(null);
  const [autoAlertsLog, setAutoAlertsLog] = useState(null);
  const [customAlertsLog, setCustomAlertsLog] = useState(null);
  const [customAlertInit, setCustomAlertInit] = useState(false);
  const [customAlertDescription, setCustomAlertDescription] = useState(null);
  const [customAlertType, setCustomAlertType] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACKEND_URL + '/list_logs', {
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
    const analyzeLog = async (id) => {
      try {
        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/analyze_log/', { id }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if(response.data.message === 'OK') {
          setContentsLog(response.data.data.contents);
          setAutoAlertsLog(response.data.data.alerts);
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
    fetchCustomAlerts(focusedLog.uuid);
  }, [focusedLog]);

  useEffect(() => {
    if(!contentsLog || !autoAlertsLog || !customAlertsLog) return;
    const formCustomAlertsTable = (arr) => {
      return(
        <Column>
          <Row>
            <h2>Custom Alerts:</h2>
            <CreateAlertButton onClick={handleCustomAlertCreate}>&nbsp;&nbsp;+create</CreateAlertButton>
          </Row>
          {
            customAlertInit && <Row>
              <CustomAlertInputLeft type='text' id='desc' name='desc' placeholder='Describe alert' onChange={handleCustomAlertDescription} value={customAlertDescription} />
              <CustomAlertInput type='text' id='type' name='type' placeholder='Give alert type' onChange={handleCustomAlertType} value={customAlertType} />
              <CutomAlertButton type='submit' id='submit' name='submit' onClick={handleCustomAlertCreateSubmit} value='Create' />
              {/* { !customAlertFocus && <CutomAlertButton type='submit' id='submit' name='submit' onClick={handleCreateCustomAlertSubmit} value='Create' /> }
              { customAlertFocus && <CutomAlertButton type='submit' id='submit' name='submit' onClick={handleEditCustomAlertSubmit} value='Edit' /> } */}
            </Row>
          }
          <Table>
            <tbody>
              <TableRow>
                <TableHeader width="12%">Type</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader width="12%" style={{ textAlign: 'center' }}>Action</TableHeader>
              </TableRow>
              { 
                arr.map(a => {
                  return(
                    <TableRow key={ `${a.id}_row` }>
                      <TableCell key={ `${a.id}_type`}>{ a.type }</TableCell>
                      <TableCell key={ `${a.id}_desc`}>{ a.description }</TableCell>
                      <TableCell key={ `${a.id}_action`}>
                        <span key={ `${a.id}_action_span`} style={{ display: 'flex', width: '80%', marginLeft: '10%', justifyContent: 'space-evenly' }}>
                          <CustomAlertActionButton key={ `${a.id}_action_edit`}>✏️</CustomAlertActionButton>
                          <CustomAlertActionButton key={ `${a.id}_action_remove`} onClick={() => { handleCustomAlertRemove(a.id); }}>❌</CustomAlertActionButton>
                        </span>
                      </TableCell>  
                    </TableRow>
                  );
                })
              }
              </tbody>
          </Table>
        </Column>
      );
    };
    const formAutoAlertsTable = (arr) => {
      return(
        <Column>
          <h2>Detected Alerts:</h2>
          <Table>
            <tbody>
              <TableRow>
                <TableHeader width="12%">Type</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader width="12%">Source IP</TableHeader>
                <TableHeader width="12%">Destination IP</TableHeader>
              </TableRow>
              { 
                arr.map(a => {
                  return(
                    <TableRow key={ `${a.lineNumber}_row` }>
                        <TableCell key={ `${a.lineNumber}_type` }>{ a.threatType }</TableCell>
                        <TableCell key={ `${a.lineNumber}_sline` }>{ a.sourceLine }</TableCell>
                        <TableCell key={ `${a.lineNumber}_src_ip` }>{ a.ipAddress }</TableCell>
                        <TableCell key={ `${a.lineNumber}_dst_ip` }>{ a.destinationIPAddress }</TableCell>
                    </TableRow>
                  );
                })
              }
            </tbody>
          </Table>
        </Column>
      );
    };
    const formSourceBlock = (sources) => {
      return(
        <Column>
          <h2>Contents:</h2>
          <FileContent>
            {sources}
          </FileContent>
        </Column>
      );
    };
    const formActivityMap = (arr) => {
      return(
        <Column>
          <h2>Activity Map:</h2>
          <MapContainer style={{ width: '100%', height: '50vh', marginBottom: '5px' }} center={[30,30]} zoom={2} scrollWheelZoom={false}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            { arr.map(a => a.ipLocation && <Marker key={a.lineNumber} position={a.ipLocation} />) }
          </MapContainer>
          <span style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.1)' }}>*Should any IP addresses yield a location a pin will appear on the map.</span>
        </Column>
      );
    };
    setDisplayContents({
      customAlerts: formCustomAlertsTable(customAlertsLog),
      autoAlerts: formAutoAlertsTable(autoAlertsLog),
      contents: formSourceBlock(contentsLog),
      activityMap: formActivityMap(autoAlertsLog)
    });
  }, [contentsLog, autoAlertsLog, customAlertsLog, customAlertInit, customAlertDescription, customAlertType]);

  const fetchCustomAlerts = async (uuid) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/list_threat_notifications/${uuid}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.data.message === 'OK') {
        setCustomAlertsLog(response.data.data);
      } else {
        if(response.data.message === 'ERROR') setError(response.data.data);
        else setError('Backend server malfunction. Please, contact your supplier');
      }
    } catch (error) {
      console.error('Error fetching custom alert for log:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  };

  const handleCustomAlertCreate = () => {
    setCustomAlertInit(true);
  };

  const handleCustomAlertDescription = (e) => {
    setCustomAlertDescription(e.target.value);
  };

  const handleCustomAlertType = (e) => {
    setCustomAlertType(e.target.value);
  };

  const handleCustomAlertCreateSubmit = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/create_threat_notification/', {
        uuid: focusedLog.uuid, 
        type: customAlertType,
        desc: customAlertDescription
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.data.message === 'OK') {
        fetchCustomAlerts(focusedLog.uuid);
      } else {
        if(response.data.message === 'ERROR') setError(response.data.data);
        else setError('Backend server malfunction. Please, contact your supplier');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  };

  const handleCustomAlertRemove = async (id) => {
    try {
      const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/remove_threat_notification/', { id }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.data.message === 'OK') {
        fetchCustomAlerts(focusedLog.uuid);
      } else {
        if(response.data.message === 'ERROR') setError(response.data.data);
        else setError('Backend server malfunction. Please, contact your supplier');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  };

  useEffect(() => {
    setFocusedLog(null);
    setDisplayContents(null);
    setAutoAlertsLog(null);
    setCustomAlertsLog(null);
  }, [focusPoint]);

  const handleSelectLog = (id) => {
    if(focusedLog?.id === id) return;
    setFocusPoint(logs.find(log => log.id === id));
    setFocusedLog(logs.find(log => log.id === id));
  };

  const handleRemoveLog = async (id) => {
    try {
      console.log(process.env.REACT_APP_BACKEND_URL);
      const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/remove_log/', { id }, {
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
      <h2>– Snort Logs</h2>
      { 
        logs && logs.map(log => <Row key={ `${log.id}_row` }>
          { ['analyst', 'admin','superAdmin','gigaAdmin'].includes(role) && <ActiveSpan key={ `${log.id}_remove` } onClick={()=>{ handleRemoveLog(log.id) }} style={{ marginRight: '10px' }}>❌</ActiveSpan> }
          <ActiveSpan key={ `${log.id}_name` } onClick={() => { handleSelectLog(log.id) }} style={{ fontWeight: 'bold' }}>{log.fname}</ActiveSpan>
        </Row>) 
      }
    </Block>
  );
};

export default Logs;