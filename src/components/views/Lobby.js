import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";
import FurniturePic from "../../styles/image/Pics4Theme/FurnitureTheme.png";
import JobPic from "../../styles/image/Pics4Theme/JobTheme.png";
import SportsPic from "../../styles/image/Pics4Theme/SportsTheme.png";
import SuperheroPic from "../../styles/image/Pics4Theme/SuperheroTheme.png";
import NavigationBar from "./NavigationBar";
import Room from "../../models/Room";
import {toast, ToastContainer} from "react-toastify";
import SockJS from 'sockjs-client';
import {over} from 'stompjs';

var stompClient = null;
const Lobby = () => {

    // use react-router-dom's hook to access the history
    const history = useHistory();
    const [rooms, setRooms] = useState(null);

    const connect = () => {
        //let Sock = new SockJS('http://localhost:8080/ws');
        let Sock = new SockJS('https://sopra-fs23-group-01-server.oa.r.appspot.com/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }
    const onConnected = () => {
        updateRoom().catch((error) => {
            // Handle error or rejection
            console.error('An error occurred:', error);
        });
        stompClient.subscribe('/room', onMessageReceived);
    }

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "ROOM_UPDATE":
                updateRoom().catch((error) => {
                    // Handle error or rejection
                    console.error('An error occurred:', error);
                });
                break;
        }
    }

    const onError = (err) => {
        console.log(err);

    }

    async function enterRoom(roomId, id) {
        try {
            const requestBody = JSON.stringify({id});
            await api.put('/room/' + roomId + '/players', requestBody);
        } catch (error) {
            console.error(`Something went wrong during the enterRoom: \n${handleError(error)}`);
            toast.error(`Something went wrong during the enterRoom: \n${handleError(error)}`);
        }
    }

    async function quickStart() {
        try {
            const id = localStorage.getItem('id');
            const requestBody = JSON.stringify({id});
            const response = await api.post('/room/quickStart', requestBody);
            const room = new Room(response.data);
            window.location.href = `/room=${room.roomId}`;
        } catch (error) {
            console.error(`Something went wrong during the quickStart: \n${handleError(error)}`);
            toast.error(`Something went wrong during the quickStart: \n${handleError(error)}`);
        }
    }

    const createRoom = async () => {
        window.location.href = `/roomCreation`;
    };

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

    function getRoomPic(theme) {
        switch (theme) {
            case 'SPORTS':
                return `url(${SportsPic})`;
            case 'JOB':
                return `url(${JobPic})`;
            case 'FURNITURE':
                return `url(${FurniturePic})`;
            case 'SUPERHERO':
                return `url(${SuperheroPic})`;
            default:
                return 'none';
        }
    }

    if (rooms) {

        function Room({room}) {
            const propertyStyle = {
                color: room.roomProperty === "WAITING" ? "darkgreen" : "darkred",
                fontFamily: "Poppins",
                fontStyle: "normal"
            };


            const tryStyle = {
                color: room.roomPlayers.length !== 0 ? "green" : "yellow"
            };


            return (
                <a
                    href={`/room=${room.roomId}`}
                    style={{
                        textDecoration: 'none',
                        color: room.roomProperty === "INGAME" ? 'gray' : 'black',
                    }}
                    onClick={(e) => {
                        e.preventDefault(); 
                        const currentId = localStorage.getItem('id');
                        const isPlayerInRoom = room.roomPlayersList.join().includes(currentId);
                        if (room.roomProperty === "INGAME" && !isPlayerInRoom || (room.roomPlayersList.length === room.maxPlayersNum && !isPlayerInRoom)) {
                            return;
                        }
                        enterRoom(room.roomId, currentId)
                            .then(() => {
                                history.push(`/room=${room.roomId}`);
                            })
                            .catch(error => {
                                console.error(`Something went wrong during the enterRoom: \n${handleError(error)}`);
                                alert(`Something went wrong during the enterRoom: \n${handleError(error)}`);
                            });
                    }}
                >

                    <div className="lobby player container" style={{backgroundColor: "#FFE5F3", backgroundImage: getRoomPic(room.theme)}}>
                        <div className="lobby player room">Room {room.roomId}</div>
                        <div className="lobby player theme">{room.theme}</div>
                        <div className="lobby player statusForRoom" style={{ color: room.roomProperty === "WAITING" ? "green" : "red" }}>
                            {room.roomProperty} {room.roomPlayersList.length}/{room.maxPlayersNum}
                        </div>
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
            <ToastContainer/>
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
