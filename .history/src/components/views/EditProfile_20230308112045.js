
import 'styles/views/Profile.scss';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from "../ui/Button";
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
  const [id,] = useState(userid);

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
        const response = await api.get('/users/' + id, requestBody);
        console.log(response);
        setUsers(response.data);
        // localStorage.setItem('username',users.username)
        // alert({users});
      } catch (error) {
        alert(`Something went wrong during the login: \n${handleError(error)}`);
        
      }
    }

    fetchData();
  }, [id]);

  let content = <Spinner/>;

  function Profilefield({profileuser}) {
    return ( 
        <div>    
        <div className="profile name"> UserID:  {id}</div>
        
        {/* <NameChangeField
            value={username}
            onChange={un => setusername(un)}
            /> */}
        <div>
        <div className="profile username">
            Birthday: 
        
            <NameChangeField
            type="date"
            value={birthday}          
            onChange={handleDateChange} />
        </div>
        </div>
        <div className="profile username"> Current Username:  {userUsername}</div>
      </div>
      
    );
  }



  Profilefield.propTypes = {
     functionuser: PropTypes.object
  };

  const formatDate = (dateString) => {
    if(dateString!==null){
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${day}-${month}-${year}`;}
    else{
      return dateString;
    }
  }
  const [registerDate,] = useState(null);
  const [status,] = useState(null);

  const doEditProfile = async () => {
    try {
    
      const requestBody = JSON.stringify({  id: id,
        username: username,
        birthday: formatDate(birthday),
        registerDate: registerDate,
        status: status
      });
      await api.put('/users/'+id, requestBody);
     
      // Get the returned user and update a new object.
      
      
      //localStorage.setItem('username', user.username);

      // Id怎么都不会变//Regist successfully worked --> navigate to the route /Login in the GameRouter
      history.push(`/user/${id}`);
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
              onClick={() => history.push(`/user/${id}`)}>Goback
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

