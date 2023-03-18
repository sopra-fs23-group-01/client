import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

/**
 * routeProtectors interfaces can tell the router whether or not it should allow navigation to a requested route.
 * They are functional components. Based on the props passed, a route gets rendered.
 * In this case, if the user is authenticated (i.e., a token is stored in the local storage)
 * {props.children} are rendered --> The content inside the <GameGuard> in the App.js file, i.e. the user is able to access the main app.
 * If the user isn't authenticated, the components redirects to the /login screen
 * @Guard
 * @param props
 */
//在game页面，如果有本地token则呆在game页面
export const GameGuard = props => {
  if (localStorage.getItem("token")) {
    return props.children;
  }
  //如果没有本地则切换到login页面s
  return <Redirect to="/login"/>;
};

GameGuard.propTypes = {
  children: PropTypes.node
};