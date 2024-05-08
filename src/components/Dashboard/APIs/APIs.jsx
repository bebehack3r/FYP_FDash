import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import styled from 'styled-components';
import axios from 'axios';
import {LineChart, Line, PieChart, Pie, Cell, Legend, Tooltip,BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

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
  background: #6943C4;
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

const APIs = ({ setDisplayContents, token, focusPoint, setFocusPoint, role }) => {
  const [error, setError] = useState(null);
  const [APIs, setAPIs] = useState(null);
  const [focusedAPI, setFocusedAPI] = useState(null);
  const [contentsAPI, setContentsAPI] = useState(null);
  const [autoAlertsAPI, setAutoAlertsAPI] = useState(null);
  const [customAlertsAPI, setCustomAlertsAPI] = useState(null);
  const [customAlertInit, setCustomAlertInit] = useState(false);
  const [customAlertDescription, setCustomAlertDescription] = useState(null);
  const [customAlertType, setCustomAlertType] = useState(null);
  const [customAlertID, setCustomAlertID] = useState(null);
  const [customAlertEdition, setCustomAlertEdition] = useState(false);

  const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''); // fuck react keys

  useEffect(() => {
    const fetchAPIs = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACKEND_URL + '/list_endpoints', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if(response.data.message === 'OK') setAPIs(response.data.data);
        else {
          if(response.data.message === 'ERROR') setError(response.data.data);
          else setError('Backend server malfunction. Please, contact your supplier');
        }
      } catch (error) {
        console.log(error);
        setError('Frontend server malfunction. Please, contact your supplier');
      }
    };
    fetchAPIs();
  }, []);

  useEffect(() => {
    if(!focusedAPI) return;
    const analyzeAPI = async (id) => {
      try {
        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/analyze_endpoint/', { id }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if(response.data.message === 'OK') {
          setContentsAPI(response.data.data.contents);
          setAutoAlertsAPI(response.data.data.alerts);
        } else {
          if(response.data.message === 'ERROR') setError(response.data.data);
          else setError('Backend server malfunction. Please, contact your supplier');
        }
      } catch (error) {
        console.error('Error fetching APIs:', error);
        setError('Frontend server malfunction. Please, contact your supplier');
      }
    };
    analyzeAPI(focusPoint.id);
    fetchCustomAlerts(focusPoint.uuid);
  }, [focusedAPI]);

  useEffect(() => {
    if(!contentsAPI || !autoAlertsAPI || !customAlertsAPI) return;
    const formCustomAlertsTable = (arr) => {
      return(
        <Column>
          <Row>
            <h2>Custom Alerts:</h2>
            <CreateAlertButton onClick={handleCustomAlertCreate}>&nbsp;&nbsp;+create</CreateAlertButton>
          </Row>
          {
            customAlertInit && <Row>
              <CustomAlertInput type='text' id='type' name='type' placeholder='Give alert type' onChange={handleCustomAlertType} value={customAlertType} />
              <CustomAlertInputLeft type='text' id='desc' name='desc' placeholder='Describe alert' onChange={handleCustomAlertDescription} value={customAlertDescription} />
              { customAlertEdition ? <CutomAlertButton type='submit' id='submit' name='submit' onClick={handleCustomAlertEditSubmit} value='Edit' />
              : <CutomAlertButton type='submit' id='submit' name='submit' onClick={handleCustomAlertCreateSubmit} value='Create' /> }
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
                          <CustomAlertActionButton key={ `${a.id}_action_edit`} onClick={() => { handleCustomAlertEdit(a); }}>✏️</CustomAlertActionButton>
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
                    <TableRow key={ `${genRanHex(10)}_row` }>
                      <TableCell key={ `${genRanHex(10)}_severity` }>{ a.severity_level }</TableCell>
                      <TableCell key={ `${genRanHex(10)}_sign` }>{ a.signature }</TableCell>
                      <TableCell key={ `${genRanHex(10)}_src_ip` }>{ a.src_ip }</TableCell>
                      <TableCell key={ `${genRanHex(10)}_dst_ip` }>{ a.dest_ip }</TableCell>
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
    const formPieChart = (arr) => {
      // Define data for the pie chart
      const data = arr.reduce((acc, curr) => {
        const existing = acc.find(item => item.name === curr.signature); // Group by 'signature'
        if (existing) {
          existing.value += curr.severity; // Aggregate 'severity' values
        } else {
          acc.push({ name: curr.signature, value: curr.severity });
        }
        return acc;
      }, []);
      // Generate unique colors based on the index
      const generateColor = (index) => {
        const hue = (index * 137.5) % 360; // This formula ensures a unique color for each segment
        return `hsl(${hue}, 70%, 50%)`;
      };

      // Function to slice text at a given length and add ellipsis
      const sliceText = (text, maxLength) => {
        if (text.length > maxLength) {
          return text.slice(0, maxLength) + '...';
        }
        return text;
      };
      // Render the pie chart
      return (
        <Column>
          <h2>Severity level of Detected Alerts with numbers:</h2>
          <PieChart width={1200} height={500}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={120}
              outerRadius={150}
              paddingAngle={3}
            >
              {/* Apply unique colors to each segment */}
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={generateColor(index)} />
              ))}
            </Pie>
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{ overflowY: 'auto', maxHeight: 200 }} // Handling long legends
              formatter={(value) => sliceText(value, 60)} // Custom formatter for the legend text
            />
            <Tooltip />
          </PieChart>
        </Column>
      );
    };
    const formLineChart = (arr) => {
      const groupedByTime = arr.reduce((acc, a) => {
        const date = new Date(a.timestamp).toISOString().slice(0, 10); // Group by date
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
        const chartData = Object.keys(groupedByTime).map(key => ({
          date: key,
          count: groupedByTime[key],
        }));
        return (
          <Column><h2>TimeStamp Counts:</h2>
          <LineChart
            width={1000}
            height={500}
            data={chartData}
            margin={{
              top: 30,
              right: 30,
              left: 30,
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="white" />
            <XAxis dataKey="date" stroke="white"/>
            <YAxis stroke='white' label={{
            value: 'Number of TimeStamp Count',
            angle: -90,
            position: 'insideLeft',
            dy: 100, 
            fill: 'white',
          }}/>
            <Tooltip />
            <Legend />
            <Line type="white" dataKey="count" stroke="red" activeDot={{ r: 8 }} />
          </LineChart>
          </Column>
        );
      };
      const formBarChart = (arr) => {
        const data = arr.map((a) => ({
          severity_level: a.severity_level,
          severity: a.severity,
        }));
        return (
        <Column><h2>Severity Levels:</h2>
        <BarChart
        width={1000}
        height={500}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="severity_level" name="Severity Level" />
          <YAxis name="Alert Count" />
          <Tooltip />
          <Legend />
          <Bar dataKey="severity" fill="#8158E7" /> 
        </BarChart>
      </Column>
      );
    };
    
    setDisplayContents({
      customAlerts: formCustomAlertsTable(customAlertsAPI),
      autoAlerts: formAutoAlertsTable(autoAlertsAPI),
      contents: formSourceBlock(contentsAPI),
      activityMap: formActivityMap(autoAlertsAPI),
      pieChart: formPieChart(autoAlertsAPI),
      barChart: formBarChart(autoAlertsAPI),
      lineChart: formLineChart(autoAlertsAPI),
    });
  }, [contentsAPI, autoAlertsAPI, customAlertsAPI, customAlertInit, customAlertDescription, customAlertType]);

  const fetchCustomAlerts = async (uuid) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/list_threat_notifications/${uuid}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.data.message === 'OK') {
        setCustomAlertsAPI(response.data.data);
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
        uuid: focusPoint.uuid, 
        type: customAlertType,
        desc: customAlertDescription
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.data.message === 'OK') {
        fetchCustomAlerts(focusPoint.uuid);
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
        fetchCustomAlerts(focusPoint.uuid);
      } else {
        if(response.data.message === 'ERROR') setError(response.data.data);
        else setError('Backend server malfunction. Please, contact your supplier');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  };

  const handleCustomAlertEdit = (a) => {
    setCustomAlertID(a.id);
    setCustomAlertDescription(a.description);
    setCustomAlertType(a.type);
    setCustomAlertEdition(true);
    setCustomAlertInit(true);
  };

  const handleCustomAlertEditSubmit = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/update_threat_notification/', {
        id: customAlertID, 
        type: customAlertType,
        desc: customAlertDescription,
        date: customAlertsAPI.filter(a => a.id === customAlertID)[0].date
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.data.message === 'OK') {
        setCustomAlertID(null);
        setCustomAlertDescription(null);
        setCustomAlertType(null);
        setCustomAlertEdition(false);
        setCustomAlertInit(false);
        fetchCustomAlerts(focusPoint.uuid);
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
    setFocusedAPI(null);
    setDisplayContents(null);
    setAutoAlertsAPI(null);
    setCustomAlertsAPI(null);
  }, [focusPoint]);

  const handleSelectAPI = (id) => {
    if(focusedAPI?.id === id) return;
    setFocusPoint(APIs.find(api => api.id === id));
    setFocusedAPI(APIs.find(api => api.id === id));
  };

  const handleRemoveAPI = async (id) => {
    try {
      const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/remove_endpoint/', { id }, {
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
      console.error('Error removing API:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  };

  return(
    <Block>
      <h2>– Suricata API</h2>
      { 
        APIs && APIs.map(api => <Row key={ `${api.id}_row` }>
          {['analyst', 'admin','superAdmin','gigaAdmin'].includes(role) && <ActiveSpan key={ `${api.id}_remove` } onClick={()=>{ handleRemoveAPI(api.id) }} style={{ marginRight: '10px' }}>❌</ActiveSpan>}
          <ActiveSpan key={ `${api.id}_name` } onClick={() => { handleSelectAPI(api.id) }} style={{ fontWeight: 'bold' }}>{api.url}</ActiveSpan>
        </Row>) 
      }
    </Block>
  );
};

export default APIs;
