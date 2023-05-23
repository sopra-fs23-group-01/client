import '@fortawesome/fontawesome-free/css/all.css';
import {api, handleError} from 'helpers/api';
import PropTypes from "prop-types";
import {Spinner} from "../ui/Spinner";
import React, { useEffect, useState } from 'react';

const VoteResult = () => {

    const path = window.location.pathname.substring(1); // remove leading /
    const roomId = path.split('=')[1].split('/')[0];
    const [users, setUsers] = useState(null);
    const [votingResult, setVotingResult] = useState(null);
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
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
            }

        }
        fetchData().catch((error) => {
        // Handle error or rejection
        console.error('An error occurred:', error);
    });
    }, [users]);

    let content = <Spinner/>;


    alert(JSON.stringify(users));
    if (users) {
        alert("users true");
        alert(votingResult[1]);

        function VotedPlayer({ user, votingResult }) {
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