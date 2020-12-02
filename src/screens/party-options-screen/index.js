import { Avatar } from '@material-ui/core';
import React, { Component } from 'react';
import { Card , Jumbotron, Button} from 'react-bootstrap';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import Spotify from  'spotify-web-api-js'
import queryString from 'query-string'

const spotifyWebApi = new Spotify();

class PartyOptions extends Component {
    constructor(){
        super();
        const params = this.getHashParams();
        const token = params.access_token;
        if (token) {
          spotifyWebApi.setAccessToken(token);
        }
        this.state = {
          loggedIn: token ? true : false,
          nowPlaying: { name: 'Not Checked', albumArt: '' }
        }
      }
      getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        e = r.exec(q)
        while (e) {
           hashParams[e[1]] = decodeURIComponent(e[2]);
           e = r.exec(q);
        }
        return hashParams;
      }
    componentDidMount(){
      let parsed = queryString.parse(window.location.search);
      let accessToken = parsed.access_token;

     
    fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => console.log(data))
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
      // getNowPlaying(){
      //   fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      //     headers: {'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'application/json', 'Accept': 'application/json'}
      //   }).then(response => response.json())
      //   .then(data => console.log(data))
      //     .then((response) => {
      //       this.setState({
      //         nowPlaying: { 
      //             name: response.item.name, 
      //             albumArt: response.item.album.images[0].url
      //           }
      //       });
      //     })
      // }
    render(){
    return (
        <div>
            <Jumbotron>
              <img  src={this.state.nowPlaying.albumArt} alt="album-cover-mage" style={{height: "20vh", width: "50vh"}}/>
                <div>
                  
                    <Avatar/>
                    <h3>Party Name</h3>
                    <ClearIcon/>
                    <p>Leave party</p>
                    </div>
                    <div>
                        Now Playing: { this.state.nowPlaying.name }
                            </div>
                            <Button variant="primary"  onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </Button>
            </Jumbotron>
            <Card>
                <Card.Body>
                    <h1>Members</h1>
                    <AddIcon/>
                </Card.Body>
            </Card>
        </div>
    );
    }
};

export default PartyOptions;