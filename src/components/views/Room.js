import '@fortawesome/fontawesome-free/css/all.css';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import PropTypes from "prop-types";
import "styles/views/Room.scss";
import 'styles/views/ModalStyles.scss';
import ConfirmIcon from "../../styles/image/Icons/ConfirmIcon.png";
import ConfirmIconBlue from "../../styles/image/Icons/ConfirmIconBlue.png";
import BackIcon from "../../styles/image/Icons/BackIcon.png";
import Win from "../../styles/image/Pics4End/WinPic.png";
import Lose from "../../styles/image/Pics4End/LosePic.png";
import BookIcon from "../../styles/image/Icons/magnifier-search-zoom-svgrepo-com.png";
import ReadyHelp from "../../styles/image/Pics4help/readyDiscription.jpg";
import VoteHelp from "../../styles/image/Pics4help/voteDisc.jpg";
import {Spinner} from "../ui/Spinner";
import React, { useEffect, useState, useRef } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import {toast, ToastContainer} from "react-toastify";
import Modal from 'react-modal';


var stompClient = null;
const Room = () => {

    const history = useHistory();
    const [assignedWord, setAssignedWord] = useState('');
    const [role, setRole] = useState('');
    const [side,setSide] = useState('');
    const [room, setRoom] = useState(null);
    const [users, setUsers] = useState(null);
    const path = window.location.pathname.substring(1); // remove
    const roomId = path.split('=')[1];
    const id = localStorage.getItem('id');

    //control button stage
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [showSendIcon, setShowSendIcon] = useState(true);
    const [showBackIcon, setShowBackIcon] = useState(true);
    const [winner, setWinner] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [buttonStatus, setButtonStatus] = useState("Ready");
    const [votedThisRound, setVotedThisRound] = useState(true);
    const [showStartIcon,setShowStartIcon] = useState(false);
    const [words,setWords] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const getReady = async () => {
        try {
            const requestBody = JSON.stringify({id});
            await api.put('/users/room/'+roomId, requestBody);

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
            if (room.roomPlayersList.length > 1){updateRoomOrder();}
            else{
                if (stompClient) {
                    var oderMessage = {
                        status: "LOBBY_UPDATE"
                    };
        
                    console.log(oderMessage);
                    stompClient.send("/app/lobbyupdate", {}, JSON.stringify(oderMessage));}

            }
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
        }
    }, [seconds]);

    const gameStart = () => {

        stompClient.send("/app/gamestart/"+roomId, {},JSON.stringify());
        sendUpdateReminder();
    }

    function extractWordsFromMessage(words) {
        const detectiveWordMatch = words.match(/Detective Word:(\w+)/);
        const detectiveWord = detectiveWordMatch ? detectiveWordMatch[1] : "";

        const undercoverWordMatch = words.match(/Undercover Word:(\w+)/);
        const undercoverWord = undercoverWordMatch ? undercoverWordMatch[1] : "";

        return (
            <div>
                <p className="room wordsResult">Detective words: {detectiveWord}</p>
                <p className="room wordsResult">Undercover words: {undercoverWord}</p>
            </div>
        );
    }


    let content = <Spinner/>;

    if (users) {

        function Player({ user }) {
            const statusStyle = {
                color: user.readyStatus === "READY" ? "green": "red",
                fontSize: "120%"
            };


            const clickToVote = () =>{
                console.log('id:'+localStorage.getItem('id')+'userid'+user.id)
                if(Number(localStorage.getItem('id')) !== user.id){
                    api.put("room/"+roomId+"/vote/" +localStorage.getItem('id')+"="+user.id);
                    toast.success("Voted success!", { autoClose: 2000 });
                    setVotedThisRound(true);
                }
            }

            return (
                <div className="room playercontainer">
                    <img
                        src={user.avatarUrl}
                        onClick={(Number(localStorage.getItem('id')) === user.id || votedThisRound === true || user.gameStatus === "OUT") ? null : clickToVote}
                        alt="profile img"
                        style={{
                            cursor: (Number(localStorage.getItem('id')) === user.id || votedThisRound === true || user.gameStatus === "OUT") ? "default" : "pointer",
                            border: `2px solid ${user.readyStatus === "READY" ? "green" : "red"}`,
                            position: "relative",
                            backgroundColor: user.gameStatus === "OUT" ? "gray" : (room.roomProperty === "WAITING" && user.id === room.roomOwnerId ? "yellow" : "transparent")
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
    const synonymsOfWord = ["apple", "pear"]; 


    const storedUsername = localStorage.getItem('username');
    const [userData, setUserData] = useState({
        username: storedUsername || '',
        receivername: '',
        connected: false,
        message: ''
    });

    useEffect(() => {
        if (userData.username) {
            getRoom().catch((error) => {
                // Handle error or rejection
                console.error('An error occurred:', error);
            });
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
            const currentId = localStorage.getItem('id');
            if((room.roomOwnerId==currentId)){
                setShowStartIcon(true);
            }
        }
    }, [room]);
    
    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/ws');
        //let Sock = new SockJS('https://sopra-fs23-group-01-server.oa.r.appspot.com/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    };
    
    const onConnected = async () => {
        setUserData({ ...userData, "connected": true });
        stompClient.subscribe('/chatroom/'+roomId+'/public', onMessageReceived);
        stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessageReceived);
        updateUser().catch((error) => {
            // Handle error or rejection
            console.error('An error occurred:', error);
        });
        userJoin();
    };


    const onPrivateMessageReceived = (payload) => {
        const message = JSON.parse(payload.body);

        if (message.status === 'ASSIGNED_WORD') {
            setAssignedWord(message.message);
            setRole(message.role);
            setSide(message.message);
            localStorage.setItem("side", message.message);
            localStorage.setItem("role", message.role);
        }
    };

    const userJoin = () => { 
    
        var joinMessage = {
            senderName: userData.username,
            status: "JOIN"
        };
        if(room.roomProperty=='INGAME'){
            getReconnect().catch((error) => {
                // Handle error or rejection
                console.error('An error occurred:', error);
            });
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
                updateUser().catch((error) => {
                    // Handle error or rejection
                    console.error('An error occurred:', error);
                });
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
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);

                break;
            case "READY":
                updateUser().catch((error) => {
                    // Handle error or rejection
                    console.error('An error occurred:', error);
                });
                const readyMessage = {
                    senderName: "system",
                    message: `${payloadData.senderName} is ready!`,
                    status: "MESSAGE"
                };
                publicChats.push(readyMessage);
                setPublicChats([...publicChats]);

                break;
            case "NOT_READY":
                updateUser().catch((error) => {
                    // Handle error or rejection
                    console.error('An error occurred:', error);
                });
                const cancelMessage = {
                    senderName: "system",
                    message: `${payloadData.senderName} cancel ready!`,
                    status: "MESSAGE"
                };
                publicChats.push(cancelMessage);
                setPublicChats([...publicChats]);

                break;

            case "RECONNECT":
                setRole(localStorage.getItem("role"));
                updateUser().catch((error) => {
                    // Handle error or rejection
                    console.error('An error occurred:', error);
                });
                const reconnectMessage = {
                    senderName: "system",
                    message: `${payloadData.senderName} reconnected.`,
                    status: "MESSAGE"
                };
                publicChats.push(reconnectMessage);
                setPublicChats([...publicChats]);

                break;   
            
            case "ROOM_UPDATE":
                getRoom().catch((error) => {
                    // Handle error or rejection
                    console.error('An error occurred:', error);
                });
                updateUser().catch((error) => {
                    // Handle error or rejection
                    console.error('An error occurred:', error);
                });

                break;     

            case "START":
                //toast.success("Game Start Now! Good Luck and Have Fun!",{ autoClose: 2000 });
                updateUser().catch((error) => {
                    // Handle error or rejection
                    console.error('An error occurred:', error);
                });
                setIsButtonVisible(false);
                wordAssign();
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);

                setShowSendIcon(false);
                sendUpdateReminder();
                setShowBackIcon(false);
                break;

            case "REMINDER":
                updateUser().catch((error) => {
                    // Handle error or rejection
                    console.error('An error occurred:', error);
                });
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                // const reminderMessage = payloadData.message;
                // toast.info(reminderMessage, { autoClose: 2500 });
                break;

            case "DESCRIPTION":
                updateUser().catch((error) => {
                    // Handle error or rejection
                    console.error('An error occurred:', error);
                });
                setVotedThisRound(true);
                publicChats.push(payloadData);

                setPublicChats([...publicChats]);

                setIsVisible(true);
                setSeconds(20);
                if(payloadData.senderName === userData.username){
                    toast.info("It's your turn! Please describe!",{ autoClose: 1500 })
                    setShowSendIcon(true);
                } else
                setShowSendIcon(false);
                break;

            case "VOTE":
                updateUser().catch((error) => {
                    // Handle error or rejection
                    console.error('An error occurred:', error);
                });
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                toast.info("It's time to vote! Please pick a player by clicking their Avatar!")
                setVotedThisRound(false);
                setSeconds(10);
                setShowSendIcon(false);

                break;

            case "END":
                toast.info("Game Over! GG!")
                updateUser().catch((error) => {
                    // Handle error or rejection
                    console.error('An error occurred:', error);
                });
                setIsButtonVisible(true);
                publicChats.push(payloadData);
                setWords(payloadData.message);
                setPublicChats([...publicChats]);

                setShowSendIcon(true);
                setShowBackIcon(true);
                setWinner(payloadData.senderName);
                localStorage.setItem("winner",payloadData.senderName)
                setShowResult(true);
                setButtonStatus("Ready");
                localStorage.setItem("role","");
                break;
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

            //let invalidWords = role.filter(word => chatMessage.message.includes(word));
            if (role !== null && role !== '' && chatMessage.message.toLowerCase().includes(role.toLowerCase())) {
                toast.warning("Your message contains words that are not allowed: " + role);
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
            stompClient.send("/app/message/"+roomId, {}, JSON.stringify(oderMessage));
        }
    }
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth',  block: "end" });
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

const modalContentRef = useRef(); // Create a ref

useEffect(() => {
    if (modalIsOpen) { // Check if the modal is open
        const intervalId = setInterval(() => {
            if (modalContentRef.current.scrollTop < modalContentRef.current.scrollHeight) {
                // Increment the scrollTop property each time
                modalContentRef.current.scrollTop += 1;
            } else {
                // If we've reached the bottom, clear the interval
                clearInterval(intervalId);
            }
        }, 40); // Change the number for faster or slower scrolling

        return () => clearInterval(intervalId); // Clear the interval if the component unmounts
    }
}, [modalIsOpen]);

    return (
        <div>
            <ToastContainer />
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Game Rules"
                className="modal-content"
                overlayClassName="modal-overlay"
            >   
                <h2 className="modal-heading">Help</h2>
                <div className='modal-container' ref={modalContentRef}>
                <p className="modal-body">1. Click on the Ready button and  waiting for roomowner to start the game. </p>
                <img src={ReadyHelp} alt='ready' style={{width:'200px', height: '200px'}} />
                <p className="modal-body">2. After game start, please use your own word to discribe the word you assigned.(you may assigned a word different from others, you need to hide yourself)</p>
                <p className="modal-body">3. During discription stage, only one player can discribe their words each round</p>
                <p className="modal-body">4. After discription, you need to vote one player by clicking on their avatars.(as undercover you need to hide yourself, as detective you need to vote out undercover)</p>
                <img src={VoteHelp} alt='vote' style={{width:'200px', height: '200px'}} />
                <p className="modal-body">5. Game continue unless one side win.</p>
                </div>
                <div className='modal-buttonContainer'>
                <button className="modal-button" onClick={() => setModalIsOpen(false)}>close</button>
                </div>
            </Modal>

            <img className="room bookicon" src={BookIcon} alt="Book" onClick={() => setModalIsOpen(true)} />
            {showBackIcon && <img className="room backicon" src={BackIcon} alt="Back" onClick={() => goBack()} />}
            <div className="room roomid">Room:{roomId}</div>

                <div className="chat container">
                    {userData.connected ?

                        <div className="chat chat-box">
                            {showResult &&
                                <div className="room result">
                                    <img className="room trophies" src={winner === side ? Win : Lose} />
                                    <p className="room winning">{winner} wins!</p>
                                    {extractWordsFromMessage(words)}
                                    <div className="room button-container-re" style={{ marginBottom: '30px' }}>
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
                <input 
                    type="text" 
                    className="chat input-message" 
                    placeholder="Enter your message here..." 
                    value={userData.message} 
                    onChange={handleMessage} 
                />
                <img 
                    className={`room confirmicon`}  
                    src={showSendIcon ? ConfirmIconBlue : ConfirmIcon} 
                    onClick={() => {
                        if (userData.message.trim() !== '' && showSendIcon) {
                            sendValue();
                        }else {
                            //toast.error("Message can't be empty!");  // Optionally show an alert when the message is empty
                        }
                    }}
                    alt="Confirm" 
                />
            </div>


            </div>
    );
}

export default Room;
