import { useEffect, useRef, useState } from "react";
// import "styles/views/App.css";
import axios from 'axios';
import Right from "components/ui/Right";
import Left from "components/ui/Left";
import { notification} from 'antd';
import { Input } from 'antd';


let websocket;
let username;

function App() {
    const messageRef = useRef(null)
    const [messageList,setMessageList] = useState([])
    const [message,setMessage] = useState("")
    const [userList,setUserList] = useState([])
    const {} = Input;
    // const data = [
    //     {
    //         render:(item) => {
    //             return <>item</>
    //         }
    //     }
    // ]
    useEffect(() => {
        async function start() {
            if (!localStorage.getItem('username')) {
                await axios.get("http://localhost:8080/getName").then(response => {
                    localStorage.setItem('username', response.data)
                })
            }
            username = localStorage.getItem('username')
            let baseUrl = "ws://localhost:8080/websocket/"
            websocket = new WebSocket(baseUrl + localStorage.getItem('username'));
    
            websocket.onopen =  ()=> {
                console.log("建立 websocket 连接...");
            };
            websocket.onmessage = (event) => {
                const data = event.data
                setMessage(data)
            };
            websocket.onerror =  (event) => {
                console.log("websocket发生错误..." + event + '\n');
            }
    
            websocket.onclose =  ()=> {
                console.log("关闭 websocket 连接...");
            };
        }
        start()
    },[])
    useEffect(() => {
        console.log(message)
        if (message.indexOf(":") > 0) {
            setMessageList([...messageList,message])
            console.log(messageList)
            setMessage("")
            return 
        }
        if (message.indexOf("登录") > 0) {
            setUserList([...userList.filter(item => {
                return item !== message
            }),message])
            notification.info({
                message: `${message}`,
                description: ``,
                placement:'topLeft'
            });
            setMessage("")
            return
        }
        if (message.indexOf('离开') > 0) {
            let messageUsername = message.substr(0,message.indexOf("]") + 1)
            setUserList([...userList.filter(item => item.indexOf(messageUsername) < 0 )])
            notification.info({
                message: `${message}`,
                description: ``,
                placement:'topLeft'
            });
            setMessage("")
            return
        }
    },[message])


    const sendMessage = () => {
        const message = messageRef.current.value
        if (message.trim() === "") {
            alert("请重新输入")
            return
        }
        messageRef.current.value = ""
        websocket.send(message)
    }
    return (
        <>
            <div className="header">
                <h2>ChattingRoom</h2>
            </div>
            <div className="container">
                <div className="chart">
                    {
                        messageList.map(item => {
                            if (item.indexOf(username) > 0) {
                                console.log(username)
                                return <Right value={item} key={item + Math.random()} />
                            } else {
                                return <Left value={item} key={item + Math.random()}/>

                            }
                        })
                    }
                </div>
                <div className="input-value">
                    <textarea ref={messageRef} type="text" placeholder="发送消息" />
                    <button onClick={sendMessage}>发送</button>
                </div>
            </div>
            <div className="online">

                <span>当前在线人数 {userList.length}</span>
                {
                    userList.map(item => {
                        return <h2 key={Math.random()}>{item}</h2>
                    })
                }
            </div>
        </>
    )

}


export default App;
