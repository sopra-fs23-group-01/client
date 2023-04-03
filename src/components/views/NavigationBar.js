import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import 'styles/ui/NavigationBar.scss';
import GameIcon from 'styles/image/Icons/GameIcon.png';
import LeaderboardIcon from 'styles/image/Icons/LeaderboardIcon.png';
import ProfileIcon from 'styles/image/Icons/ProfileIcon.png';

function NavigationBar() {
    const [activeButton, setActiveButton] = useState('profile');

    return (
        <nav className="navigation-bar">
            <ul>
                <li className={activeButton === 'game' ? 'active' : ''}>
                    <Link to="/game" onClick={() => setActiveButton('game')}>
                        <img src={GameIcon} alt="Game" />
                        Game
                    </Link>
                </li>
                <li className={activeButton === 'leaderboard' ? 'active' : ''}>
                    <Link to="/leaderboard" onClick={() => setActiveButton('leaderboard')}>
                        <img src={LeaderboardIcon} alt="Leaderboard" />
                        Leaderboard
                    </Link>
                </li>
                <li className={activeButton === 'profile' ? 'active' : ''}>
                    <Link to="/profile" onClick={() => setActiveButton('profile')}>
                        <img src={ProfileIcon} alt="Profile" />
                        Profile
                    </Link>
                </li>
            </ul>
        </nav>
    );
}


/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default NavigationBar;
