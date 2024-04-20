import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Menu from '../Menu/Menu.jsx';

import APIs from './APIs/APIs.jsx';
import Logs from './Logs/Logs.jsx';

const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Workstage = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  margin-top: 70px;
  margin-bottom: 50px;
  color: white;
`;

const Side = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  background: #161414;
  box-shadow: 1px 1px 5px rgba(0,0,0,0.5);
  min-height: 80vh;
`;

const LeftSide = styled(Side)`
  width: 20vw;
  margin-left: 1vw;
`;

const RightSide = styled(Side)`
  width: 77.5vw;
  margin-left: 0.5vw;
`;

const InnerBlock = styled.div`
  width: 98%;
  margin-left: 1%;
`;

const Dashboard = () => {
  const navigate = useNavigate();

  const [displayContents, setDisplayContents] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      console.error('No token found');
      navigate('/login');
      return;
    }
  }, []);

  return(
    <Wrap>
      <Menu />
      <Workstage>
        <LeftSide>
          {!error ? <div style={{ width: '90%', marginLeft: '5%' }}>
            <Logs setDisplayContents={setDisplayContents} token={token} />
            <APIs setDisplayContents={setDisplayContents} token={token} />
          </div> : <p>{error}</p>}
        </LeftSide>
        <RightSide>
          { displayContents && Object.keys(displayContents).map(key => {
              return(
                <InnerBlock key={ `${key}_block` }>
                  { displayContents[key] }
                </InnerBlock>
              )
            })
          }
        </RightSide>
      </Workstage>
    </Wrap>
  );
};

export default Dashboard;