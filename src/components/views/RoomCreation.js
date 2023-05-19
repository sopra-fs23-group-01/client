import React, {useState} from 'react';
import {useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory } from 'react-router-dom';
import {Button} from "../ui/Button";
import 'styles/views/RoomCreation.scss';
import BaseContainer from "components/ui/BaseContainer";
import Room from "../../models/Room";
import SockJS from 'sockjs-client';
import { over } from 'stompjs';

var stompClient = null;

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

//这里创建一个可加减的数字


const RoomCreation = props => {

    const history = useHistory();
    const [maxPlayersNum, setMaxPlayersNum] = useState(4);
    const [theme, setTheme] = useState('SPORTS');
    const [room, setRoom] = useState(null);
    //const [roomProperty, setRoomProperty] = useState("PUBLIC");
    const [roomOwnerId, setRoomOwnerId] = useState(null);
    const [roomPlayersList, setroomPlayersList] = useState([]);
    //"roomPlayersList": ["id1", "id2", "id3"]

    // function handleCheckBox(){
    //     setRoomProperty("PRIVATE");
    // }

    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/ws');
        //let Sock = new SockJS('https://sopra-fs23-group-01-server.oa.r.appspot.com/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }
    const onConnected = () => {
        stompClient.subscribe('/room', onMessageReceived);

    }

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "ROOM_UPDATE":  
                break;
        }
    }

    const onError = (err) => {
        console.log(err);

    }

    const sendUpdateReminder = () => {
        if (stompClient) {
            var creatMessage = {
                status: "ROOM_UPDATE"
            };

            console.log(creatMessage);
            stompClient.send("/app/roomcreat", {}, JSON.stringify(creatMessage));
        }
    }

    const Counter = () => {

        const increment = () => {
            setMaxPlayersNum(maxPlayersNum + 1);
        };

        const decrement = () => {
            setMaxPlayersNum(maxPlayersNum - 1);
        };

        return (
            <div className="counter">
                <div className="counter-buttons">
                    <button onClick={decrement} disabled={maxPlayersNum<=4}>-</button>
                    <span className="number">{maxPlayersNum}</span>
                    <button onClick={increment} disabled={maxPlayersNum>=8}>+</button>
                </div>
            </div>
        );
    };
    // const history = useHistory();
    // const [password, setPassword] = useState(null);
    // const [username, setUsername] = useState(null);

    const createRoom = async () => {
        try {
            const roomOwnerId = localStorage.getItem('id');
            //const roomPlayersList = [localStorage.getItem('id')];
            //alert(roomOwnerId);
            const requestBody = JSON.stringify({theme, maxPlayersNum, roomOwnerId});
            const response = await api.post('/games/room', requestBody);

            // Get the returned room and update a new object.
            const room = new Room(response.data);

            // Store the token into the local storage.
            //localStorage.setItem('token', user.token);
            localStorage.setItem('roomId', room.roomId);
            localStorage.setItem('roomOwnerId', room.roomOwnerId);
            sendUpdateReminder();
            // Create successfully, enter the room page
            history.push(`/room=`+room.roomId);
        } catch (error) {
            alert(`Something went wrong during the room creation: \n${handleError(error)}`);
        }
    };

    const doCancel = async () => {
        window.location.href = `/lobby`;
    };

    useEffect(() => {
        connect();
        return () => {
            // stompClient.disconnect();
        };
    }, []);

/*Here is roomCreation page:
  1. Selecting theme
  2. Choose the number of players
  3. Set room to be private or not
  4. Confirm and Cancel buttons
 */
    return (
        <BaseContainer>
            {/*<div className="roomCreation profileText">Profile</div>*/}
            <div className="roomCreation createText">Create your room</div>

            <div className="roomCreation container">
                <div className="roomCreation editText" style={{ textAlign: 'center',marginTop:'40px' }}>Theme for Game </div>


                <div className="roomCreation select-container">
                    <div className="roomCreation select-wrapper">
                        <select value={theme} style={{ textAlign: 'center',width:'180px',height:'35px',marginTop:'20px' }} onChange={e => setTheme(e.target.value)}>
                            <option value="SPORTS">Sports</option>
                            <option value="FURNITURE">Furniture</option>
                            <option value="JOB">Job</option>
                        </select>
                    </div>
                </div>

                <div className="roomCreation editText" style={{ textAlign: 'center',marginTop:'40px' }}>Number of Players</div>
                <Counter style={{fontSize: "20px"}}/>

                <Button className="confirmButton" onClick = {() => createRoom()}>Confirm</Button>
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
