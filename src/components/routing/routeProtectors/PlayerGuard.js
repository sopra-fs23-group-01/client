import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect, useHistory } from 'react-router-dom';
import { api } from '../../../helpers/api';

export const PlayerGuard = ({ children }) => {
    const history = useHistory();
    const [room, setRoom] = useState(null);
    const id = localStorage.getItem('id');

    useEffect(() => {
        async function getUserRoom() {
            try {
                const requestBody = JSON.stringify({ id });
                const response = await api.post('/games/guard', requestBody);
                if (response.data === null) {
                    return;
                }

                setRoom(response.data);
            } catch (error) {
                console.error(`Something went wrong during fetching rooms: \n${error}`);
            }
        }

        getUserRoom();
    }, [id, room]);

    if (!room || !room.roomId) {
        return children;
    }

    const roomId = room.roomId;
    history.push(`/room=${roomId}`);
    return <Redirect key={roomId} to={`/room=${roomId}`} />;
};

PlayerGuard.propTypes = {
    children: PropTypes.node,
};
