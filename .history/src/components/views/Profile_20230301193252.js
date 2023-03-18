import React from 'react';

function ProfilePage() {
  // Replace with real user data
  const user = {
    name: 'Alice',
    username: 'alice123',
    birthday: '01/01/1990',
    avatarUrl: 'https://www.example.com/avatar.jpg',
  };

  return (
    <div className="profile user-item">
      <img src={user.avatarUrl} alt={user.username} />
      <h1>{user.name}</h1>
      <p>Username: {user.username}</p>
      <p>Birthday: {user.birthday}</p>
    </div>
  );
}

export default ProfilePage;
