import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";
import NavigationBar from "./NavigationBar";


const Lobby = () => {

    // use react-router-dom's hook to access the history
    const history = useHistory();

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    const [users, setUsers] = useState(null);


    const quickStart = async () => {
        // const id = localStorage.getItem('id');
        // localStorage.removeItem('token');
        // try {
        //     const requestBody = JSON.stringify({id:id});
        //     const response = await api.post('/users/logout', requestBody);
        //     console.log(response);
        //
        // } catch (error) {
        //     alert(`Server has been refreshed!`);
        //
        // }
        window.location.href = `/chat`;
    };
    const createRoom = async () => {
        window.location.href = `/roomCreation`;
    };

    // the effect hook can be used to react to change in your component.
    // in this case, the effect hook is only run once, the first time the component is mounted
    // this can be achieved by leaving the second argument an empty array.
    // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html


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
            const statusStyle = {
                color: user.status === "ONLINE" ? "green" : "red"
            };

            return (
                <a href={`/user/${user.id}`} style={{ textDecoration: 'none' }}>
                    <div className="lobby player container" style={{ backgroundColor: 'yellowgreen' }}>
                        <div className="lobby player room">Room {user.id}</div>
                        <div className="lobby player theme">Theme: {user.username}</div>
                        <span style={statusStyle}>{user.status}</span>
                    </div>
                </a>
            );
        }


        Player.propTypes = {
            user: PropTypes.object
        };


        content = (
            <div className="lobby">
                <ul className="lobby user-list">
                    {users.map(user => (
                        <Player user={user} key={user.id}/>
                    ))}
                </ul>
            </div>
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
