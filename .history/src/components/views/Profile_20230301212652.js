import 'styles/views/Profile.scss';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
//axios的第三方库来发起HTTP请求，并在响应中获取图像URL。axios是一个流行的JavaScript库，用于在浏览器和Node.js中发起HTTP请求


          {/* <label className="profile label">
            User name:{props.username}
          </label>
          <label className="profile label">
            Online status:{props.status}
          </label>
          <label className="profile label">
           Creation date:{props.registerDate}
          </label>
          <label className="profile label">
           Birth date:{props.registerDate}
          </label> */}

function Profilefield({ user }) {
            const { id } = useParams();
            const statusStyle = {
              color: user.status === "ONLINE" ? "green" : "red"
            };
          
            return (
            
              <div className="player container">
                <div className="player username"><a href={`/profile/${user.id}`} className="player namelink"> Username:{user.username}</a></div>
                <div className="player name">Password:{user.password}</div>
                <div className="player name">Creat time:{user.registerDate}</div>
                <div className="player id">id: {id}</div>
                <div className="player id">
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
  //渲染头像函数
  useEffect(() => {
    axios.get('https://source.unsplash.com/random')
      .then((response) => setImageUrl(response.request.responseURL))
      .catch((error) => console.log(error));
  }, []);

  const user = {
    name: 'Alice',
    username: 'alice123',
    birthday: '01/01/1990',
  };

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
