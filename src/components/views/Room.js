import '@fortawesome/fontawesome-free/css/all.css';
import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Room.scss";
import ReminderIcon from "../../styles/image/Icons/ReminderIcon.png";
import ConfirmIcon from "../../styles/image/Icons/ConfirmIcon.png";
import BackIcon from "../../styles/image/Icons/BackIcon.png";
import NavigationBar from "./NavigationBar";
import avatar1 from "./avatar1.png";
import NameIcon from "../../styles/image/Icons/NameIcon.png";
import User from "../../models/User";
import {Spinner} from "../ui/Spinner";


const Room = () => {

    const history = useHistory();

    const [room, setRoom] = useState(null);
    const [users, setUsers] = useState(null);
    const path = window.location.pathname.substring(1); // remove leading /
    const roomId = path.split('=')[1];
    //const roomTheme = localStorage.getItem('roomTheme');

    const getReady = async () => {
        try {
            //const requestBody = JSON.stringify({});
            //const response = await api.post('/users/login', requestBody);
            //console.log(response);
            // Get the returned user and update a new object.
            //const user = new User(response.data);

            //history.push(`/leaderboard`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };

    const goBack = async () => {
        try {
            //const requestBody = JSON.stringify({});
            //const response = await api.post('/users/login', requestBody);
            //console.log(response);
            // Get the returned user and update a new object.
            //const user = new User(response.data);

            history.push(`/lobby`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };


    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get('/users');

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1000));

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

        }

        fetchData();
    }, [history]);

    let content = <Spinner/>;

    if (users) {

        function Player({ user }) {

            return (
                <div className="room playercontainer">
                    <img src={avatar1} alt="profile img" className="room avatarimg"/>
                    <div className="room playername ">{user.username}</div>
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

    return (
        <div className="room container">
            <img className="room backicon" src={BackIcon} alt="Back" onClick={() => goBack()} />
            <div className="room roomid">Room:{roomId}</div>
            <div className="room reminder">
                <img className="room remindericon" src={ReminderIcon} alt="Reminder" />
                <div className="room remindertext">Welcome to Who Is Undercover! Get ready to start!</div>
            </div>

            <div className="room chatbox">
                <div className="room theme" >Theme: Sports
                </div>
                <div className="room button-container" onClick={() => getReady()}>
                    Get Ready
                </div>
            </div>
            {content}
            <div className="room inputcontainer">
                <div className="room inputform">
                    Enter your message here...
                </div>
                <img className="room confirmicon" src={ConfirmIcon} alt="Confirm" />
            </div>
        </div>
    );
}

export default Room;
