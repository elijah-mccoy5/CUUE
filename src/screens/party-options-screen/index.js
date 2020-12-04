import { Avatar } from '@material-ui/core';
import React, { Component } from 'react';
import { Card , Jumbotron, Button} from 'react-bootstrap';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import {Link} from 'react-router-dom'
import queryString from 'query-string'
import axios from 'axios'
import _ from 'lodash'
import createAuthRefreshInterceptor from 'axios-auth-refresh';


const refreshAuthLogic = failedRequest => axios.post('http://localhost:8888/callback',)
.then(tokenRefresh => {
    localStorage.setItem('access_token', tokenRefresh.data.token);
    failedRequest.response.config.headers['Authorization'] = 'Bearer ' + tokenRefresh.data.token;
    console.log("asked for another refresh token")
    return Promise.resolve();
});
createAuthRefreshInterceptor(axios, refreshAuthLogic);

function getAccessToken(){
  return localStorage.getItem('access_token');
}



class PartyOptions extends Component {
  
    constructor(){
        super();
        this.state = {
          currentlyPlaying: { name: 'Not Checked', image: '', is_playing: false, backgroundImage: '' }
        }
      }
componentDidMount(){
  let parsed = queryString.parse(window.location.search);
  let accessToken = parsed.access_token;
  const token = localStorage.getItem('access_token' , accessToken)
 if(!token) 
  return;

    axios.get('https://api.spotify.com/v1/me/player/currently-playing',{      
      headers: {'Authorization': 'Bearer ' + token }
    
    })
      .then((res) => {
        console.log( "data", res.data )
        this.setState({
              currentlyPlaying:{
                name: _.get(res.data.item,'name','Loading...'),
                image: _.get(res.data.item, ['album','images','0','url']),
                backgroundImage: _.get(res.data.item, ['album','images','3','url']),
                is_playing: _.get(res.data, 'is_playing' ) ,
                artist: _.get(res.data.item, ['artists', '0', 'name']) //data.is_playing
              }
             })
      })
      .then(() => {
        console.log(this.state.currentlyPlaying.is_playing)
        refreshAuthLogic()
      })
    } 

     
    render(){

    return (
        <div>
            <Jumbotron style={{height: "98vh", width: "100vw", marginBottom: "auto", backgroundColor: "#FE4871", boxSizing: "border-box", backgroundSize: "cover"}}>
              <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" ,marginBottom: "10vh", zIndex: 2}}>
            <Avatar/>
                    <h3>Party Name</h3>
                    <Link to="/partycreation">
                    <Button variant="danger">Leave party</Button>
                    </Link>
                    </div>
                  {this.state.currentlyPlaying.is_playing  ? 
                  <>
                     
                  <div style={{justifyContent: "center", alignItems: "center", display: "flex", marginBottom: "10vh"}}>
                     <img  style={{height: "55vh", width: "30vw"}} src={this.state.currentlyPlaying.image} alt="currently playing song name"/>
                  <div style={{display: "flex", flexDirection: "column", marginLeft: "5vw", justifyContent: "between"}}>
                <h1>{this.state.currentlyPlaying.name}</h1>
                  <p>{this.state.currentlyPlaying.artist}</p>
                 <Button variant="primary">CUUE song<AddIcon/></Button>
                  </div>
                  </div>
            <Card>
                <Card.Body>
                    <h1>Members</h1>
                </Card.Body>
            </Card>
                 </>
                  :
                  <Card style={{justifyContent: "center", alignItems: "center", display: "flex"}}> 
                <Card.Body>
                    <h1>Nothing is playing</h1>
                </Card.Body>
            </Card>
    }
          </Jumbotron>
                   
        </div>
    );
    }
};  

export default PartyOptions;