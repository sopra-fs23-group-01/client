import 'styles/views/Profile.scss';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
//axios的第三方库来发起HTTP请求，并在响应中获取图像URL。axios是一个流行的JavaScript库，用于在浏览器和Node.js中发起HTTP请求

const Profilefield= props =>{
    // //获取用户信息
     const { id } = useParams();
     return (
        <div className="profile field">
          <label className="profile label">
            User ID:{id}
          </label>
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
        </div>
      );

         };

function Player({ user }) {
const ProfilePage= props =>{
  // 随机生成头像
  const [imageUrl, setImageUrl] = useState(null);
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
                <Profilefield
                    username={user.username}
                />
                </div>
            </div>

    </BaseContainer>
  );
};
}

export default ProfilePage;
