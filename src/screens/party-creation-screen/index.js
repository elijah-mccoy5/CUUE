import React, { Component, useState } from 'react';
import queryString from 'query-string'; 
import spotify from '../../assets/spotify.png'
import {Button, Jumbotron, Card } from 'react-bootstrap'
import logo from '../../assets/Jukebox_Fixed.png';
import { Link } from 'react-router-dom'
import SearchPlaylist from '../search-playlist-screen';


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
      fetch('https://api.spotify.com/v1/me', {
        headers: {'Authorization': 'Bearer ' + accessToken}
      }).then(response => response.json())
      .then(data => this.setState({
        user: {
          name: data.display_name
        }
      }))
  
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
            <div >
              {this.state.user ?
              <div>
                  <Jumbotron style={{display: "flex", flexDirection: "column", backgroundColor: "#fc4474"}} className="justify-content-around align-items-center c-flex">
                    <img style={{height: "50vh", width: "28vw"}} alt="start cuee" src={logo}/>
                    
                  </Jumbotron>
                  <Card>
                      <Card.Body>
                      <h1>Search A playlist to start</h1>
                      <SearchPlaylist/>
                      <h1>Join CUUE</h1>
                      <ul>
                     <li>IMAGINE THIS IS AN IN SESSION PARTY</li>
                     <li>IMAGINE THIS IS AN IN SESSION PARTY</li>
                     <li>IMAGINE THIS IS AN IN SESSION PARTY</li>
                     <li>IMAGINE THIS IS AN IN SESSION PARTY</li>
                     <li>IMAGINE THIS IS AN IN SESSION PARTY</li>
                     </ul>
                  </Card.Body>
                  </Card>
              </div> :
                <Button block onClick={() => {
               window.location = window.location.href.includes('localhost') 
                ? 
                'http://localhost:8888/login'
                : 'https://cuue-web-backend.herokuapp.com/login'
            }} variant="light" size="lg" style={{ marginTop: "5vh"}}>
                <img style={{ width: "3vw",}} className="mr-4 dash-button" src={spotify} alt="spotify icon"/>Connect with Spotify</Button> 
              }
            </div>
          );
        }
      }
  


 export default PartyCreation;