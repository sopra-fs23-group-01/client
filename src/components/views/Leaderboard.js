import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Leaderboard.scss";
import rank1 from './images/rank1.png';
import rank2 from './images/rank2.png';
import rank3 from './images/rank3.png';
import crown from './images/crown.png';
import avatar1 from './images/avatar1.png';
import avatar2 from './images/avatar2.png';
import avatar3 from './images/avatar3.png';
import NavigationBar from './NavigationBar';
import {toast, ToastContainer} from "react-toastify";
import { Link } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';


const Game = () => {

  // use react-router-dom's hook to access the history
  const history = useHistory();

  const [users, setUsers] = useState(null);
  const [sortedUsers, setSortedUsers] = useState(null);
  const [firstPlayer, setFirstPlayer] = useState(null);
  const [secondPlayer, setSecondPlayer] = useState(null);
  const [thirdPlayer, setThirdPlayer] = useState(null);

  const [sortedUsers_UN, setSortedUsers_UN] = useState(null);
  const [firstPlayer_UN, setFirstPlayer_UN] = useState(null);
  const [secondPlayer_UN, setSecondPlayer_UN] = useState(null);
  const [thirdPlayer_UN, setThirdPlayer_UN] = useState(null);
  
  const handlers = useSwipeable({
    onSwipedRight: () => history.push('/profile'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true 
  });
  const [showSpy, setShowSpy] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get('/users');
                await new Promise(resolve => setTimeout(resolve, 1000));
                setUsers(response.data);

                const sortedUsersData = response.data.slice().sort((a, b) => b.rateDe - a.rateDe);
                const sortedUsersData_UN = response.data.slice().sort((a, b) => b.rateUn - a.rateUn);
                setSortedUsers(sortedUsersData);
                setSortedUsers_UN(sortedUsersData_UN);
                if (sortedUsersData.length > 0) {
                    setFirstPlayer(sortedUsersData[0]);
                }
                if (sortedUsersData.length > 1) {
                    setSecondPlayer(sortedUsersData[1]);
                }
                if (sortedUsersData.length > 2) {
                    setThirdPlayer(sortedUsersData[2]);
                }

                if (sortedUsersData_UN.length > 0) {
                  setFirstPlayer_UN(sortedUsersData_UN[0]);
                }
                if (sortedUsersData_UN.length > 1) {
                    setSecondPlayer_UN(sortedUsersData_UN[1]);
                }
                if (sortedUsersData_UN.length > 2) {
                    setThirdPlayer_UN(sortedUsersData_UN[2]);
                }

            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
                localStorage.removeItem('token');
                history.push('/login')
            }

        }

        fetchData().catch((error) => {
            // Handle error or rejection
            console.error('An error occurred:', error);
        });
    }, [history]);

    const SpyContent = () => (
      <BaseContainer {...handlers}>
        <ToastContainer />
        <div className='leaderboardhead' onClick={() => setShowSpy(false)}>
            LeaderBoardUndercover
        </div>
        <div className='game zoom-text-container zoom-text-in-out'>Click to Detective</div>
        <div className='leaderboard top3container'>
        <img className='leaderboard rank1' src={rank1}/>
        {firstPlayer_UN && (
            <>
                <img className='leaderboard crown1' src={crown}/>
                <Link to={`/user/${firstPlayer_UN.id}`}>
                    <img className='avatar1' src={firstPlayer_UN.avatarUrl} />
                </Link>
                <div className='rankname1'>
                    {firstPlayer_UN.username}
                </div>
            </>
        )}
        <img className='rank2' src={rank2}/>
        {secondPlayer_UN && (
            <>
                <Link to={`/user/${secondPlayer.id}`}>
                    <img className='avatar2' src={secondPlayer.avatarUrl} />
                </Link>
                <div className='rankname2'>
                    {secondPlayer_UN.username}
                </div>
            </>
        )}
        <img className='rank3' src={rank3}/>
        {thirdPlayer_UN && (
            <>
                <Link to={`/user/${thirdPlayer_UN.id}`}>
                    <img className='avatar3' src={thirdPlayer_UN.avatarUrl} />
                </Link>
                <div className='rankname3'>
                    {thirdPlayer_UN.username}
                </div>
            </>
        )}

</div>

        {content_UN}

      <NavigationBar/>
          </BaseContainer>

    );

    const DetectiveContent = () => (
      <BaseContainer {...handlers}>
        <ToastContainer />
        <div className='leaderboardhead' onClick={() => setShowSpy(true)}>
            LeaderBoard Detective
        </div>
        <div className='zoom-text-container zoom-text-in-out'>Click to Spy</div>
        <div className='leaderboard top3container'>
            <img className='rank1' src={rank1}/>
            {firstPlayer && (
                <>
                    <img className='crown1' src={crown}/>
                    <Link to={`/user/${firstPlayer.id}`}>
                        <img className='avatar1' src={firstPlayer.avatarUrl} />
                    </Link>
                    <div className='rankname1'>
                        {firstPlayer.username}
                    </div>
                </>
            )}
            <img className='rank2' src={rank2}/>
            {secondPlayer && (
                <>
                    <Link to={`/user/${secondPlayer.id}`}>
                        <img className='avatar2' src={secondPlayer.avatarUrl} />
                    </Link>
                    <div className='rankname2'>
                        {secondPlayer.username}
                    </div>
                </>
            )}
            <img className='rank3' src={rank3}/>
            {thirdPlayer && (
                <>
                    <Link to={`/user/${thirdPlayer.id}`}>
                        <img className='avatar3' src={thirdPlayer.avatarUrl} />
                    </Link>
                    <div className='rankname3'>
                        {thirdPlayer.username}
                    </div>
                </>
            )}
        </div>

        {content}

      <NavigationBar/>
      
    </BaseContainer>
    );

  let content = <Spinner/>;
  let content_UN = <Spinner/>;

    if (users) {
        function Player({ user }) {
            return (
                <Link to={`/user/${user.id}`} style={{textDecoration: 'none'}}>
                    <div className="game playercontainer" >
                        <div className="leaderboard number">ID {user.id}</div>
                        <img className='avatar4' src={user.avatarUrl} />
                        <div className="game informationcontainer">
                            <div className="leaderboard id">
                                <span className="leaderboard namelink">
                                  {user.username}
                                </span>
                            </div>
                            <div className="leaderboard winingrate">: {user.intro}</div>
                        </div>
                        <div className="player rate">
                            <div className="player ratenum">{`${showSpy ? user.rateUn : user.rateDe * 100}%`}</div>
                        </div>
                    </div>
                </Link>
            );
        }

        Player.propTypes = {
            user: PropTypes.object
        };

        content = (
            <div className='game listcontainer'>
                <ul className="game user-list">
                    {sortedUsers && sortedUsers.map(user => (
                        <Player user={user} key={user.id} />
                    ))}
                </ul>
            </div>
        );

        content_UN = (
          <div className='game listcontainer'>
              <ul className="game user-list">
                  {sortedUsers_UN && sortedUsers_UN.map(user => (
                      <Player user={user} key={user.id} />
                  ))}
              </ul>
          </div>
      );
    }


  return (
    <div>
    {showSpy ? <SpyContent /> : <DetectiveContent />}
  </div>
  );
}

export default Game;
