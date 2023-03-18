import React from 'react';
import 'styles/views/Profile.scss';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
//axios的第三方库来发起HTTP请求，并在响应中获取图像URL。axios是一个流行的JavaScript库，用于在浏览器和Node.js中发起HTTP请求

function ProfilePage() {
  // Replace with real user data
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
        <div className="random-image">
            {imageUrl && <img src={imageUrl} alt="Random image" />}
        </div>
        <h1>{user.name}</h1>
        <p>Username: {user.username}</p>
        <p>Birthday: {user.birthday}</p>
    </div>
  );
}

export default ProfilePage;
