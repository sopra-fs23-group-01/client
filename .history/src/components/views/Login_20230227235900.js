import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {Link, useHistory, withRouter } from 'react-router-dom';
import {Button} from "../ui/Button";
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

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
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};

//定义一个填写密码的区域
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
        placeholder="enter here.."
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
            <div className="login button-container1">
       <Button width="25%" onClick={toggleShowPassword }>{showPassword ? 'Hide' : 'Show' } 
       </Button>
      </div>
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
      const requestBody = JSON.stringify({username, password});//将username和name的请求值转换为string模式
      const response = await api.post('/users/login', requestBody);//请求server端users中的username和password
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
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="Username"
            value={username}
            onChange={un => setUsername(un)}
          />
          <PasswordField
            label="Password"
            value={password}
            onChange={n => setPassword(n)}
          />

          <div className="login button-container">
            <Button
              disabled={!username || !password || username.trim() ==" " || password.trim() ==" "}
              width="100%"
              onClick={() => doLogin()}
            >
              login
            </Button>
          </div>

          <div className="login button-container">
              Don't have an account?
            <Link to={`/register`}>Sign up</Link>
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
export default Login;
