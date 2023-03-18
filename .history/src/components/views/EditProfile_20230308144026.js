
import 'styles/views/Profile.scss';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from "../ui/Button";
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import 'react-datepicker/dist/react-datepicker.css';

const NameChangeField= props =>{
    
return(
    <div className="profile username">
        <input 
            className="profile input"
            type={props.type}
            placeholder="enter the username you want to change.."
            value={props.value}
            onChange={e => props.onChange(e.target.value)} 
            />
    </div>
);
};

NameChangeField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
  };


const EditProfile= () =>{

  //get the local username and id
  const history = useHistory();
  const userid = localStorage.getItem('id');
  const userUsername = localStorage.getItem('username');

  //set new const
  const [id,] = useState(userid);
  const [username, setusername] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [birthday, setBirthday] = useState(null);
  const [registerDate,] = useState(null);
  const [status,] = useState(null);
  const [, setUsers] = useState(null);

  //add the icon
  useEffect(() => {
      axios.get('https://source.unsplash.com/random')
      .then((response) => setImageUrl(response.request.responseURL))
      .catch((error) => console.log(error));
  }, []);

  const doEditProfile = async () => {
    try {
        const requestBody = JSON.stringify({  id: id,
        username: username,
        birthday: birthday,
        registerDate: registerDate,
        status: status
      });
        await api.put('/users/'+id, requestBody);
     
        history.push(`/user/${id}`);
    } catch (error) {
        alert(`Something went wrong during the profile edit: \n${handleError(error)}`);
    }
  };

 
return(
  <BaseContainer>
    <div className="profile container">

      <div className="profile avatar">
          {imageUrl && <img src={imageUrl} alt="profile img"  className="profile img"/>}
      </div>
   
      <div className="profile name"> UserID:  {id}</div>

      <div className="profile form">
        <div className="profile container">
          <NameChangeField  
            type="date"
            value={birthday}
            onChange={un => setBirthday(un)}
          />
          <div className="profile username"> Current Username:  {userUsername}</div>
          <NameChangeField
              value={username}
              onChange={un => setusername(un)}
          />           
        </div>
      </div>

      <div className="login button-container">
            <Button
              width="100%"
              onClick={() =>doEditProfile()}>Save
            </Button>
      </div>

      <div className="login button-container">
          <Button
                    width="100%"
                    onClick={() => history.push(`/user/${id}`)}>Goback
          </Button>
      </div>
    </div>
  </BaseContainer>
  
);

};

export default EditProfile;

