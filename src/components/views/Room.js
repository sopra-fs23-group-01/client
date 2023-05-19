import '@fortawesome/fontawesome-free/css/all.css';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Room.scss";
import ReminderIcon from "../../styles/image/Icons/ReminderIcon.png";
import ConfirmIcon from "../../styles/image/Icons/ConfirmIcon.png";
import ConfirmIconBlue from "../../styles/image/Icons/ConfirmIconBlue.png";
import OutShade from "../../styles/image/Icons/OutedFilter.png";
import VoteShade from "../../styles/image/Icons/VotedFilter.png";
import BackIcon from "../../styles/image/Icons/BackIcon.png";
import {Spinner} from "../ui/Spinner";
import React, { useEffect, useState, useRef } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import trophies from './images/trophies.png';
import {toast, ToastContainer} from "react-toastify";
import Modal from 'react-modal';
import Confetti from 'react-confetti'
import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';


var stompClient = null;
const Room = () => {

    const history = useHistory();
    const [assignedWord, setAssignedWord] = useState('');
    const [role, setRole] = useState('');
    const [room, setRoom] = useState(null);
    const [users, setUsers] = useState(null);
    const path = window.location.pathname.substring(1); // remove
    const roomId = path.split('=')[1];
    const id = localStorage.getItem('id');

    //control button stage
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [showSendIcon, setShowSendIcon] = useState(true);
    const [showBackIcon, setShowBackIcon] = useState(true);
    const [avatarClickedVoted, setAvatarClickedVoted] = useState(false);
    const [winner, setWinner] = useState(null);
    const [showResult, setShowResult] = useState(false);
    //const roomTheme = localStorage.getItem('roomTheme');
    const [buttonStatus, setButtonStatus] = useState("Ready");
    const [votedThisRound, setVotedThisRound] = useState(true);
    const [showStartIcon,setShowStartIcon] = useState(false);
    


    const getReady = async () => {
        try {
            const requestBody = JSON.stringify({id});
            await api.put('/users/room/'+roomId, requestBody);
            //history.push('/voteresult/room='+roomId);

        } catch (error) {
            toast.error(`Something went wrong get ready`);
        }
        var readyMessage = {
            senderName: userData.username,
            status: buttonStatus === "Ready" ? "READY" : "NOT_READY"
        };
        stompClient.send("/app/message/"+roomId, {}, JSON.stringify(readyMessage));
        setButtonStatus(buttonStatus === "Ready" ? "Cancel" : "Ready");
        if (buttonStatus === "Ready") {
            toast.success("You are now ready!", { autoClose: 1000 });
        } else {
            toast.error("You cancelled your readiness.", { autoClose: 1000 });
        }
    };


    const getReconnect = async () => {
        // try {
        //     const requestBody = JSON.stringify({id});
        //     await api.put('/users/room/'+roomId, requestBody);
        //     //history.push('/voteresult/room='+roomId);
        //
        // } catch (error) {
        //     toast.error(`Something went wrong get ready`);
        // }
        var readyMessage = {
            senderName: userData.username,
            status: "RECONNECT"
        };
        stompClient.send("/app/message/"+roomId, {}, JSON.stringify(readyMessage));
    };


    const updateUser = async () => {
        try {

            //get all players in the room
            const response = await api.get('/games/playerList/'+roomId);
            //await new Promise(resolve => setTimeout(resolve, 1000));

            // Get the returned users and update the state.
            setUsers(response.data);

            // This is just some data for you to see what is available.
            // Feel free to remove it.
            console.log('request to:', response.request.responseURL);
            console.log('status code:', response.status);
            console.log('status text:', response.statusText);
            console.log('requested data:', response.data);

            // See here to get more data.
            console.log(response);
        } catch (error) {
            console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching the users! See the console for details.");
            localStorage.removeItem('token');
            history.push('/login')
        }
    };


    const goBack = async () => {
        try {
            const requestBody = JSON.stringify({id});
            await api.put('/users/room/out/'+roomId, requestBody);
            updateRoomOrder();
            history.push(`/lobby`);
        } catch (error) {
            alert(`Something went wrong during the goBack: \n${handleError(error)}`);
            updateRoomOrder();
            history.push(`/lobby`);
        }
    };


    const [seconds, setSeconds] = useState(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (seconds > 0) {
            const intervalId = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);

            return () => clearInterval(intervalId);
        } else {
            setIsVisible(false);
            // setTimeout(() => {
            //     setIsVisible(true);
            // }, 1000); // 5秒后重新显示倒计时组件
        }
    }, [seconds]);

    const gameStart = () => {

        stompClient.send("/app/gamestart/"+roomId, {},JSON.stringify());
        sendUpdateReminder();
    }

    let content = <Spinner/>;

    if (users) {

        function Player({ user }) {
            const statusStyle = {
                color: user.readyStatus === "READY" ? "green": "red",
                content: user.readyStatus === "READY" ? setButtonStatus("Cancel"):setButtonStatus("Ready"),
                fontSize: "120%"
            };
            // alert(user.readyStatus);


            const clickToVote = () =>{
                console.log('id:'+localStorage.getItem('id')+'userid'+user.id)
                if(Number(localStorage.getItem('id')) !== user.id){
                    api.put("room/"+roomId+"/vote/" +localStorage.getItem('id')+"="+user.id);
                    setVotedThisRound(true);
                }
            }

            return (
                <div className="room playercontainer">
                    <img
                        src={user.avatarUrl}
                        onClick={Number(localStorage.getItem('id')) === user.id || votedThisRound === true ? null : clickToVote}
                        alt="profile img"
                        style={{
                            cursor: Number(localStorage.getItem('id')) === user.id || votedThisRound === true ? "default" : "pointer",
                            border: `2px solid ${user.readyStatus === "READY" ? "green" : "red"}`,
                            position: "relative",
                            backgroundColor: user.gameStatus === "OUT" ? "gray" : "transparent"
                        }}
                        className="room avatarimg"
                    />
                    <div className="room playername "><span style={statusStyle}>{user.username}</span> </div>
                </div>
            );
        }


        Player.propTypes = {
            user: PropTypes.object
        };

        content = (
            <div>
                
                <ul className="room user-list">
                    {users.map(user => (
                        <Player user={user} key={user.id}/>
                    ))}
                </ul>
            </div>
        );
    }

    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const synonymsOfWord = ["apple", "pear"]; // 修改为你的同义词列表




    // // 从localStorage获取username并将其设置为userData的初始值。
    const storedUsername = localStorage.getItem('username');
    const [userData, setUserData] = useState({
        username: storedUsername || '',
        receivername: '',
        connected: false,
        message: ''
    });

    //自动连接
    useEffect(() => {
        if (userData.username) {
            getRoom();
        }
    }, [userData.username]);

    const getRoom = async () => {
        try {
            const response = await api.get('/games/'+roomId);
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log(response.data); // Add this line for debugging
            setRoom(response.data);
        } catch (error) {
            console.error(`Something went wrong while fetching the rooms: \n${handleError(error)}`);
            console.error("Details:", error);
        }
    };



    useEffect(() => {
        if (room && room.roomProperty) { // Check that room and room.roomProperty are not undefined
            //alert(room.roomProperty);
            const currentId = localStorage.getItem('id');
            const isPlayerInRoom = room.roomPlayersList.join().includes(currentId);
            if((!isPlayerInRoom)){
                alert('Please enter the room from lobby');
                history.push('/lobby');

        } else {
            connect();
        }}
    }, [room]);

    useEffect(() => {
        if (room && room.roomOwnerId) { // Check that room and room.roomProperty are not undefined
            //alert(room.roomProperty);
            const currentId = localStorage.getItem('id');
            if((room.roomOwnerId==currentId)){
                setShowStartIcon(true);
                alert()
            }
        }
    }, [room]);
    
    const connect = () => {
        //let Sock = new SockJS('http://localhost:8080/ws');
        let Sock = new SockJS('https://sopra-fs23-group-01-server.oa.r.appspot.com/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    };
    
    const onConnected = async () => {
        setUserData({ ...userData, "connected": true });
        stompClient.subscribe('/chatroom/'+roomId+'/public', onMessageReceived);
        stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessageReceived);
        updateUser();
        userJoin();
    };


    const onPrivateMessageReceived = (payload) => {
        const message = JSON.parse(payload.body);

        if (message.status === 'ASSIGNED_WORD') {
            setAssignedWord(message.message);
            setRole(message.role);
            localStorage.setItem("role", message.role);
        }
    };

    const userJoin = () => {
    
        var joinMessage = {
            senderName: userData.username,
            status: "JOIN"
        };
        if(room.roomProperty=='INGAME'){
            getReconnect();
            getReady();
            setShowBackIcon(false);
            setShowSendIcon(false);
            setIsButtonVisible(false);

}
        else if(room.roomProperty=='WAITING'){
        stompClient.send("/app/message/"+roomId, {}, JSON.stringify(joinMessage));
        }
        sendUpdateReminder();
    }


    const wordAssign = () => {
        var chatMessage = {
            senderName: userData.username,
            status: "ASSIGNED_WORD"
        };
        stompClient.send("/app/message/"+roomId, {}, JSON.stringify(chatMessage));
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



    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                updateUser();       
                if (!privateChats.get(payloadData.senderName)) {
                    privateChats.set(payloadData.senderName, []);
                    setPrivateChats(new Map(privateChats));
                }
                const joinMessage = {
                    senderName: "system",
                    message: `${payloadData.senderName} entered the room.`,
                    status: "MESSAGE"
                };
                publicChats.push(joinMessage);
                setPublicChats([...publicChats]);
                scrollToBottom();
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                scrollToBottom();
                break;
            case "READY":
                updateUser(); 
                const readyMessage = {
                    senderName: "system",
                    message: `${payloadData.senderName} is ready!`,
                    status: "MESSAGE"
                };
                publicChats.push(readyMessage);
                setPublicChats([...publicChats]);
                scrollToBottom();
                break;
            case "NOT_READY":
                updateUser(); 
                const cancelMessage = {
                    senderName: "system",
                    message: `${payloadData.senderName} cancel ready!`,
                    status: "MESSAGE"
                };
                publicChats.push(cancelMessage);
                setPublicChats([...publicChats]);
                scrollToBottom();
                break;

            case "RECONNECT":
                setRole(localStorage.getItem("role"));
                updateUser(); 
                const reconnectMessage = {
                    senderName: "system",
                    message: `${payloadData.senderName} reconnected.`,
                    status: "MESSAGE"
                };
                publicChats.push(reconnectMessage);
                setPublicChats([...publicChats]);
                scrollToBottom();
                break;        

            case "START":
                updateUser(); 
                setIsButtonVisible(false);
                wordAssign();
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                scrollToBottom();
                setShowSendIcon(false);
                sendUpdateReminder();
                setShowBackIcon(false);
                break;

            case "REMINDER":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                scrollToBottom();
                break;

            case "DESCRIPTION":
                setVotedThisRound(true);
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                scrollToBottom();
                setIsVisible(true);
                setSeconds(20);
                if(payloadData.senderName === userData.username){
                    setShowSendIcon(true);
                } else
                setShowSendIcon(false);
                break;

            case "VOTE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                scrollToBottom();
                setVotedThisRound(false);
                setSeconds(10);
                setShowSendIcon(false);

                break;

            case "END":
                updateUser(); 
                setIsButtonVisible(true);
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                scrollToBottom();
                setShowSendIcon(true);
                setShowBackIcon(true);
                setWinner(payloadData.senderName);
                setShowResult(true);
                setButtonStatus("Ready");
                break;

            // case "CURRENT_PLAYER":
            //     publicChats.push(payloadData);
            //     setPublicChats([...publicChats]);
            //     scrollToBottom();
            //     if(payloadData.message.equals(userData.username))
            //         setShowSendIcon(true);
            //     console.log(payloadData);
            //     break;
        }
    }

    const onPrivateMessage = (payload) => {
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if (privateChats.get(payloadData.senderName)) {
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else {
            let list = [];
            list.push(payloadData);
            privateChats.set(payloadData.senderName, list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);

    }

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "message": value });
    }
    const sendValue = () => {
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status: "MESSAGE"
            };

            let invalidWords = synonymsOfWord.filter(word => chatMessage.message.includes(word));
            if (invalidWords.length > 0) {
                toast.warning("Your message contains words that are not allowed: " + invalidWords.join(", "));
                return;
            }

            console.log(chatMessage);
            stompClient.send("/app/message/"+roomId, {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
        }
    }

    const updateRoomOrder = () => {
        if (stompClient) {
            var oderMessage = {
                status: "ROOM_UPDATE"
            };

            console.log(oderMessage);
            stompClient.send("/app/roomcreat", {}, JSON.stringify(oderMessage));
        }
    }
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };


useEffect(() => {
    scrollToBottom();
}, [publicChats]);

const [showWelcome, setShowWelcome] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setShowWelcome(false);
  }, 5000);
  return () => clearTimeout(timer);
}, []);

    return (
        <div>
        <BaseContainer>

            {showWelcome && <Confetti />}
        <Modal 
        isOpen={showWelcome}
        onRequestClose={() => setShowWelcome(false)}
        contentLabel="Welcome Modal"
        style={
          {
            overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'transparent',
              borderRadius: '15px',
            //   border:"none",
            }
          }
        }
      >
        <div className='chat welcome'>Welcome to the game!</div>
        <div className='chat welcomecontainer'>
        <Button onClick={() => setShowWelcome(false)}>Close</Button>
        </div>
      </Modal>
            <ToastContainer />
            {showBackIcon && <img className="room backicon" src={BackIcon} alt="Back" onClick={() => goBack()} />}
            <div className="room roomid">Room:{roomId}</div>

                <div className="chat container">
                    {userData.connected ?

                        <div className="chat chat-box">
                            {showResult &&
                                <div className="room result">
                                    <img className="room trophies" src={trophies} />
                                    <p className="room winning">{winner} wins!</p>
                                    <div className="login button-container" style={{ marginBottom: '30px' }}>
                                        <Button
                                            width="150px"
                                            onClick={() =>setShowResult(false)}>Confirm
                                        </Button>
                                    </div>

                                </div>
                            }

                            <div className="room theme" >{role}</div>
                            {isVisible ? <div className="room countdown">{seconds} seconds left</div> : null}
                            {tab === "CHATROOM" && 
                                <div className="chat chat-container"> 
                                    {/* <div className="chat fade-overlay"></div> */}
                                    <div className="chat chat-content">
                                        <ul className="chat chat-messages">
                                            {publicChats.map((chat, index) => (
                                                <li className={`chat message ${chat.senderName === userData.username && "self"} ${chat.senderName === "system" && "system"}`} key={index}>
                                                    {chat.senderName !== userData.username && chat.senderName !== "system" && <div className="chat avatar">{chat.senderName}</div>}
                                                    <div className="chat message-data">{chat.message}</div>
                                                    {chat.senderName === userData.username && <div className="chat avatar self">{chat.senderName}</div>}
                                                    <div ref={messagesEndRef} />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                }

                            {isButtonVisible ?
                            
                                <div className="room button-row">

                                    <div className="room button-container" onClick={() => getReady()}>
                                        {buttonStatus}
                                    </div>
                                    <div 
                                        className={`room button-container1 ${showStartIcon ? 'room normal' : 'room grayed'}`} 
                                        onClick={() => {
                                            if (showStartIcon) {
                                            gameStart();
                                            } else {
                                            toast.error("You are not allowed to start the game, please wait for room owner!", { autoClose: 1000 });
                                            }
                                        }}
                                        >
                                        Start
                                    </div>
                                    
                                </div>: null}



                        </div>
                        :
                        null
                    }
                </div>
                

            {content}
            <div className="chat send-messagebox">
                <input type="text" className="chat input-message" placeholder="Enter your message here..." value={userData.message} onChange={handleMessage} />
                <img className={`room confirmicon`}  src={showSendIcon ? ConfirmIconBlue : ConfirmIcon} onClick={showSendIcon ? () => sendValue() : null}
                     alt="Confirm" />
            </div>

            </BaseContainer>
            </div>
    );
}

export default Room;