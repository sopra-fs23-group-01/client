import '@fortawesome/fontawesome-free/css/all.css';
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
  let icon = <i className="fa-solid fa-venus-mars" style={{ margin: '10px' }}></i>;


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
          if (users.gender === 'male') {
              icon = <i className="fa-solid fa-mars" style={{ margin: '10px' }}></i>;
          } else if (users.gender === 'female') {
              icon = <i className="fa-solid fa-venus" style={{ margin: '10px' }}></i>;
          }

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

    // const [synonyms, setSynonyms] = useState([]);
  
    // const getSynonyms = async () => {
    //   try {
    //     const response = await axios.get('https://api.datamuse.com/words', {
    //       params: {
    //         rel_syn: 'good'
    //       }
    //     });
    //     setSynonyms(response.data.map(word => word.word));
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
    
    
  
    return (
      <div className="profile container">
          <div className="profile username"> {functionuser.username}</div>
          <div className="profile email">Email{functionuser.email}</div>
          <div className="profile status">
              <span style={statusStyle}>   {functionuser.status}</span>
          </div>
          <div className="profile winningRate">Winning rate:
              <i className="fa-solid fa-person-military-rifle" style={{ margin: '10px' }}></i>80%    {functionuser.rateDe}
              <i className="fa-solid fa-user-ninja" style={{ marginLeft: '40px' ,marginRight: '10px' }}></i>70%{functionuser.rateUn}
          </div>
          <div className="profile name">Gender:  {icon}{functionuser.gender}</div>
        <div className="profile name">Creation date: <i className="fa-solid fa-calendar-days" style={{ margin: '10px' }}></i>{functionuser.registerDate}</div>
        <div className="profile name">Birthday: <i className="fa-solid fa-calendar-days" style={{ margin: '10px' }}></i>{functionuser.birthday}</div>
          <div className="profile name">Introduction:    {functionuser.birthday}</div>
          <div className="profile introduction">Get ready to be amazed by my skills of observation and deduction.    {functionuser.introduction}</div>
        <div className="profile comment"> Want to change your intro? Go to edit!</div>
        <div>
            {showEditButton && (
                <div className="profile settings-button" onClick={() => history.push('/editprofile')}></div>)
            }
        </div>
        <div>
      {/*<button className="button" onClick={() => history.push('/chat')}>Chat</button>*/}
    </div>

      </div>
    );
  }


  Profilefield.propTypes = {
     functionuser: PropTypes.object
  };

  content =(

    <div className="profile container">
        <div className="return-button" onClick={() => history.push('/game')}></div>
      <div className="profile head">Profile</div>

      <div className="profile avatar">
        {imageUrl && <img src={imageUrl} alt="profile img"  className="profile img"/>}
      </div>


      <div className="profile form">
        <Profilefield functionuser={users} localid={localid} />            
      </div>

    </div>)
  

  return (
    <BaseContainer>

        {content}

    </BaseContainer>
  );

};

export default ProfilePage;
