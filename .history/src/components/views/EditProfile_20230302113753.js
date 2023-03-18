import React, { useState } from 'react';
import "styles/views/Profile.scss";
import {useHistory} from 'react-router-dom';

function Profile() {
  // 定义本地状态
  const userid = localStorage.getItem('id');
  const [id, setUserId] = useState(userid);

  // 定义处理函数
  const handleNameChange = (event) => {
    setUserId(event.target.value);
  };

  return (
    <div className="profile-container">
      <h1>Profile Page</h1>
      <form>
        <label>
          Name:
          <input type="text" value={id} onChange={handleNameChange} />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default Profile;
