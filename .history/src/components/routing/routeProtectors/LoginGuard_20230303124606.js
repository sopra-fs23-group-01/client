import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

/**
 *guard的含义大概为保护页面，这个组件可以用于需要授权访问的路由或页面，通过检查用户的登录状态，确保只有已登录用户才能访问受保护的资源
 * Another way to export directly your functional component.
 */
export const LoginGuard = props => {
  //如果没有本地token则停留在login页面
  if (!localStorage.getItem("token")) {
    return props.children;
  }
  // if user is already logged in, redirects to the main /app
  //如果有本地token则直接奇幻到game页面
  return <Redirect to="/game"/>;
};

LoginGuard.propTypes = {
  children: PropTypes.node
}