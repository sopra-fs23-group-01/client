
import 'styles/views/Profile.scss';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {api, handleError} from 'helpers/api';
import {Button} from "../ui/Button";
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {Spinner} from 'components/ui/Spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
//axios的第三方库来发起HTTP请求，并在响应中获取图像URL。axios是一个流行的JavaScript库，用于在浏览器和Node.js中发起HTTP请求

const NameChangeField= props =>{
    
return(
    <div className="profile username">
        <input 
            className="profile input"
            type="text" 
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

const Profile= () =>{
  // 随机生成头像
  
  const history = useHistory();
  //本地读取id号
  const userid = localStorage.getItem('id');
  const [id, setUserId] = useState(userid);

  //本地读取username
  const userUsername = localStorage.getItem('username');

  const [imageUrl, setImageUrl] = useState(null);
  const [birthday, setBirthday] = useState(null);

  //不清楚为什么设置称true就可以但是null就不行
  const [users, setUsers] = useState(true);

  const handleDateChange = (date) => {
    setBirthday(date);
  };


  //渲染头像函数
  useEffect(() => {
    
    axios.get('https://source.unsplash.com/random')
      .then((response) => setImageUrl(response.request.responseURL))
      .catch((error) => console.log(error));
  }, []);

  const [username, setusername] = useState(null);
  useEffect(() => {
    
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const requestBody = { id: id };
        const response = await api.post('/users/profile', requestBody);
        console.log(response);
        setUsers(response.data);
        // localStorage.setItem('username',users.username)
        // alert({users});
      } catch (error) {
        alert(`Something went wrong during the login: \n${handleError(error)}`);
        
      }
    }

    fetchData();
  }, []);

  let content = <Spinner/>;

  function Profilefield({functionuser}) {
    const statusStyle = {
      color: functionuser.status === "ONLINE" ? "green" : "red"
    };
      
    return ( 
        <div>    
        <div className="profile username"> UserID:  {id}</div>
        
        {/* <NameChangeField
            value={username}
            onChange={un => setusername(un)}
            /> */}
        <div className="profile name">Creation date:  {functionuser.registerDate}</div>

        <div>
        <div className="profile username">
            Birthday: 
        
            <DatePicker 
            selected={birthday} 
            onChange={handleDateChange} />
                {birthday && (
                <p>
                Your Selected Birthday is{' '}
                    {`${birthday.getFullYear()}-${
                        birthday.getMonth()+1
                        }-${birthday.getDate()}`}
                </p>     
                 )}
        </div>
        </div>
        <div className="profile name">
            Online status:
          <span style={statusStyle}>   {functionuser.status}</span>
        </div>
        <div className="profile username"> Current Username:  {userUsername}</div>
      </div>
      
    );
  }



  Profilefield.propTypes = {
     functionuser: PropTypes.object
  };
 

  const doEditProfile = async () => {
    try {
        const date = new Date(birthday);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

      const requestBody = JSON.stringify({  id: id,
        username: username,
        birthday: formattedDate});
        const response = await api.post('/users/editprofile', requestBody);
     
      // Get the returned user and update a new object.
      const user = new User(response.data);
      
      
      localStorage.setItem('username', user.username);

      // Id怎么都不会变//Regist successfully worked --> navigate to the route /Login in the GameRouter
      history.push(`/profile/${id}`);
    } catch (error) {
      alert(`Something went wrong during the profile edit: \n${handleError(error)}`);
    }
  };

 
  content =(
    <div className="profile container">

    <div className="profile avatar">
        {imageUrl && <img src={imageUrl} alt="profile img"  className="profile img"/>}
    </div>


    <div className="profile form">
    <div className="profile container">
    <Profilefield 
    functionuser={users}
    
    />
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
              onClick={() => history.push(`/profile/${id}`)}>Goback
    </Button>
    </div>
    </div>)
  

  return (
    <BaseContainer>

        {content}

    </BaseContainer>
  );
};

export default Profile;

