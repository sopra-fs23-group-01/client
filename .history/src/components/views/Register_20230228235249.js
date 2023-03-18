import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {Link, useHistory, withRouter } from 'react-router-dom';
import {Button} from "../ui/Button";
import 'styles/views/Register.scss';
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
        placeholder="enter here.."
        value={props.value}
        onChange={e => props.onChange(e.target.value)  }
    
      />
      
      <div className="register button-container1">
       <Button width="25%" onClick={toggleShowPassword }>{showPassword ? 'Hide' : 'Show' } 
       </Button>
      </div>
    </div>
  );
};

//用于验证输入是否为规定数据类型
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

const Register = props => {
  const history = useHistory();

  
  //hook语法，意思是定义了一个名为password的状态变量，并且初始值为null。同时，还定义了一个名为setPassword的函数，它可以用于更新password的值
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(true)

  const handleChange = (event) => {
    const value = event.target.value;
    if (value.trim() !== "" && value.indexOf(" ") === -1) { // 检查输入中是否包含空格且是否为空
      setPassword(value);
    }
  };

  const doregister = async () => {
    try {
      const requestBody = JSON.stringify({username, password});
      const response = await api.post('/users', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);
      localStorage.setItem('id', user.id);
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
        <div className="register form">
          <FormField
            label="Username"
            value={username}
            onChange={un => setUsername(un)}
          />
          
          <div classname="register password">
          <PasswordField
            label="Password"
            value={password}
            onChange={n => setPassword(n)}
          />
          
          </div>

          <div classname="register password">
          <PasswordField
            label="Confirm Password"
            value={confirmPassword}
            onChange={n => setConfirmPassword(n)}
          />
          </div>

          <div className="register button-container">
            <Button
              disabled={!username || !password || !confirmPassword || username.trim() =="" || password.trim() =="" || username.indexOf(" ") !== -1}
              width="75%"
              onClick={() => doregister()}
            >
              Register
            </Button>
          </div>

          <div className="register button-container">
              Already have an account?
            <Link to={`/login`}>Login</Link>
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
