import 'styles/views/Profile.scss';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
//axios的第三方库来发起HTTP请求，并在响应中获取图像URL。axios是一个流行的JavaScript库，用于在浏览器和Node.js中发起HTTP请求

function Profilefield({ user }) {
            const { id } = useParams();
            const statusStyle = {
              color: user.status === "ONLINE" ? "green" : "red"
            };
          
            return (
            
              <div className="profile container">
                <div className="profile id">User ID:  {id}</div>
                <div className="profile username"> Username:  {user.username}</div>
                <div className="profile name">Online status:  {user.password}</div>
                <div className="profile name">Creation date:  {user.registerDate}</div>
                <div className="profile name">Birth date:  {user.registerDate}</div>

                <div className="profile id">
                  <span style={statusStyle}>{user.status}</span>
                </div>
              </div>
            );
          }

          Profilefield.propTypes = {
            user: PropTypes.object
          };

const ProfilePage= props =>{
  // 随机生成头像
  const [imageUrl, setImageUrl] = useState(null);
  const [user, setUser] = useState(null);
  //渲染头像函数
  useEffect(() => {
    async function fetchData() {
        try {
          const response = await api.get('/users/profile');
  
          // delays continuous execution of an async operation for 1 second.
          // This is just a fake async call, so that the spinner can be displayed
          // feel free to remove it :)
          await new Promise(resolve => setTimeout(resolve, 1000));
  
          // Get the returned users and update the state.
          setUser(response.data);
  
          // This is just some data for you to see what is available.
          // Feel free to remove it.
          console.log('request to:', response.request.responseURL);
          console.log('status code:', response.status);
          console.log('status text:', response.statusText);
          console.log('requested data:', response.data);
  
          // See here to get more data.
          console.log(response);
        } catch (error) {
          console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
          console.error("Details:", error);
          alert("Something went wrong while fetching the users! See the console for details.");
        }
      }
  
      fetchData();
    }, []);

  return (
    <BaseContainer>

            <div className="profile container">

                <div className="profile avatar">
                    {imageUrl && <img src={imageUrl} alt="profile img"  className="profile img"/>}
                </div>
                <div className="profile form">
                <Profilefield user={user} key={user.id}/>
                </div>
            </div>

    </BaseContainer>
  );
};

export default ProfilePage;
