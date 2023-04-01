import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {Link, useHistory } from 'react-router-dom';
import {Button} from "../ui/Button";
import 'styles/views/RoomCreation.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import * as url from "url";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

//这里创建一个可加减的数字
const Counter = () => {
    const [count, setCount] = useState(4);

    const increment = () => {
        setCount(count + 1);
    };

    const decrement = () => {
        setCount(count - 1);
    };

    return (
        <div className="counter">
            <div className="counter-buttons">
                <button onClick={decrement} disabled={count<=4}>-</button>
                <span className="number">{count}</span>
                <button onClick={increment} disabled={count>=8}>+</button>
            </div>
        </div>
    );
};

const RoomCreation = props => {
    // const history = useHistory();
    // const [password, setPassword] = useState(null);
    // const [username, setUsername] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState('null');

    const doCancel = async () => {
        window.location.href = `/lobby`;
    };

/*Here is roomCreation page:
  1. Selecting theme
  2. Choose the number of players
  3. Set room to be private or not
  4. Confirm and Cancel buttons
 */
    return (
        <BaseContainer>
            <div className="roomCreation profileText">Profile</div>
            <div className="roomCreation createText">Create your room</div>

            <div className="roomCreation container">
                <div className="roomCreation editText">Theme for Game </div>


                <div className="roomCreation select-container">
                    <div className="roomCreation select-wrapper">
                        <select value={selectedTheme} onChange={e => setSelectedTheme(e.target.value)}>
                            <option value="theme1">Theme 1</option>
                            <option value="theme2">Theme 2</option>
                            <option value="theme3">Theme 3</option>
                        </select>
                    </div>
                </div>

                <div className="roomCreation editText">Number of Players</div>
                <Counter />


                <div className="check">
                    <div className="roomCreation editText">Private Room</div>
                    <span style={{margin: '20px'}}></span>
                    <label className="checkbox">
                        <input type="checkbox" id="myCheckbox" />
                        <span className="checkmark"></span>
                    </label>
                </div>


                <Button className="confirmButton">Confirm</Button>
                <Button className="cancelButton" onClick={() => doCancel()}>Cancel</Button>

            </div>
        </BaseContainer>
    );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default RoomCreation;
