import React, { useState } from 'react';
import "styles/views/Profile.scss";
import {useHistory} from 'react-router-dom';

function Profile() {
  // 定义本地状态
  const userid = localStorage.getItem('id');
  const [id, setUserId] = useState(userid);
  
  const [age, setAge] = useState(30);
  const [email, setEmail] = useState('johndoe@example.com');

  // 定义处理函数
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div className="profile-container">
      <h1>Profile Page</h1>
      <form>
        <label>
          Name:
          <input type="text" value={name} onChange={handleNameChange} />
        </label>
        <label>
          Age:
          <input type="number" value={age} onChange={handleAgeChange} />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={handleEmailChange} />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default Profile;
