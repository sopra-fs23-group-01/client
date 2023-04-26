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



const Game = () => {

  // use react-router-dom's hook to access the history
  const history = useHistory();
  
  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://reactjs.org/docs/hooks-state.html
  const [users, setUsers] = useState(null);


  const logout = async () => {
    const id = localStorage.getItem('id');
    localStorage.removeItem('token');
    try {
      const requestBody = JSON.stringify({id:id});
      const response = await api.post('/users/logout', requestBody);
      console.log(response);
    
    } catch (error) {
      alert(`Server has been refreshed!`);
      
    }
    history.push('/login');
  };

  const goLobby = async () => {
    window.location.href = `/lobby`;
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
    
      return (
        
        <div className="game playercontainer">
          <div className="leaderboard number">{user.id}</div>
          <img className='avatar4' src={user.avatarUrl} />
          <div className="game informationcontainer">
            <div className="leaderboard id">Player {user.id}</div>
            <div className="leaderboard winingrate ">{user.username} %</div>
            
          </div>
          <div className="player username"><a href={`/user/${user.id}`} className="player namelink">{user.username}</a></div>
        </div>
      );
    }
    

    Player.propTypes = {
      user: PropTypes.object
    };

    content = (
      <div>
        <ul className="game user-list">
          {users.map(user => (
            <Player user={user} key={user.id}/>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <BaseContainer>

      <img className='rank1' src={rank1}/>
      <img className='rank2' src={rank2}/>
      <img className='rank3' src={rank3}/>
      <img className='crown1' src={crown}/>
      <img className='avatar1' src={avatar1}/>
      <img className='avatar2' src={avatar2}/>
      <img className='avatar3' src={avatar3}/>
      <div className='leaderboardhead'>
        LeaderBoard Detective
      </div>
      <div className='rankname1'>
        Hankyshadow
      </div>
      <div className='rankname2'>
        MasterLin 
      </div>
      <div className='rankname3'>
        ZephyrHarpoon
      </div>
      {content}
      <Button
          width="100%"
          onClick={() => logout()}
        >
          Logout
        </Button>
      <NavigationBar/>
      
    </BaseContainer>
  );
}

export default Game;
