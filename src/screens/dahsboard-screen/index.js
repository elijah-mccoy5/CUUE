import React from 'react';
import { Container , Button, Jumbotron} from 'react-bootstrap';
import logo from '../../assets/Jukebox_Fixed.png';
import spotify from '../../assets/spotify.png';
import { Link } from 'react-router-dom'
import './index.css'
import Instructions from '../../components/instructions';

const Dashboard = () => {
    return (
      <>
            <Jumbotron style={{position: "absolute", top: 0, height: "70vh", backgroundColor: "#FE4871", overflow: "hidden"}} className="w-100 d-flex justify-content-center">
                <Container 
                className="c-flex text-left justify-content-center align-items-center ml-auto p-2 done" style={{marginTop: "4vh"}}>
                    <div  className="dash-words" style={{color: "white", marginTop: "5vh", width: "60vw", textAlign: "left", marginLeft: "5vw"}}>
                    <h2 style={{fontSize: "6vh", textAlign: "left", fontFamily: "Fugaz One', cursive"}}>Want more control?</h2>            
                        <p style={{fontSize: "3vh", textAlign: "left", fontFamily: "font-family: 'Fugaz One', cursive", width: "55%", marginTop: "3vh"}} className="jumbo">Start controlling the music.</p> 
                        <Link to="/">
                        <Button variant="light" size="lg" style={{ marginTop: "5vh"}}><img style={{ width: "3vw",}} className="mr-4 dash-button btn-doe" src={spotify} alt="spotify icon"/>Connect with Spotify</Button> 
                        </Link>   
                    </div>
                </Container>
                <div className="p-2">
                <img className="dashboard-logo"  alt="CUUE Logo" src={logo}/>
                </div>
            </Jumbotron>
            <Container style={{position: "absolute", marginTop: "10vh"}}>
            <Instructions/>
            </Container>
            </>
    );
};

export default Dashboard;