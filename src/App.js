
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


function App() {
  return (
    <>
    <AuthProvider>
    <Header/>
      <Container 
      className="d-flex align-items-center justify-content-center w-100"
      style={{minHeight: "100vh"}}>
        <Switch>
       <Route exact path="/dashboard" component={Dashboard}/>
        <Route exact path="/" component={PartyContainer}/>
        <Route path="/party/:id" component={Party}/>
        <Route path="/about"/>
        <Route path="/profile"/>
         <Route component={NoMatch}/>
         <Route path="/searchplaylist" component={SearchPlaylist}/>
         <Redirect path="/"/>
        </Switch>
        {/* <PartyOptions/> */}
      </Container>
      </AuthProvider>
    </>
  );
}

export default App;
