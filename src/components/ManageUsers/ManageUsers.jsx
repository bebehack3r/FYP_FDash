import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import Menu from '../Menu/Menu.jsx';

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

const UsersList = styled.div`
  display: flex;
  flex-direction: column;
  width: 60vw;
  border-radius: 5px;
  background: #161414;
  color: white;
  margin-top: 10vh;
  margin-left: 20vw;
  box-shadow: 1px 1px 5px rgba(0,0,0,0.5);
  min-height: 80vh;
`;

const UsersListTitle = styled.h1`
  margin-left: 7%;
`;

const UsersListTable = styled.table`
  width: 90%;
  margin-left: 5%;
`;

const UsersListEntry = styled.tr`
  padding: 0;
  margin: 0;
  text-align: center;
`;

const UserListCell = styled.td`
  border: 1px solid white;
  padding-top: 8px;
  padding-bottom: 8px;
`;

const RoleOptions = styled.select`
  width: 95%;
`;

const UserListCellAction = styled.td`
  border: 1px solid white;
  padding-top: 8px;
  padding-bottom: 8px;

  &:hover {
    cursor: pointer;
  }
`;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const suspendUser = async (id) => {
    try {
      const response = await axios.post('http://localhost:8000/suspend_user_profile/', { id }, {
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
      console.error('Error fetching logs:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  };

  const handleRoleSwitch = async (id, role) => {
    try {
      const response = await axios.post('http://localhost:8000/update_user_role/', { id, role }, {
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
      console.error('Error fetching logs:', error);
      setError('Frontend server malfunction. Please, contact your supplier');
    }
  }

  useEffect(() => {
    if (!token) {
      console.error('No token found');
      return;
    }
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/list_users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if(response.data.message === 'OK') setUsers(response.data.data);
        else {
          if(response.data.message === 'ERROR') setError(response.data.data);
          else setError('Backend server malfunction. Please, contact your supplier');
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
        setError('Frontend server malfunction. Please, contact your supplier');
      }
    };
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(
    <Wrap>
      <Menu />
      <Workstage>
        <UsersList>
        {!error && <>
          <UsersListTitle>Users</UsersListTitle>
          <UsersListTable>
            <UserListCell><b>Name</b></UserListCell>
            <UserListCell><b>Email</b></UserListCell>
            <UserListCell><b>Role</b></UserListCell>
            <UserListCell><b>Action</b></UserListCell>
            {users.map(user => (
              <UsersListEntry key={user.id}>
                <UserListCell>{user.name}</UserListCell>
                <UserListCell>{user.email}</UserListCell>
                <UserListCell>
                  <RoleOptions name='role' id='role' onChange={(e) => { handleRoleSwitch(user.id, e.target.value) }}>
                    <option value='user' selected={user.role === 'user'}>User</option>
                    <option value='analyst' selected={user.role === 'analyst'}>Analyst</option>
                    <option value='admin' selected={user.role === 'admin'}>Admin</option>
                    <option value='suspended' selected={user.role === 'suspended'}>Suspended</option>
                  </RoleOptions>
                </UserListCell>
                <UserListCellAction onClick={()=>{suspendUser(user.id)}}>Suspend!</UserListCellAction>
              </UsersListEntry>
            ))}
          </UsersListTable>
        </>}
        {error && <p>error</p>}
        </UsersList>
      </Workstage>
    </Wrap>
  );
};

export default ManageUsers;