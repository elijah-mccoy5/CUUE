
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Switch, Route, Redirect } from 'react-router-dom'
import Dashboard from './screens/dahsboard-screen';
import Header from './components/header';
import NoMatch from './screens/no-match-screen'
import PartyCreation from './screens/party-creation-screen';
import SearchPlaylist from './screens/search-playlist-screen';
import PartyOptions from './screens/party-options-screen';


function App() {
  return (
    <>
    <Header/>
      <Container 
      className="d-flex align-items-center justify-content-center w-100"
      style={{minHeight: "100vh"}}>
        <Switch>
       <Route exact path="/dashboard" component={Dashboard}/>
        <Route exact path="/" component={PartyCreation}/>
        <Route path="/party" component={PartyOptions}/>
        <Route path="/about"/>
        <Route path="/profile"/>
         <Route component={NoMatch}/>
         <Route path="/searchplaylist" component={SearchPlaylist}/>
         <Redirect path="/"/>
        </Switch>
        {/* <PartyOptions/> */}
      </Container>
    </>
  );
}

export default App;
