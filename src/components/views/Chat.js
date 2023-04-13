import React, { useEffect, useState } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import 'styles/views/Chat.scss';
import {Button} from "../ui/Button";

var stompClient = null;
const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
    });
    useEffect(() => {
        console.log(userData);
    }, [userData]);

    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/ws');
        // let Sock = new SockJS('https://sopra-fs23-group-01-server.oa.r.appspot.com/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({ ...userData, "connected": true });
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
        userJoin();
    }

    const userJoin = () => {
        var chatMessage = {
            senderName: userData.username,
            status: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                if (!privateChats.get(payloadData.senderName)) {
                    privateChats.set(payloadData.senderName, []);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
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
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
        }
    }

    const sendPrivateValue = () => {
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                receiverName: tab,
                message: userData.message,
                status: "MESSAGE"
            };

            if (userData.username !== tab) {
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
        }
    }

    const handleUsername = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "username": value });
    }

    const registerUser = () => {
        connect();
    }
    return (
        <div className="chat container">
            {userData.connected ?
                <div className="chat chat-box">
                    <div className="chat member-list">
                        <ul>
                            <li onClick={() => { setTab("CHATROOM") }} className={`chat member ${tab === "CHATROOM" && "active"}`}>Chatroom</li>
                            {[...privateChats.keys()].map((name, index) => (
                                <li onClick={() => { setTab(name) }} className={`chat member ${tab === name && "active"}`} key={index}>{name}</li>
                            ))}
                        </ul>
                    </div>
                    {tab === "CHATROOM" && <div className="chat chat-content">
                        <ul className="chat chat-messages">
                            {publicChats.map((chat, index) => (
                                <li className={`chat message ${chat.senderName === userData.username && "self"}`} key={index}>
                                    {chat.senderName !== userData.username && <div className="chat avatar">{chat.senderName}</div>}
                                    <div className="chat message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="chat avatar self">{chat.senderName}</div>}
                                </li>
                            ))}
                        </ul>

                        <div className="chat send-messagebox">
                            <input type="text" className="chat input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} />
                            <Button type="button" onClick={sendValue}>send</Button>
                        </div>
                    </div>}
                    {tab !== "CHATROOM" && <div className="chat chat-content">
                        <ul className="chat chat-messages">
                            {[...privateChats.get(tab)].map((chat, index) => (
                                <li className={`chat message ${chat.senderName === userData.username && "self"}`} key={index}>
                                    {chat.senderName !== userData.username && <div className="chat avatar">{chat.senderName}</div>}
                                    <div className="chat message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="chat avatar self">{chat.senderName}</div>}
                                </li>
                            ))}
                        </ul>

                        <div className="chat send-messagebox">
                            <input type="text" className="chat input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} />
                            <Button type="button" onClick={sendPrivateValue}>send</Button>
                        </div>
                    </div>}
                </div>
                :
                <div className="chat register">
                    <input
                        id="user-name"
                        placeholder="Enter your name"
                        name="userName"
                        value={userData.username}
                        onChange={handleUsername}
                        margin="normal"
                    />
                    <button type="button" onClick={registerUser}>
                        connect
                    </button>
                </div>}
        </div>
    )
}

export default ChatRoom