import logo from './logo.svg';
import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './index.css'


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Login from "./components/login/login"
import Signup from "./components/signup/signup"
// import Dashboard from "./components/dashboard/dashboard"
// import { useGlobalState } from "./state/GlobalState";

function App() {
  // const globalState = useGlobalState();
  // const setGlobalState = useSetGlobalState();
  return (
    <div className="App">

      <Router>

        <nav>
          <ul>
            <li>
              <Link to="/">login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
            {/* <li>
              <Link to="/dashboard">dashboard</Link>
            </li> */}
          </ul>
        </nav>


        <Switch>

          <Route exact={true}  path="/">
            <Login />
          </Route>
          {/* <Route path="/dashboard">
            <Dashboard />
          </Route> */}

          <Route path="/signup">
            <Signup />
          </Route>







        </Switch>

      </Router>



    </div>
  );
}

export default App;