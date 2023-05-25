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
                    <Link to="/lobby" onClick={() => setActiveButton('lobby')}>
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
                    <Link to={`/user/${localStorage.getItem('id')}`} onClick={() => setActiveButton('profile')}>
                        <img src={ProfileIcon} alt="Profile" />
                        Profile
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default NavigationBar;
