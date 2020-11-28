import Connect from './screens/connect-screen';
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Dashboard from './screens/dahsboard-screen';
import Header from './components/header';
import NoMatch from './screens/no-match-screen'
import SignIn from './screens/sign-in-screen';
import { Home } from '@material-ui/icons';

function App() {
  return (
    <>
    <Header/>
      <Container 
      className="d-flex align-items-center justify-content-center w-100"
      style={{minHeight: "100vh"}}>
        <Router>
        <Switch>
       <Route exact path="/" component={Dashboard}/>
        <div  
        className="w-100" 
        style={{maxWidth: '400px'}}>
        <Route path="/connect" component={Connect}/>
        </div>
        <Route path="/about"/>
        <Route path="/profile"/>
        <Route component={NoMatch}/>
        </Switch>
        <Route path="/signin" component={SignIn}/>
        <Route path="/home" component={Home}/>
        </Router>
      </Container>
    </>
  );
}

export default App;
