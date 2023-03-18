import React, { useState } from 'react';

function AvatarSelector({ avatars, onSelect }) {
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleAvatarClick = (avatar) => {
    setSelectedAvatar(avatar);
    onSelect(avatar);
  };

  return (
    <div className="avatar-selector">
      {avatars.map((avatar) => (
        <img
          key={avatar.id}
          src={avatar.imageUrl}
          alt={avatar.name}
          onClick={() => handleAvatarClick(avatar)}
          className={selectedAvatar === avatar ? 'selected' : ''}
        />
      ))}
    </div>
  );
}

export default AvatarSelector;
