import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {Link, useHistory } from 'react-router-dom';
import {Button} from "../ui/Button";
import NavigationBar from "./NavigationBar";
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import LoginPic from 'styles/image/Pics4login/LoginPic.png';
import NotShowIcon from "../../styles/image/Icons/NotShowIcon.png";
import NameIcon from "../../styles/image/Icons/NameIcon.png";
import PasswordIcon from "../../styles/image/Icons/PasscodeIcon.png";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = props => {
  return (
    <div className="login field">
      <label className="login label">
        {props.label}
      </label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={e => +props.onChange(e.target.value)}
      />
    </div>
  );
};

//Difine an area to input the password
const PasswordField = props => {
  const [showPassword, setShowPassword] = useState(false);
  function toggleShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
    <div className="login field">
      <label className="login label">
        {props.label}
      </label>

      <input type={showPassword ? 'text' : 'password'} 
        className="login input"
        placeholder="enter here..."
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
        <img className="login nameicon" src={NameIcon} alt="Username" />
        <img className="login passwordicon" src={PasswordIcon} alt="Password" />
        <img className="login showicon" src={NotShowIcon} alt="LoginIllustration" />
        <div className="login showtext" onClick={toggleShowPassword }>{showPassword ? 'Hide' : 'Show' }</div>
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

const Login = props => {
  const history = useHistory();
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({username, password});
      const response = await api.post('/users/login', requestBody);
      console.log(response);
      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);
      localStorage.setItem('id',user.id);
      localStorage.setItem('username',user.username);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/game`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  return (
      <div className="login container">
          <img className="login pic" src={LoginPic} alt="LoginIllustration" />
          <div className="login welcomeline1">Welcome Back!</div>
          <div className="login welcomeline2">Detective, we miss u!</div>
            <div className="login form">
              <FormField
                label="Username"
                value={username}
                onChange={un => setUsername(un)}
              />
              <PasswordField
                label="Password (Do not contain spcace):"
                value={password}
                onChange={n => setPassword(n)}

              />
              <div className="login forget">Forgot Password?</div>
              <div className="login button-container">
                <Button
                  disabled={!username || !password || username.trim() ===" " || password.trim() ===" "}
                  width="100%"
                  onClick={() => doLogin()}
                >
                  login
                </Button>
              </div>
              <div className="login tosignup">
                  -Don't have an account?
                <Link to={`/register`}>Sign up</Link>
                  -
              </div>
            </div>
      </div>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
