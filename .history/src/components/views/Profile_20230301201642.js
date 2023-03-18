import 'styles/views/Profile.scss';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
//axios的第三方库来发起HTTP请求，并在响应中获取图像URL。axios是一个流行的JavaScript库，用于在浏览器和Node.js中发起HTTP请求

const ProfilePage= props =>{
    // //获取用户信息
     const { id } = useParams();
    const Login = props => {
        const history = useHistory();
        const [password, setPassword] = useState(null);
        const [username, setUsername] = useState(null);
      
        const fetchData = async () => {
          try {
            const requestBody = JSON.stringify({id});//将username和name的请求值转换为string模式
            const response = await api.post('/users/login', requestBody);//请求server端users中的username和password
            console.log(response);
            // Get the returned user and update a new object.
            const user = new User(response.data);
      
            // Store the token into the local storage.
            localStorage.setItem('token', user.token);
            localStorage.setItem('id',user.id);
            localStorage.setItem('username',user.username);
      
            // Login successfully worked --> navigate to the route /game in the GameRouter
            history.push(`/game`);
          } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
            
          }
       };


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
    
    <div className="profile user-item">

        <div className="profile avatar">
            {imageUrl && <img src={imageUrl} alt="profile img"  className="profile img"/>}
        </div>

        <h1>{user.name}</h1>
        <p>Username: {user.username}</p>
        <p>Birthday: {user.birthday}</p>
        <p>UserID:{id}</p>
    </div>
  );
}
}

export default ProfilePage;
