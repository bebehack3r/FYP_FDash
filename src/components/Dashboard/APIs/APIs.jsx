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

const APIs = ({ setDisplayContents }) => {
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [APIs, setAPIs] = useState(null);
  const [focusedAPI, setFocusedAPI] = useState(null);
  const [contentsAPI, setContentsAPI] = useState(null);
  const [alertsAPI, setAlertsAPI] = useState(null);

  useEffect(() => {
    const fetchAPIs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/list_endpoints', {
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
        const response = await axios.post('http://localhost:8000/analyze_endpoint/', { id }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if(response.data.message === 'OK') {
          setContentsAPI(response.data.data.contents);
          setAlertsAPI(response.data.data.alerts);
        } else {
          if(response.data.message === 'ERROR') setError(response.data.data);
          else setError('Backend server malfunction. Please, contact your supplier');
        }
      } catch (error) {
        console.error('Error fetching APIs:', error);
        setError('Frontend server malfunction. Please, contact your supplier');
      }
    };
    analyzeAPI(focusedAPI.id);
  }, [focusedAPI]);

  useEffect(() => {
    if(!focusedAPI || !contentsAPI || !alertsAPI) return;
    setDisplayContents({ alerts: alertsAPI, source: contentsAPI, target: focusedAPI });
    setFocusedAPI(null);
  }, [focusedAPI, contentsAPI, alertsAPI]);

  const handleSelectAPI = (id) => {
    setDisplayContents(null);
    setFocusedAPI(APIs.filter(api => api.id === id)[0]);
  };

  const handleRemoveAPI = async (id) => {
    try {
      const response = await axios.post('http://localhost:8000/remove_endpoint/', { id }, {
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
      <h1>Suricata API</h1>
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