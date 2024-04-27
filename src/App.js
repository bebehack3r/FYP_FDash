import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Landing from './components/Landing/Landing.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import Upload from './components/Upload/Upload.jsx';
import Profile from './components/Profile/Profile.jsx';
import SuccessUser from './components/SuccessUser/SuccessUser.jsx';
import ManageUsers from './components/ManageUsers/ManageUsers.jsx';
import Api from './components/Api/Api.jsx';
import Monitoring from './components/Monitoring/Monitoring.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" Component={Landing} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/login" Component={Login} />
        <Route path="/register" Component={Register} />
        <Route path="/upload" Component={Upload} />
        <Route path="/profile" Component={Profile} />
        <Route path="/successUser" Component={SuccessUser} />
        <Route path="/manageUsers" Component={ManageUsers} />
        <Route path="/api" Component={Api} />
        <Route path="/monitoring" Component={Monitoring} />
      </Routes>
    </Router>
  );
};

export default App;
