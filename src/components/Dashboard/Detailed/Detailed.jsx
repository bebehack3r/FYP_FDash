// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { MapContainer, TileLayer, Marker } from 'react-leaflet';
// import axios from 'axios';
// import styled from 'styled-components';

// const AutoAlertItem = styled.div`
//   margin-bottom: 14px;
// `;

// const LogsListTitle = styled.h1`
//   margin-left: 7%;
// `;

// const LogsListEntry = styled.ul`
//   display: flex;
//   flex-direction: row;
//   padding: 0;
//   padding-left: 20px;
//   margin: 0;
// `;

// const LogLink = styled.p`
//   &:hover {
//     cursor: pointer;
//   }
// `;

// const RemoveLog = styled.p`
//   margin-right: 15px;

//   &:hover {
//     cursor: pointer;
//   }
// `;

// const Mini = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: 30%;
//   margin-left: 2%;
// `;

// const Miniblock = styled.div`
//   width: 100%;
// `;

// const RowBlock = styled.div`
//   display: flex;
//   flex-direction: row;
// `;

// const CreateAlertButton = styled.h3`
//   &:hover {
//     cursor: pointer
//   }
// `;



// const FileContent = styled.pre`
//   width: 96%;
//   padding-left: 2%;
//   padding-right: 2%;
//   padding-top: 15px;
//   padding-bottom: 15px;
//   background: black;
//   overflow: scroll;
//   height: 40vh;
// `;

// const CustomAlertInput = styled.input`
//   width: 95%;
//   padding-left: 2%;
//   padding-right: 2%;
//   padding-top: 8px;
//   padding-bottom: 8px;
//   margin-bottom: 8px;
// `;

// const CutomAlertButton = styled.input`
//   background: #8454F6;
//   border: none;
//   border-radius: 5px;
//   padding-top: 8px;
//   padding-bottom: 8px;
//   width: 50%;
//   margin-left: 50%;
//   font-size: 12pt;
//   color: white;
//   margin-bottom: 15px;

//   &:hover {
//     cursor: pointer;
//     background: #6943C4;
//   }
// `;

// const CustomAlertEdit = styled.span`
//   &:hover {
//     cursor: pointer;
//   }
// `;

// const Column = styled.div`
//   display: flex;
//   flex-direction: column;
// `;

// const Detailed = ({ data, token }) => {

  // const navigate = useNavigate();

  // const [displayContents, setDisplayContents] = useState(null);
  // const [customAlerts, setCustomAlerts] = useState(null);
  // const [customAlertInit, setCustomAlertInit] = useState(false);
  // const [customAlertDescription, setCustomAlertDescription] = useState(null);
  // const [customAlertType, setCustomAlertType] = useState(null);
  // const [customAlertFocus, setCustomAlertFocus] = useState(null);
  // const [error, setError] = useState(null);

  // const handleCreateCustomAlert = () => {
  //   setCustomAlertInit(true);
  //   setCustomAlertDescription(null);
  //   setCustomAlertType(null);
  // };

  // const handleCustomAlertDescription = (e) => {
  //   setCustomAlertDescription(e.target.value);
  // };

  // const handleCustomAlertType = (e) => {
  //   setCustomAlertType(e.target.value);
  // };

  // const handleCreateCustomAlertSubmit = async () => {
  //   try {
  //     const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/create_threat_notification/', {
  //       uuid: displayContents.target.uuid, 
  //       type: customAlertType,
  //       desc: customAlertDescription
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     if(response.data.message === 'OK') {
  //       window.location.reload(false);
  //     } else {
  //       if(response.data.message === 'ERROR') setError(response.data.data);
  //       else setError('Backend server malfunction. Please, contact your supplier');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching logs:', error);
  //     setError('Frontend server malfunction. Please, contact your supplier');
  //   }
  // };

  // const handleRemoveCustomAlert = async (id) => {
  //   try {
  //     const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/remove_threat_notification/', { id }, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     if(response.data.message === 'OK') {
  //       window.location.reload(false);
  //     } else {
  //       if(response.data.message === 'ERROR') setError(response.data.data);
  //       else setError('Backend server malfunction. Please, contact your supplier');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching logs:', error);
  //     setError('Frontend server malfunction. Please, contact your supplier');
  //   }
  // };

  // const handleEditCustomAlert = async (id) => {
  //   const t = customAlerts.filter(a => a.id === id)[0];
  //   setCustomAlertFocus(id);
  //   setCustomAlertDescription(t.description);
  //   setCustomAlertType(t.type);
  //   setCustomAlertInit(true);
  // };

  // const handleEditCustomAlertSubmit = async () => {
  //   try {
  //     const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/update_threat_notification/', {
  //       id: customAlertFocus, 
  //       type: customAlertType,
  //       desc: customAlertDescription,
  //       date: customAlerts.filter(a => a.id === customAlertFocus)[0].date
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     if(response.data.message === 'OK') {
  //       window.location.reload(false);
  //     } else {
  //       if(response.data.message === 'ERROR') setError(response.data.data);
  //       else setError('Backend server malfunction. Please, contact your supplier');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching logs:', error);
  //     setError('Frontend server malfunction. Please, contact your supplier');
  //   }
  // };

  // useEffect(() => {
  //   if(!displayContents) return;
  //   const fetchCustomAlerts = async (uuid) => {
  //     try {
  //       const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/list_threat_notifications/${uuid}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       });
  //       if(response.data.message === 'OK') {
  //         setCustomAlerts(response.data.data);
  //       } else {
  //         if(response.data.message === 'ERROR') setError(response.data.data);
  //         else setError('Backend server malfunction. Please, contact your supplier');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching logs:', error);
  //       setError('Frontend server malfunction. Please, contact your supplier');
  //     }
  //   };
  //   fetchCustomAlerts(displayContents.target.uuid)
  // }, [displayContents]);

  // return(
    
  // );

  // return(
  //   <RightSide>
  //         <Mini>
  //           <Miniblock>
  //             <RowBlock>
  //               { displayContents && <h1>Custom Alerts:</h1> }
  //               { displayContents && <CreateAlertButton onClick={handleCreateCustomAlert}>&nbsp;&nbsp;+create</CreateAlertButton> }
  //             </RowBlock>
  //             { customAlertInit && <>
  //                 <CustomAlertInput type='text' id='desc' name='desc' placeholder='Describe alert' onChange={handleCustomAlertDescription} value={customAlertDescription} />
  //                 <CustomAlertInput type='text' id='type' name='type' placeholder='Give alert type' onChange={handleCustomAlertType} value={customAlertType} />
  //                 { !customAlertFocus && <CutomAlertButton type='submit' id='submit' name='submit' onClick={handleCreateCustomAlertSubmit} value='Create' /> }
  //                 { customAlertFocus && <CutomAlertButton type='submit' id='submit' name='submit' onClick={handleEditCustomAlertSubmit} value='Edit' /> }
  //             </> }
  //             { displayContents && !customAlerts && <p>No Custom Threats yet...</p> }
  //             { displayContents && customAlerts && customAlerts.map(a => 
  //               <AutoAlertItem key={a.id}>
  //                 <span>
  //                   <CustomAlertEdit onClick={() => { handleRemoveCustomAlert(a.id); }}>❌&nbsp;&nbsp;</CustomAlertEdit>
  //                   <CustomAlertEdit onClick={() => { handleEditCustomAlert(a.id); }}>✏️&nbsp;&nbsp;</CustomAlertEdit>
  //                   [{a.type}]: {a.description}
  //                 </span>
  //               </AutoAlertItem>
  //             ) }
  //           </Miniblock>
  //           <Miniblock>
  //             { displayContents && <h1>Auto Alerts:</h1> }
  //             { displayContents && displayContents.alerts.map(a => <AutoAlertItem key={a.id}><span>{a.sourceLine}</span></AutoAlertItem>) }
  //           </Miniblock>
  //         </Mini>
  //         <Column>
  //           <Contentsblock>
  //             { displayContents && <h1>Contents:</h1> }
  //             { displayContents && <FileContent>{displayContents.source}</FileContent> }
  //           </Contentsblock>
  //           { displayContents &&
  //             <>
  //               <MapContainer style={{ width: '98%', height: '40vh', marginLeft: '2%', marginBottom: '5px' }} center={[30,30]} zoom={2} scrollWheelZoom={false}>
  //                 <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  //                 { displayContents.alerts.map(a => a.ipLocation && <Marker position={a.ipLocation} />) }
  //               </MapContainer>
  //               <span style={{ width: '98%', marginLeft: '2%', marginBottom: '20px', color: 'rgba(255,255,255,0.1)' }}>*Should any IP addresses yield a location a pin will appear on the map.</span>
  //             </>
  //           }
  //         </Column>
  //       </RightSide>
  // );

// };

// export default Detailed;