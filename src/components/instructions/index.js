import React from 'react';
import {Jumbotron, Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import spotify from '../../assets/spotify.png';
import './index.css'

const Instructions = () => {
    return (
              <Jumbotron className="instruction-container">
              <h1 className="jumbo-header">Get started</h1>
            <section className="main-instruction">
              <div className="instruction-words" >
              <p className="instruction-item"><ArrowRightIcon/>Sign in with your premium Spotify account</p>
              <p className="instruction-item"><ArrowRightIcon/>Go to the Spotify app, play a song. then come back and press Start CUUE.(Spotify must be playing before starting a party.)</p>
              <p className="instruction-item"><ArrowRightIcon/>After your party is started, search a song, and select your tune</p>
              </div>
              <img className="instruction-image" alt="the app in action" src="https://isteam.wsimg.com/ip/6a3a64d4-f292-4124-b64e-5e762b277a78/Screen%20Shot%202020-04-12%20at%2011.54.18%20PM.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25"/>
              </section>
              <Link to="/">
                        <Button block variant="light" className="button" size="lg" ><img id="spotify" src={spotify} alt="spotify icon"/>Connect with Spotify</Button> 
                        </Link>               
         
           
            </Jumbotron>
    );
};

export default Instructions;