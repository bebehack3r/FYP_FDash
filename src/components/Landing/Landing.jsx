import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

import plexus from './145026-785786148.mp4';
import landingVideo from './landing_video.mp4';

import Menu from '../Menu/Menu.jsx';

const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  height: 60vh;
  width: 100vw;
  position: relative;
  color: white;
  text-align: center;
`;

const Row = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: space-evenly;
`;

const Column = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const DynamicDescription = styled.span`
  font-weight: bold;
  font-size: 24pt;
  padding-bottom: 40px;
`;

const DynamicData = styled.span`
  font-weight: bold;
  font-size: 60pt;
`;

const SubscriptionOfferLeft = styled.div`
  display: flex;
  width: 18vw;
  padding: 0 1vw;
  height: 50vh;
  margin-top: 5vh;
  border-radius: 30px;
  background: lightgrey;
  z-index: 100;
  color: black;
`;

const SubscriptionOfferMid = styled.div`
  display: flex;
  width: 23vw;
  padding: 0 1vw;
  height: 60vh;
  margin-left: 1vw;
  margin-right: 1vw;
  border-radius: 30px;
  background: white;
  z-index: 999;
  color: black;
`;

const SubscriptionOfferRight = styled.div`
  display: flex;
  width: 18vw;
  padding: 0 1vw;
  height: 50vh;
  margin-top: 5vh;
  border-radius: 30px;
  background: lightgrey;
  z-index: 100;
  color: black;
`;

const SubscriptionButton = styled.div`
  width: 70%;
  margin-left: 15%;
  margin-top: 60px;
  border-radius: 15px;
  padding: 20px 0;
  font-size: 16pt;
  color: white;
  background: black;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    box-shadow: 1px 1px 8px rgba(0,0,0,0.7);
  }
`;

const RegisterInput = styled.input`
  width: 24vw;
  margin-top: 10px;
  margin-bottom: 8px;
  font-size: 12pt;
  padding: 6px 10px;
`;

const Landing = () => {
  // const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState(0);
  const [threats, setThreats] = useState(0);
  const [attacks, setAttacks] = useState(0);

  const [registered, setRegistered] = useState(false);
  const [fullName, setFullName] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [companyEmployeeAmount, setCompanyEmployeeAmount] = useState(null);
  const [email, setEmail] = useState(null);
  const [pass, setPass] = useState(null);
  const [companyPosition, setCompanyPosition] = useState(null);

  const fetchDynamicData = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_BACKEND_URL + '/promo_data/');
      if(response.data.message === 'OK') {
        console.log('fetched');
        setCompanies(response.data.data.companies);
        setThreats(response.data.data.threats);
        setAttacks(response.data.data.attacks);
      } else {
        if(response.data.message === 'ERROR') setError(response.data.data);
        else setError('Backend server malfunction. Please, contact your supplier');
      }
    } catch (err) {
      setError(err);
      console.error('Error fetching logs:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  };

  const animateIncrement = (e, lim) => {
    const speed = 200;
    const data = +e.innerText;
    const time = lim / speed;
    if(data < lim) {
      e.innerText = Math.ceil(data + time);
      setTimeout(() => { animateIncrement(e, lim) }, 1);
    } else e.innerText = lim;
  };

  const checkVisibility = () => {
    if(document.getElementById('dynamicBlock') && document.getElementById('dynamicBlock').getBoundingClientRect().top < window.innerHeight / 1.2) {
      const companiesAmount = document.getElementById('companiesAmnt');
      const threatsAmount = document.getElementById('threatsAmnt');
      const attacksAmount = document.getElementById('attacksAmnt');
      animateIncrement(companiesAmount, companies);
      animateIncrement(threatsAmount, threats);
      animateIncrement(attacksAmount, attacks);
      window.removeEventListener('scroll', checkVisibility);
    }
  };

  useEffect(() => {
    // ----------------
    // LOAD DYNAMIC DATA FROM DATABASE
    // ----------------
    fetchDynamicData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(companies !== 0) window.addEventListener('scroll', checkVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companies]);

  const handleFullName = (e) => {
    setFullName(e.target.value);
  };

  const handleCompanyName = (e) => {
    setCompanyName(e.target.value);
  };

  const handleCompanyEmployeeAmount = (e) => {
    setCompanyEmployeeAmount(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePass = (e) => {
    setPass(e.target.value);
  };

  const handleCompanyPosition = (e) => {
    setCompanyPosition(e.target.value);
  };

  const handleRegisterSubmit = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/register_company/', { 
        fullName,
        companyName,
        companyEmployeeAmount,
        companyPosition,
        email,
        pass
      });
      console.log(response.data)
      if(response.data.message === 'OK') {
        setRegistered(true);
      } else {
        if(response.data.message === 'ERROR') setError(response.data.data);
        else setError('Backend server malfunction. Please, contact your supplier');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  }

  return(
    <Wrap>
      <Menu />
      <Block style={{ marginTop: '70px', background: 'white', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        { 
        // HEADER BLOCK 
        }
        <span style={{ zIndex: 999, fontSize: '50pt' }}>Dash</span>
        <span style={{ zIndex: 999, fontSize: '20pt' }}>Simple Cybersecurity Visualization</span>
        <video autoPlay loop muted style={{ zIndex: 1, position: 'absolute', width: '100%', height: 'auto' }}>
          <source src={plexus} type='video/mp4' />
        </video>
      </Block>
      <Block style={{ height: '80vh' }}>
        { 
        // ABOUT BLOCK 
        }
        <h1>Dash represents a step forward in creating a more secure and resilient digital environment.</h1>
        <p>With Dash, we strive to transform raw data into insightful visualizations, providing security professionals with a comprehensive and intuitive understanding of their network activity.</p>
        <video autoPlay loop muted style={{ width: '60%', marginLeft: '20%', marginBottom: '5vh' }}>
          <source src={landingVideo} type='video/mp4' />
        </video>
      </Block>
      <Block style={{ height: '30vh' }}>
        { 
        // DYNAMIC DATA BLOCK 
        }
        <div style={{ width: '80%', marginLeft: '10%' }} id='dynamicBlock'>
          <Row>
            <Column>
              <DynamicDescription>Happy Customers</DynamicDescription>
              <DynamicData id='companiesAmnt'>0</DynamicData>
            </Column>
            <Column>
              <DynamicDescription>Identified Threats</DynamicDescription>
              <DynamicData id='threatsAmnt'>0</DynamicData>
            </Column>
            <Column>
              <DynamicDescription>Attacks Prevented</DynamicDescription>
              <DynamicData id='attacksAmnt'>0</DynamicData>
            </Column>
          </Row>
        </div>
      </Block>
      <Block>
        { 
        // SUBSCRIPTION OFFER BLOCK 
        }
        <Row>
          <SubscriptionOfferLeft>
            <Column>
              <h1>Monthly Mini Plan</h1>
              <h3>Keep it simple, secure and cheap month by month</h3>
              <h2>$9.99 per Month</h2>
              <ul style={{ textAlign: 'left' }}>
                <li>Up to 3 accounts per company</li>
                <li>Access to all services</li>
                <li>Access to Universal Threats Database</li>
                <li>24/7 Support Service</li>
              </ul>
              <SubscriptionButton>
                <span>Subscribe!</span>
              </SubscriptionButton>
            </Column>
          </SubscriptionOfferLeft>
          <SubscriptionOfferMid>
            <Column>
              <h1>Annual Plan</h1>
              <h3>Stay secured 365 days 24/7</h3>
              <h2>$79.99 per Year</h2>
              <ul style={{ textAlign: 'left' }}>
                <li>Up to 11 accounts per company</li>
                <li>Access to all services</li>
                <li>Access to Universal Threats Database</li>
                <li>24/7 Priority Support Service*</li>
              </ul>
              <span style={{ color: 'rgba(0,0,0,0.05)' }}>* Priority Support Service is available over the dashboard and is done via 3rd party live chat widget system. Dash takes no responsibility for the uptime of the 3rd party parts of the subscription and is not liable in case there is an issue with 3rd party services. Should there be any issues, please, rely on e-mail based communication. Dash responds to all customers within 2 business days.</span>
              <SubscriptionButton>
                <span>Subscribe!</span>
              </SubscriptionButton>
            </Column>
          </SubscriptionOfferMid>
          <SubscriptionOfferRight>
            <Column>
              <h1>Weekly Plan</h1>
              <h3>Maybe you need an easy routine to run once a week?</h3>
              <h2>$7.99 per Week</h2>
              <ul style={{ textAlign: 'left' }}>
                <li>Up to 2 accounts per company</li>
                <li>Access to all services</li>
                <li>Access to Universal Threats Database</li>
                <li>24/7 Support Service</li>
              </ul>
              <SubscriptionButton>
                <span>Subscribe!</span>
              </SubscriptionButton>
            </Column>
          </SubscriptionOfferRight>
        </Row>
      </Block>
      <Block style={{ fontSize: '18pt', height: '60vh', color: 'black', background: 'white', marginTop: '5vh' }}>
        { 
        // REGISTER BLOCK 
        }
        { !registered && <>
            <h1>Ready to give Dash a try?</h1>
            <form style={{ display: 'flex', marginTop: '30px', flexDirection: 'column', width: '50vw', marginLeft: '25vw', alignItems: 'flex-start', textAlign: 'left' }}>
              <Row>
                <Column style={{ marginRight: '30px' }}>
                  <label htmlFor='companyName'>Company Name: </label>
                  <RegisterInput type='text' name='companyName' placeholder='Company Name' onChange={handleCompanyName} value={companyName} />
                </Column>
                <Column>
                  <label htmlFor='companyPosition'>Company Position: </label>
                  <RegisterInput type='text' name='companyPosition' placeholder='Company Position' onChange={handleCompanyPosition} value={companyPosition} />
                </Column>
              </Row>
              <Row>
                <Column style={{ marginRight: '30px' }}>
                  <label htmlFor='employeesCount'>Company Size: </label>
                  <RegisterInput type='text' name='employeesCount' placeholder='Amount of Employees' onChange={handleCompanyEmployeeAmount} value={companyEmployeeAmount} />
                </Column>
                <Column>
                  <label htmlFor='email'>Company E-mail: </label>
                  <RegisterInput type='text' name='email' placeholder='E-mail' onChange={handleEmail} value={email} />
                </Column>
              </Row>
              <Row>
                <Column style={{ marginRight: '30px' }}>
                  <label htmlFor='fullName'>Full Name: </label>
                  <RegisterInput type='text' name='fullName' placeholder='Full Name' onChange={handleFullName} value={fullName} />
                </Column>
                <Column>
                  <label htmlFor='password'>Password: </label>
                  <RegisterInput type='password' name='password' placeholder='Password' onChange={handlePass} value={pass} />
                </Column>
              </Row>
              <SubscriptionButton onClick={handleRegisterSubmit}>Join Dash</SubscriptionButton>
            </form>
          </>
        }
        {
          registered && <>
            <h1>Thank you for your registration!</h1>
            <p>Please, follow to <a href="/login">login page</a> to access your company profile.</p>
          </>
        }
      </Block>
      <Block style={{ height: '5vh' }}>
        { 
        // FOOTER BLOCK 
        }
        <p>Made by Dash Development Team with ♥ 2024</p>
      </Block>
    </Wrap>
  );
};

export default Landing;