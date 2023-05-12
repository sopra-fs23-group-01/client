import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {Link, useHistory, } from 'react-router-dom';
import {Button} from "../ui/Button";
import 'styles/views/Register.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import LoginPic from "../../styles/image/Pics4login/LoginPic.png";
import NameIcon from "../../styles/image/Icons/NameIcon.png";
import PasswordIcon from "../../styles/image/Icons/PasscodeIcon.png";
import NotShowIcon from "../../styles/image/Icons/NotShowIcon.png";
import NavigationBar from "./NavigationBar";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = props => {
  return (
    <div className="register field">
      <label className="register label">
        {props.label}
      </label>
      <input
        className="register input"
        placeholder="enter here.."
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};

const PasswordField = props => {
  const [showPassword, setShowPassword] = useState(false);
 
   //use the funtion to control the show of the password
  function toggleShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
        <div className="register field">
          <label className="register label">
            {props.label}
          </label>

          <input type = {showPassword ? 'text' : 'password'}
            className="register input"
            placeholder="enter here..."
            value={props.value}
            onChange={e => props.onChange(e.target.value)  }

          />
          <img className="register nameicon" src={NameIcon} alt="Username" />
          <img className="register passwordicon" src={PasswordIcon} alt="Password" />
          <img className="register showicon" src={NotShowIcon} alt="LoginIllustration" />
          <div className="register showtext" onClick={toggleShowPassword }>{showPassword ? 'Hide' : 'Show' }</div>
        </div>
  );
};

//to virify the input
FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

PasswordField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

//The function to do the register
const Register = props => {
  const history = useHistory();

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);


  const doregister = async () => {
    
    try {
      // localStorage.clear;
      const requestBody = JSON.stringify({username, password});
      const response = await api.post('/users', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('username', user.username);
      localStorage.setItem('token', user.token);
      localStorage.setItem('id', user.id);
      console.log(user.token)
      console.log(user.id)

      // Regist successfully worked --> navigate to the route /Login in the GameRouter
      history.push(`/Login`);
    } catch (error) {
      alert(`Something went wrong during the register: \n${handleError(error)}`);
    }
  };

  return (
    <BaseContainer>
      <div className="register container">
        <img className="register pic" src={LoginPic} alt="LoginIllustration" />
        <div className="register welcomeline1">Get Started Free</div>
        <div className="register welcomeline2">Start your journy today for free forever!</div>
        <div className="register form">
          <FormField
            label="Username (Do not contain spcace):"
            value={username}
            onChange={un => setUsername(un)}
          />
          
          <div classname="register password">
          <PasswordField
            label="Password (Do not contain spcace):"
            value={password}
            onChange={n => setPassword(n)}
          />
          
          </div>
          <div className="register button-container">
            <Button
              disabled={!username || !password ||password.indexOf(" ") !== -1|| username.indexOf(" ") !== -1}
              width="100%"
              color="white"
              onClick={() => doregister()}
            >
              Register
            </Button>
          </div>

          <div className="register tosignin">
              -Already have an account?
            <Link to={`/login`}> Signin</Link>-
          </div>

          
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Register;
