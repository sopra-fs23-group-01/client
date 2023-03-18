import {Redirect, useHistory} from "react-router-dom";
import PropTypes from "prop-types";
import {api} from "../../../helpers/api";

/**
 * routeProtectors interfaces can tell the router whether or not it should allow navigation to a requested route.
 * They are functional components. Based on the props passed, a route gets rendered.
 * In this case, if the user is authenticated (i.e., a token is stored in the local storage)
 * {props.children} are rendered --> The content inside the <HomeGuard> in the App.js file, i.e. the user is able to access the main app.
 * If the user isn't authenticated, the components redirects to the /login screen
 * @Guard
 * @param props
 */
export const ProfileGuard = props => {

    async function fetchUsers() {
        try {
            const response = await api.get('/users');
            if (!response.data.length) {
                localStorage.clear();
                window.location.href = `/register`;
            }

        } catch (error) {
            alert("No users in DataBase, please click on Logout!")
        }
    }

    fetchUsers();

    if (localStorage.getItem("token")) { return props.children; }

    return <Redirect to="/login"/>
}


ProfileGuard.propTypes = {
    children: PropTypes.node
};