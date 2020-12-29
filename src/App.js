import React, {useState} from 'react'
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Switch, Route, Redirect } from 'react-router-dom'
import Dashboard from './screens/dahsboard-screen';
import Header from './components/header';
import NoMatch from './screens/no-match-screen'
import PartyContainer from './screens/party-container-screen';
import SearchPlaylist from './screens/playlist-screen';
import Party from './screens/party-screen';
import { AuthProvider } from './context/AuthContext';
import SignUp from './components/signup';
import Login from './components/login';
import PrivateRoute from './components/PrivateRoute'
import Complete from './components/search';



function App() {
  const [loggedIn, setLoggedIn] = useState();
  return (
    <>
    <AuthProvider>
      <Container 
      className="d-flex align-items-center justify-content-center w-100"
      style={{minHeight: "100vh"}}>
        <Switch>
        <PrivateRoute exact path="/" component={PartyContainer}/>
       <PrivateRoute  exact path="/dashboard" component={Dashboard}/>
       <Route path="/login" component={Login} />
       <Route path="/signup" component={SignUp} />
        <PrivateRoute exact path="/party/:id" component={Party}/>
        <PrivateRoute  path="/about"/>
        <PrivateRoute  path="/profile"/>
         <Route component={NoMatch}/>
        </Switch>
      </Container>
      </AuthProvider>
    </>
  );
}

export default App;
