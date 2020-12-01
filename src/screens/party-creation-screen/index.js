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
            <div  style={{ top: 0,   marginLeft: "auto", marginRight: "auto"}} >
              {this.state.user ?
              <div style={{ justifyContent: "center", alignItems: "center", top: 0}}>
                  <Card className="playlist-card" style={{  backgroundColor: "#353B3C", width: "100vw", height: "100%",display: "flex", flexDirection: "row", top: 0}}>
                      <Card.Body>
                          <Card style={{}}>
                              <Card.Body>
                                  <h1 style={{marginTop: "1vh", color: "white", backgroundColor: "#353B3C", padding: "10px", width: "12vw", borderRadius: "20px", marginBottom: "6vh", alignSelf: "center",  marginLeft: "auto", marginRight: "auto"}}>Join a party</h1>
                                  <ul style={{listStyle: "none"}}>
                                      <li>Jessica's Party</li>
                                      <li>DOPe party time lol</li>
                                      <li>Crazy beats</li>
                                      <li>Lo-fi Type Beats</li>
                                  </ul>
                              </Card.Body>
                          </Card>
                      <SearchPlaylist/>
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