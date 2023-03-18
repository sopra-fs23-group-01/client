import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import GameRouter from "components/routing/routers/GameRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Register from "components/views/Register";
import Profile from "components/views/Profile";
import Profilefield from "components/views/Profile";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
//exactpath是具体路径，只有完全匹配才会切换，path是只要包括就切换。
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/game">
          <GameGuard>
            <GameRouter base="/game"/>
          </GameGuard>
        </Route>

        <Route path="/profile/:id" component={Profilefield}>
          <Profile/>
        </Route>
        
        
         
        <Route exact path="/login">
          <LoginGuard>
            <Login/>
          </LoginGuard>
        </Route>

        <Route exact path="/register">
          <LoginGuard>
            <Register/>
          </LoginGuard>
        </Route>

        <Route exact path="/">
          <Redirect to="/game"/>
        </Route>

        
      </Switch>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
