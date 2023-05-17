import '@fortawesome/fontawesome-free/css/all.css';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
//import "styles/views/Room.scss";
import ReminderIcon from "../../styles/image/Icons/ReminderIcon.png";
import ConfirmIcon from "../../styles/image/Icons/ConfirmIcon.png";
import BackIcon from "../../styles/image/Icons/BackIcon.png";
import NavigationBar from "./NavigationBar";
import avatar1 from "./avatar1.png";
import NameIcon from "../../styles/image/Icons/NameIcon.png";
import User from "../../models/User";
import {Spinner} from "../ui/Spinner";
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';

const VoteResult = () => {

    const path = window.location.pathname.substring(1); // remove leading /
    const roomId = path.split('=')[1].split('/')[0];

    const history = useHistory();
    const [room, setRoom] = useState(null);
    const [users, setUsers] = useState(null);
    const [seconds, setSeconds] = useState(null);
    const [votingResult, setVotingResult] = useState(null);
    const [tie,setTie]=useState(false);
    //const [isVisible, setIsVisible] = useState(true);


// Assuming that votingResult is the voting result map that you received from the server
    /*setVotingResult({
        1: [2, 3],
        2: [1]
    })*/
    //setUsers({1:1})
    /*
    * {
  1: [2, 3],
  2: [1]
} after usestate

    *
    * the one being transferred
    * {
  "1": [2, 3],
  "2": [1]
}

    *
    *
    * */

/*// Step 1: Get the list of all voters
    const voters = [...new Set(Object.keys(votingResult))];

// Step 2: Get the vote count for each votee
    const voteCount = {};
    Object.values(votingResult).forEach((voteeId) => {
        if (voteCount[voteeId]) {
            voteCount[voteeId]++;
        } else {
            voteCount[voteeId] = 1;
        }
    });

    const voteeIds = Object.keys(voteCount);
    let maxVotes = 0;
    let playerToOut = null;
    voteeIds.forEach((voteeId) => {
        if (voteCount[voteeId] > maxVotes) {
            maxVotes = voteCount[voteeId];
            playerToOut = voteeId;
            setTie(false);
        } else if (voteCount[voteeId] === maxVotes) {
            playerToOut = null;//需要这个吗？
            setTie(true);
        }
    });*/

/*
    useEffect(() => {
        axios.get(`/room/${roomId}/vote-results`)
            .then(response => {
                setVotingResult(response.data);
            })
            .catch(error => {
                console.error(error);
                alert("didnt get the vr");
            });
    }, [roomId]);*/


    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                //alert(roomId);
                //get all players in the room
                const response = await api.get('/games/playerList/'+roomId);
                await new Promise(resolve => setTimeout(resolve, 1000));
                setVotingResult({
                    1: [2, 3],
                    2: [1]
                })
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
                alert(roomId);
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
                //localStorage.removeItem('token');
                //history.push('/login')
            }

        }
        fetchData();
    }, [users]);

    let content = <Spinner/>;


    alert(JSON.stringify(users));
    if (users) {
        alert("users true");
        alert(votingResult[1]);

        function VotedPlayer({ user, votingResult }) {

            /*
            *  setVotingResult({
                    1: [2, 3],
                    2: [1]
                })*/

            alert("get into function");
            console.log('votingResult in VotedPlayer:', votingResult);
            alert("1");
            const voters = votingResult[user.id];
            alert(voters);
            return (
                <div className="room playercontainer">
                    <div className="votee-avatar">
                        <img src={user.avatarUrl} alt="votee avatar" className="room avatarimg" />
                    </div>
                    <div className="voters-avatars">
                        {voters.map((voterId) => {
                            const voter = users.find((user) => user.id === voterId);
                            return (
                                <div key={voterId} className="voter-avatar">
                                    <img src={voter.avatarUrl} alt="voter avatar" className="room avatarimg" />
                                </div>
                            );
                        })}
                    </div>
                    <div className="room playername ">
                        <span>{user.username}</span>
                    </div>
                </div>
            );
        }


        VotedPlayer.propTypes = {
            user: PropTypes.object,
            votingResult: PropTypes.object
        };


        content = (
            <div>
                <ul >
                    {Object.entries(votingResult).map(([voteeId, voterIds]) => {
/*                        if (voterIds.length === 0) {
                            return null;
                        }*/

                        const votee = users.find((user) => user.id === voteeId);
                        alert('return qian');
                        return (
                            <div>
                            <VotedPlayer
                                user={votee}
                                votingResult={votingResult}
                                key={voteeId}
                            />
                            <div>456</div>
                            </div>
                        );
                    })}
                </ul>
                {/*<div>{user}</div>*/}
                <div>{votingResult}</div>
            </div>
        );

    }


    return (
    <div>
        <div>123</div>
            {content}
    </div>
    );
}

export default VoteResult;