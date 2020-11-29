import React from 'react';
import {Jumbotron, Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import spotify from '../../assets/spotify.png';
import './index.css'

const Instructions = () => {
    return (
        <>
              <Jumbotron className="d-inline-flex justify-content-around jumbo" style={{position: "absolute", lineHeight: 2}}>
            <section className="c-flex" >
              <h1 style={{fontFamily: 'Fugaz One, cursive'}}>How to get started</h1>
              <div className="c-flex justify-content-around" style={{width: "80%", height: "80vh"}}>
              <p className="p-2 mt-5 text" style={{fontSize: "3vh"}}><ArrowRightIcon/>Sign in with your premium Spotify account</p>
              <p className="p-2  mt-5" style={{fontSize: "3vh"}}><ArrowRightIcon/>Go to the Spotify app, play a song. then come back and press Start CUUE.(Spotify must be playing before starting a party.)</p>
              <p className="p-2  mt-5" style={{fontSize: "3vh"}}><ArrowRightIcon/>After your party is started, search a song, and select your tune</p>
              </div>
              <Link to="/signin">
                        <Button variant="light" size="lg" style={{ marginTop: "5vh"}}><img style={{ width: "3vw",}} className="mr-4 dash-button" src={spotify} alt="spotify icon"/>Connect with Spotify</Button> 
                        </Link>               
            </section>
            <img className="instruction-image" alt="the app in action" src="https://isteam.wsimg.com/ip/6a3a64d4-f292-4124-b64e-5e762b277a78/Screen%20Shot%202020-04-12%20at%2011.54.18%20PM.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25"/>
            </Jumbotron>
   </>
    );
};

export default Instructions;