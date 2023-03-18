import 'styles/views/Profile.scss';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {api, handleError} from 'helpers/api';
import {Button} from "../ui/Button";
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {Spinner} from 'components/ui/Spinner';
//axios的第三方库来发起HTTP请求，并在响应中获取图像URL。axios是一个流行的JavaScript库，用于在浏览器和Node.js中发起HTTP请求


const ProfilePage = () => {
    const history = useHistory();
    const {id} = useParams();
    const localid = localStorage.getItem('id');
    const [imageUrl, setImageUrl] = useState(null);
    const [users, setUsers] = useState(null);
    const [showEditButton, setShowEditButton] = useState(false);
  
    useEffect(() => {
      axios.get('https://source.unsplash.com/random')
        .then((response) => setImageUrl(response.request.responseURL))
        .catch((error) => console.log(error));
    }, []);
  
    useEffect(() => {
      async function fetchData() {
        try {
          const requestBody = { id: id };
          const response = await api.post('/users/profile', requestBody);
          console.log(response);
          setUsers(response.data);
        } catch (error) {
          alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
      }
  
      fetchData();
    }, [id]);
  
    useEffect(() => {
      if (users && users.id === localid) {
        setShowEditButton(true);
      } else {
        setShowEditButton(false);
      }
    }, [users, localid]);
  
    const Profilefield = ({ user, showEditButton }) => {
      const statusStyle = {
        color: user.status === "ONLINE" ? "green" : "red"
      };
  
      return (
        <div className="profile container">
          <div className="profile name">User ID: {localid}</div>
          <div className="profile name">User ID: {user.id}</div>
          <div className="profile username">Username: {user.username}</div>
          <div className="profile name">Creation date: {user.registerDate}</div>
          <div className="profile name">Birth date: {user.birthDate}</div>
          <div className="profile name">
            Online status:
            <span style={statusStyle}>{user.status}</span>
          </div>
          {showEditButton && (
            <div className="login button-container">
              <Button
                width="100%"
                onClick={() => history.push('/editprofile')}
              >
                Edit
              </Button>
            </div>
          )}
        </div>
      );
    };}

export default ProfilePage;
