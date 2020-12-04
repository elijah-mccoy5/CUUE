import React, { Component, useState } from 'react';
import queryString from 'query-string'; 
import { Card , Jumbotron, Button} from 'react-bootstrap';
import ClearIcon from '@material-ui/icons/Clear';
import { Avatar } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SearchPlaylist from '../search-playlist-screen';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import Spotify from  'spotify-web-api-js'
import spotify from '../../assets/spotify.png'




  class PartyCreation extends Component {
    constructor() {
      super();
      this.state = {
        serverData: {},
        filterString: '', 
      }
    }

    componentDidMount() {
      let parsed = queryString.parse(window.location.search);
      let accessToken = parsed.access_token;
      
      if (!accessToken)
        return;
        localStorage.setItem('access_token', accessToken)

      fetch('https://api.spotify.com/v1/me', {
        headers: {'Authorization': 'Bearer ' + accessToken}
      }).then(response => response.json())
      .then(data => this.setState({
        user: {
          name: data.display_name
        }
      }))
      localStorage.setItem('user', this.state.user)
  
      fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {'Authorization': 'Bearer ' + accessToken}
      }).then(response => response.json())
      .then(playlistData => {
        let playlists = playlistData.items
        let trackDataPromises = playlists.map(playlist => {
          let responsePromise = fetch(playlist.tracks.href, {
            headers: {'Authorization': 'Bearer ' + accessToken}
          })
          let trackDataPromise = responsePromise
            .then(response => response.json())
          return trackDataPromise
        })
        let allTracksDataPromises = 
          Promise.all(trackDataPromises)
        let playlistsPromise = allTracksDataPromises.then(trackDatas => {
          trackDatas.forEach((trackData, i) => {
            playlists[i].trackDatas = trackData.items
              .map(item => item.track)
              .map(trackData => ({
                name: trackData.name,
                duration: trackData.duration_ms / 1000
              }))
          })
          return playlists
        })
        return playlistsPromise
      })
      .then(playlists => this.setState({
        playlists: playlists.map(item => {
          return {
            name: item.name,
            imageUrl: item.images[0].url, 
            songs: item.trackDatas.slice(0,3)
          }
      })
      }))
    

    }
  
 
    render() {
       
          return (
            <div  style={{ top: 0,   marginLeft: "auto", marginRight: "auto"}} >
              {this.state.user ?
              <div style={{ justifyContent: "center", alignItems: "center", top: 0}}>
                  <Card className="playlist-card" style={{  backgroundColor: "#353B3C", width: "100vw", height: "100%",display: "flex", flexDirection: "row", top: 0}}>
                      <Card.Body>
                          <Card style={{}}>
                              <Card.Body>
                                  <ul style={{listStyle: "none"}}>
                                                <li style={{height: "5vh", borderBottom: "1px", borderColor: "gray", padding: "10px", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                         <h1 style={{ fontSize: "3vh"}}>Jessica's Party</h1> 
                                          <PeopleAltIcon/>
                                          </li>
                                      <li style={{height: "5vh", borderBottom: "1px", borderColor: "gray", padding: "10px",  display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                      <h1 style={{ fontSize: "3vh"}}>Jessica's Party</h1> 
                                          <PeopleAltIcon/>
                                          </li>
                                      <li style={{height: "5vh", borderBottom: "1px", borderColor: "gray", padding: "10px",  display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                      <h1 style={{ fontSize: "3vh"}}>Jessica's Party</h1> 
                                         <PeopleAltIcon/>  
                                          </li>
                                      <li style={{height: "5vh", borderBottom: "1px", borderColor: "gray", padding: "10px",  display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                      <h1 style={{ fontSize: "3vh"}}>Jessica's Party</h1> 
                                         <PeopleAltIcon/>  
                                          </li>
                                  </ul>
                              </Card.Body>
                          </Card>
                         <SearchPlaylist />
                  </Card.Body>
                  </Card>
              </div> :  <div>
                <Button block onClick={() => {
               window.location = window.location.href.includes('localhost') 
                ? 
                'http://localhost:8888/login'
                : 'https://cuue-web-backend.herokuapp.com/login'
            }} variant="light" size="lg" style={{ marginTop: "5vh"}}>
                <img style={{ width: "3vw",}} className="mr-4 dash-button" src={spotify} alt="spotify icon"/>Connect with Spotify
                </Button> 
              
            </div>
    }  
     </div>
          );
        }
      }
      


 export default PartyCreation;