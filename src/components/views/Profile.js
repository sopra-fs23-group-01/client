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
import {toast, ToastContainer} from "react-toastify";
//use axios to generate the pictures


const ProfilePage=() =>{
  const history = useHistory();
  const {id} = useParams();
  const localid_str=localStorage.getItem('id');
  const localid = parseInt(localid_str, 10);
  const [imageUrl, setImageUrl] = useState(null);
  const [users, setUsers] = useState(true);
  let icon = <i className="fa-solid fa-venus-mars" style={{ margin: '10px' }}></i>;

  const logout = async () => {
    const id = localStorage.getItem('id');
    localStorage.removeItem('token');
    try {
      const requestBody = JSON.stringify({id:id});
      const response = await api.post('/users/logout', requestBody);
      console.log(response);
        toast.success("Logout successful!", { autoClose: false });
        // Wait for Toast component to disappear before navigating to leaderboard
        await new Promise(resolve => setTimeout(resolve, 1000));


    } catch (error) {
        toast.error(`Server has been refreshed!`);
        // Wait for Toast component to disappear before navigating to leaderboard
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    history.push('/login');
  };
  //   //The icon
  // useEffect(() => {
  //   axios.get('https://robohash.org/1')
  //     .then((response) => setImageUrl(response.request.responseURL))
  //     .catch((error) => console.log(error));
  // }, []);

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get('/users/' + id);
        console.log(response);
        setUsers(response.data);
          console.log('Judge');
          localStorage.setItem('icon', icon);


      } catch (error) {
        toast.warning(`Something went wrong during the profile page: \n${handleError(error)}`);
        localStorage.removeItem('token');
        history.push('/login');
        
      }
    }

    fetchData().catch((error) => {
        // Handle error or rejection
        console.error('An error occurred:', error);
    });
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

    
    
  
    return (
      <div className="profile container">
          <div className="profile username"> {functionuser.username}</div>
          <div className="profile email">{functionuser.email}</div>
          <div className="profile status">
              <span style={statusStyle}>   {functionuser.status}</span>
          </div>
          <div className="profile winningRate">Winning rate:
              <i className="fa-solid fa-person-military-rifle" style={{ margin: '10px' }}></i> {(Math.round(functionuser.rateDe * 100))}%
              <i className="fa-solid fa-user-ninja" style={{ marginLeft: '40px', marginRight: '10px' }}></i>{(Math.round(functionuser.rateUn * 100))}%
          </div>
          <div className="profile name">Gender:  {functionuser.gender ?
              (functionuser.gender === 'MALE' ?
                  <i className="fa-solid fa-mars" style={{ margin: '10px' }}></i>
                  : <i className="fa-solid fa-venus" style={{ margin: '10px' }}></i>)
              : <i className="fa-solid fa-venus-mars" style={{ margin: '10px' }}></i>}{functionuser.gender}
          </div>
        <div className="profile name">Creation date: <i className="fa-solid fa-calendar-days" style={{ margin: '10px' }}></i>{functionuser.registerDate}</div>
        <div className="profile name">Birthday: <i className="fa-solid fa-calendar-days" style={{ margin: '10px' }}></i>{functionuser.birthday}</div>
          <div className="profile name">Introduction:    {functionuser.birthday}</div>
          <div className="profile introduction">{functionuser.intro}</div>


        <div>
            {showEditButton && (
                <div className="profile settings-button" onClick={() => history.push('/editprofile')}></div>
                )
            }
        </div>
        <div>
            {showEditButton && (
                <div className="profile comment"> Want to change your intro? Go to edit!</div>
                )
            }
                    
        </div>

            {showEditButton && (
                        <Button
                        width="100%"
                        onClick={() => logout()}
                      >
                        Logout
                      </Button>
                )
            }


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
        <div className="return-button" onClick={() => history.push('/leaderboard')}></div>
      <div className="profile head">Profile</div>

        <div className="profile avatar">
            <img src={users.avatarUrl} alt="profile img" className="profile img"/>
        </div>


      <div className="profile form">
        <Profilefield functionuser={users} localid={localid} />            
      </div>

    </div>)
  

  return (
    <BaseContainer>
      <ToastContainer/>
        {content}

    </BaseContainer>
  );

};

export default ProfilePage;
