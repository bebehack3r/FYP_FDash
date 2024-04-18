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

const APIs = ({ setDisplayContents, token }) => {
  const [error, setError] = useState(null);
  const [APIs, setAPIs] = useState(null);
  const [focusedAPI, setFocusedAPI] = useState(null);
  const [contentsAPI, setContentsAPI] = useState(null);
  const [autoAlertsAPI, setAutoAlertsAPI] = useState(null);
  const [customAlertsAPI, setCustomAlertsAPI] = useState(null);

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
        console.error('Error fetching custom alerts for API:', error);
        setError('Frontend server malfunction. Please, contact your supplier');
      }
    };
    analyzeAPI(focusedAPI.id);
    fetchCustomAlerts(focusedAPI.uuid);
  }, [focusedAPI]);

  useEffect(() => {
    if(!contentsAPI || !autoAlertsAPI || !customAlertsAPI) return;
    const formCustomAlertsTable = (arr) => {
      return(
        <Column>
          <h2>Custom Alerts:</h2>
          <Table>
            <TableRow>
              <TableHeader>Type</TableHeader>
              <TableHeader>Description</TableHeader>
            </TableRow>
            { 
              arr.map(a => {
                return(
                  <TableRow key={ a.id}>
                    <TableCell>{ a.type }</TableCell>
                    <TableCell>{ a.description }</TableCell>
                  </TableRow>
                );
              })
            }
          </Table>
        </Column>
      );
    };
    const formAutoAlertsTable = (arr) => {
      return(
        <Column>
          <h2>Detected Alerts:</h2>
          <Table>
            <TableRow>
              <TableHeader>Priority</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Source IP</TableHeader>
              <TableHeader>Destination IP</TableHeader>
            </TableRow>
            { 
              arr.map(a => {
                return(
                  <TableRow key={ a.lineNumber}>
                    <TableCell>{ a.severity_level }</TableCell>
                    <TableCell>{ a.signature }</TableCell>
                    <TableCell>{ a.src_ip }</TableCell>
                    <TableCell>{ a.dest_ip }</TableCell>
                  </TableRow>
                );
              })
            }
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
            { arr.map(a => a.ipLocation && <Marker position={a.ipLocation} />) }
          </MapContainer>
          <span style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.1)' }}>*Should any IP addresses yield a location a pin will appear on the map.</span>
        </Column>
      );
    };
    setDisplayContents({
      customAlerts: formCustomAlertsTable(customAlertsAPI),
      autoAlerts: formAutoAlertsTable(autoAlertsAPI),
      contents: formSourceBlock(contentsAPI),
      activityMap: formActivityMap(autoAlertsAPI)
    });
  }, [contentsAPI, autoAlertsAPI, customAlertsAPI]);

  const handleSelectAPI = (id) => {
    setDisplayContents(null);
    setAutoAlertsAPI(null);
    setCustomAlertsAPI(null);
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
        APIs && APIs.map(api => <Row>
          <ActiveSpan onClick={()=>{ handleRemoveAPI(api.id) }} style={{ marginRight: '10px' }}>❌</ActiveSpan>
          <ActiveSpan onClick={() => { handleSelectAPI(api.id) }} style={{ fontWeight: 'bold' }}>{api.url}</ActiveSpan>
        </Row>) 
      }
    </Block>
  );
};

export default APIs;