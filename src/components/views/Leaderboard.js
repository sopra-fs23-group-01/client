import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import rank1 from './rank1.png';
import rank2 from './rank2.png';
import rank3 from './rank3.png';
import crown from './crown.png';
import avatar1 from './avatar1.png';
import avatar2 from './avatar2.png';
import avatar3 from './avatar3.png';
import NavigationBar from './NavigationBar';
import {toast, ToastContainer} from "react-toastify";



const Game = () => {

  // use react-router-dom's hook to access the history
  const history = useHistory();

  const [users, setUsers] = useState(null);
  const [sortedUsers, setSortedUsers] = useState(null);
  const [firstPlayer, setFirstPlayer] = useState(null);
  const [secondPlayer, setSecondPlayer] = useState(null);
  const [thirdPlayer, setThirdPlayer] = useState(null);


    const goLobby = async () => {
    window.location.href = `/lobby`;
  };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get('/users');
                await new Promise(resolve => setTimeout(resolve, 1000));
                setUsers(response.data);

                const sortedUsersData = response.data.slice().sort((a, b) => b.rateDe - a.rateDe);
                setSortedUsers(sortedUsersData);
                if (sortedUsersData.length > 0) {
                    setFirstPlayer(sortedUsersData[0]);
                }
                if (sortedUsersData.length > 1) {
                    setSecondPlayer(sortedUsersData[1]);
                }
                if (sortedUsersData.length > 2) {
                    setThirdPlayer(sortedUsersData[2]);
                }
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
                <div className="game playercontainer">
                    <div className="leaderboard number">{user.id}</div>
                    <img className='avatar4' src={user.avatarUrl} />
                    <div className="game informationcontainer">
                        <div className="leaderboard id">
                            <a href={`/user/${user.id}`} className="leaderboard namelink">
                                Player {user.username}
                            </a>
                        </div>
                        <div className="leaderboard winingrate">: {user.intro}</div>
                    </div>
                    <div className="player rate">
                        <div className="player ratenum">{`${user.rateDe * 100}%`}</div>
                    </div>
                </div>
            );
        }

        Player.propTypes = {
            user: PropTypes.object
        };

        content = (
            <div>
                <ul className="game user-list">
                    {sortedUsers && sortedUsers.map(user => (
                        <Player user={user} key={user.id} />
                    ))}
                </ul>
            </div>
        );
    }


  return (
    <BaseContainer>
        <ToastContainer />
{/*      <img className='rank1' src={rank1}/>
      <img className='rank2' src={rank2}/>
      <img className='rank3' src={rank3}/>
      <img className='crown1' src={crown}/>
      <img className='avatar1' src={avatar1}/>
      <img className='avatar2' src={avatar2}/>
      <img className='avatar3' src={avatar3}/>

      <div className='rankname1'>
        Hankyshadow
      </div>
      <div className='rankname2'>
        MasterLin 
      </div>
      <div className='rankname3'>
        ZephyrHarpoon
      </div>*/}
        <img className='rank1' src={rank1}/>
        {firstPlayer && (
            <>
                <img className='crown1' src={crown}/>
                <img className='avatar1' src={firstPlayer.avatarUrl}/>
                <div className='rankname1'>
                    {firstPlayer.username}
                </div>
            </>
        )}
        <img className='rank2' src={rank2}/>
        {secondPlayer && (
            <>
                <img className='avatar2' src={secondPlayer.avatarUrl}/>
                <div className='rankname2'>
                    {secondPlayer.username}
                </div>
            </>
        )}
        <img className='rank3' src={rank3}/>
        {thirdPlayer && (
            <>
                <img className='avatar3' src={thirdPlayer.avatarUrl}/>
                <div className='rankname3'>
                    {thirdPlayer.username}
                </div>
            </>
        )}
        <div className='leaderboardhead'>
            LeaderBoard Detective
        </div>
        {content}

      <NavigationBar/>
      
    </BaseContainer>
  );
}

export default Game;
