
import 'styles/views/Profile.scss';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {api, handleError} from 'helpers/api';
import {Button} from "../ui/Button";
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {Spinner} from 'components/ui/Spinner';
//use axios to generate the pictures


const ProfilePage=() =>{
  const history = useHistory();
  const {id} = useParams();
  const localid_str=localStorage.getItem('id');
  const localid = parseInt(localid_str, 10);
  const [imageUrl, setImageUrl] = useState(null);
  const [users, setUsers] = useState(true);
  
  //The icon
  useEffect(() => {
    axios.get('https://source.unsplash.com/random')
      .then((response) => setImageUrl(response.request.responseURL))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get('/users/' + id);
        console.log(response);
        setUsers(response.data);
      } catch (error) {
        alert(`Something went wrong during the profile page: \n${handleError(error)}`);
        
      }
    }

    fetchData();
  }, [id]);

  let content = <Spinner/>;


  function Profilefield({functionuser}) {
    const [showEditButton, setShowEditButton] = useState(false);

    useEffect(() => {
        if (functionuser.id === localid) {
          setShowEditButton(true);
        }
      }, [functionuser.id]);

    const statusStyle = {
      color: functionuser.status === "ONLINE" ? "green" : "red"
    };
  
    return (
      <div className="profile container">
        <div className="profile name">User ID:  {functionuser.id}</div>
        <div className="profile username"> Username:  {functionuser.username}</div>
        <div className="profile name">Creation date:  {functionuser.registerDate}</div>
        <div className="profile name">Birthday:    {functionuser.birthday}
                        </div>
        <div className="profile name">
            Online status:
          <span style={statusStyle}>   {functionuser.status}</span>
        </div>

        <div className="login button-container">
            {showEditButton && (
            <Button
              width="100%"
              onClick={() => history.push('/editprofile')}>Edit
            </Button>)}
        </div>

      </div>  
    );
  }


  Profilefield.propTypes = {
     functionuser: PropTypes.object
  };

  content =(

    <div className="profile container">

      <div className="profile avatar">
        {imageUrl && <img src={imageUrl} alt="profile img"  className="profile img"/>}
      </div>


      <div className="profile form">
        <Profilefield functionuser={users} localid={localid} />            
      </div>

      <div className="login button-container">
        <Button
              width="100%"
              onClick={() => history.push('/game')}>Goback
        </Button>
      </div>
    </div>)
  

  return (
    <BaseContainer>

        {content}

    </BaseContainer>
  );

};

export default ProfilePage;
