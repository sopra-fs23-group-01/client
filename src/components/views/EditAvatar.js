
import 'styles/views/Profile.scss';
import React, { useState, useEffect } from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from "../ui/Button";
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import 'react-datepicker/dist/react-datepicker.css';
import '@fortawesome/fontawesome-free/css/all.css';
import {toast, ToastContainer} from "react-toastify";
const NameChangeField= props =>{
    return(
        <div className="profile name">
            <input
                className="profile input"
                type={props.type}
                placeholder="enter here"
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

NameChangeField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
};

function AvatarList(props) {
    const [avatarUrl, setAvatarUrl] = useState('');
    const { id, history} = props;

    const avatars = [
        'https://robohash.org/1',
        'https://robohash.org/2',
        'https://robohash.org/3',
        'https://robohash.org/4',
        'https://robohash.org/5',
        'https://robohash.org/6',
        'https://robohash.org/7',
        'https://robohash.org/8',
        'https://robohash.org/9',
        'https://robohash.org/10'
    ];

    const handleAvatarClick = async (url) => {
        setAvatarUrl(url);
        await doEditProfile(url);
    };

    const doEditProfile = async (url) => {
        try {
            const requestBody = JSON.stringify({
                id: id,
                avatarUrl: url // 将选中的头像 URL 更新到数据库中的 avatarUrl 字段
            });
            await api.put('/users/'+id, requestBody);

            history.push(`/user/${id}`);
        } catch (error) {
            alert(`Something went wrong during the profile edit: \n${handleError(error)}`);
        }
    };

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {avatars.map((url, index) => (
                <img
                    key={index}
                    src={url}
                    alt={`avatar-${index}`}
                    style={{ width: '100px', height: '100px', margin: '10px', cursor: 'pointer' }}
                    onClick={() => handleAvatarClick(url)}
                />
            ))}
        </div>
    );
}

const EditAvatar= () =>{

    //get the local username and id
    const history = useHistory();
    const userid = localStorage.getItem('id');

    //set new const
    const [id,] = useState(userid);
    const [username, setusername] = useState(null);
    const [, setImageUrl] = useState(null);
    const [birthday, setBirthday] = useState(null);
    const [intro, setIntro] = useState(null);
    const [gender, setGender] = useState(null);
    const [registerDate,] = useState(null);
    const [status,] = useState(null);
    const [users, setUsers] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState(true);


    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get('/users/' + id);
                console.log(response);
                setUsers(response.data);

            } catch (error) {
                alert(`Something went wrong during the profile page: \n${handleError(error)}`);

            }
        }

        fetchData().catch((error) => {
            // Handle error or rejection
            console.error('An error occurred:', error);
        });
    }, [id]);


    const doEditProfile = async () => {
        try {
            const requestBody = JSON.stringify({
                id: id,
                username: username,
                birthday: birthday,
                gender:gender,
                registerDate: registerDate,
                status: status,
                intro: intro,
                avatarUrl: avatarUrl
            });
            await api.put('/users/'+id, requestBody);
            toast.success("Edit Avatar successfully!", { autoClose: false });
            // Wait for Toast component to disappear before navigating to leaderboard
            await new Promise(resolve => setTimeout(resolve, 2000));
            history.push(`/user/${id}`);
        } catch (error) {
            toast.error(`Something went wrong during the avatar edit`);
        }
    };

    return(
        <BaseContainer>
            <ToastContainer />
            <div className="profile container">
                {/*<div className="return-button" onClick={() => history.push('/user/${id}')}></div>*/}
                <div className="profile head">Setting Avatar</div>

                <AvatarList id={id} history={history}/>

                <div className="login button-container">
                    <Button className="return-button"

                            onClick={() => history.push(`/user/${id}`)}>
                    </Button>

                </div>
            </div>

        </BaseContainer>
    );

};

export default EditAvatar;

