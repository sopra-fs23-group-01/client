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


const Login = props => {
    const history = useHistory();
    const [password, setPassword] = useState(null);
    const [username, setUsername] = useState(null);

  
    return (
      <BaseContainer>
        <div className="login container">
          <div className="login form">
            <FormField
              label="Username"
              value={username}
              onChange={un => setUsername(un)}
            />
            <FormField 
              label="Password(do not contain space)"
              value={password}
              onChange={n => setPassword(n)}
            />
  
            
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