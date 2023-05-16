import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";
import NavigationBar from "./NavigationBar";
import Room from "../../models/Room";
import {toast} from "react-toastify";
import SockJS from 'sockjs-client';
import { over } from 'stompjs';

var stompClient = null;
const Lobby = () => {

    // use react-router-dom's hook to access the history
    const history = useHistory();

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    //const [users, setUsers] = useState(null);
    const [rooms, setRooms] = useState(null);

    const connect = () => {
        //let Sock = new SockJS('http://localhost:8080/ws');
        let Sock = new SockJS('https://sopra-fs23-group-01-server.oa.r.appspot.com/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }
    const onConnected = () => {
        updateRoom();
        stompClient.subscribe('/room', onMessageReceived);
    }

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "ROOM_UPDATE":
                updateRoom();       
                break;
        }
    }

    const onError = (err) => {
        console.log(err);

    }

    async function enterRoom(roomId, id) {
        try {
            const requestBody = JSON.stringify({id});
            await api.put('/room/'+roomId+'/players', requestBody);
            //alert('Entered room successfully: '+roomId+'userId: '+id);
            //history.push(`/leaderboard`);
        } catch (error) {
            console.error(`Something went wrong during the enterRoom: \n${handleError(error)}`);
            alert(`Something went wrong during the enterRoom: \n${handleError(error)}`);
        }
    }
    async function quickStart() {
        try {
            const id = localStorage.getItem('id');
            const requestBody = JSON.stringify({id});
            const response = await api.post('/room/quickStart', requestBody);
            const room = new Room(response.data);
            window.location.href = `/room=${room.roomId}`;
            //alert('Entered room successfully: '+roomId+'userId: '+id);
            //history.push(`/leaderboard`);
        } catch (error) {
            console.error(`Something went wrong during the quickStart: \n${handleError(error)}`);
            alert(`Something went wrong during the quickStart: \n${handleError(error)}`);
        }
    }

    const createRoom = async () => {
        window.location.href = `/roomCreation`;
    };



    // useEffect(() => {
    //     // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    //     async function fetchData() {
    //             //get rooms the url is set in Specification
    //             const response = await api.get('/games');

    //             await new Promise(resolve => setTimeout(resolve, 1000));

    //             // Get the returned  and update the state.
    //             setRooms(response.data);
    //     }
    //     fetchData();
    // }, [history]);

    const updateRoom = async () => {
        try {

            //get all players in the room
            const response = await api.get('/games');
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Get the returned users and update the state.
            setRooms(response.data);

        } catch (error) {
            console.error(`Something went wrong while fetching the rooms: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching the rooms! See the console for details.");
        }
    };

    useEffect(() => {
        connect();
        return () => {
            stompClient.disconnect();
        };
    }, []);

    let content = null;


    if (rooms) {

        function Room({ room }) {
            const propertyStyle = {
                color: room.roomProperty === "WAITING" ? "green" : "red"
            };

            const tryStyle = {
                color: room.roomPlayers.length !== 0 ? "green" : "yellow"
            };

            return (
                //<a href={`/room=${room.roomId}`} style={{ textDecoration: 'none' }} disabled={room.roomProperty ==="INGAME"} onClick={() => enterRoom(room.roomId, localStorage.getItem('id'))}>
                //  <a
                //     href={`/room=${room.roomId}`}
                //     style={{ textDecoration: 'none', color: room.roomProperty === "INGAME" ? 'gray' : 'black', pointerEvents: room.roomProperty === "INGAME" ? 'none' : 'auto' }}
                //     onClick={(e) => {
                //         e.preventDefault(); // 禁止默认的点击事件
                //         if (room.roomProperty === "INGAME"||room.roomPlayersList.length === room.maxPlayersNum) {
                //             // 如果房间正在进行游戏，则不执行进入房间操作
                //             return;
                //         }
                //         else enterRoom(room.roomId, localStorage.getItem('id'));
                //     }}
                // >
                <a
                    href={`/room=${room.roomId}`}
                    style={{
                        textDecoration: 'none',
                        color: room.roomProperty === "INGAME" ? 'gray' : 'black',
                        pointerEvents: room.roomProperty === "INGAME" || room.roomPlayersList.length === room.maxPlayersNum ? 'none' : 'auto'
                    }}
                    onClick={(e) => {
                        e.preventDefault(); // 禁止默认的点击事件
                        if (room.roomProperty === "INGAME" || room.roomPlayersList.length === room.maxPlayersNum) {
                            // 如果房间正在进行游戏，则不执行进入房间操作
                            return;
                        }
                        enterRoom(room.roomId, localStorage.getItem('id'))
                            .then(() => {
                                history.push(`/room=${room.roomId}`);
                            })
                            .catch(error => {
                                console.error(`Something went wrong during the enterRoom: \n${handleError(error)}`);
                                alert(`Something went wrong during the enterRoom: \n${handleError(error)}`);
                            });
                    }}
                >

                <div className="lobby player container" style={{ backgroundColor: 'yellowgreen' }}>
                        <div className="lobby player room">Room {room.roomId}</div>
                        <div className="lobby player theme"><span style={tryStyle}> {room.theme}</span></div>
                        <span style={propertyStyle}>{room.roomProperty}   {room.roomPlayersList.length}/{room.maxPlayersNum} </span>
                    </div>
                </a>
            );
        }


        Room.propTypes = {
            room: PropTypes.object
        };


        content = (

                <ul className="lobby list">
                    {rooms.map(room => (
                        <Room room={room} key={room.roomId}/>
                    ))}
                </ul>
            
        );
    }

    return (
        <BaseContainer>
            <div className="lobby lobbyText">Game Lobby</div>
            <div className="lobby availableText">Available Room</div>
            <div className="lobby content">{content}</div>
            <Button className="lobby quickStartButton" onClick={() => quickStart()}>Quick Start</Button>
            <Button className="lobby createButton" onClick={() => createRoom()}>Create New Room</Button>
            <NavigationBar/>
        </BaseContainer>
    );
}

export default Lobby;
