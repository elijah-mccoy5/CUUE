import React, { Component } from 'react';
import queryString from 'query-string';
import { Card, Button } from 'react-bootstrap'
import spotify from '../../assets/spotify.png';
import {Link } from 'react-router-dom'
import { DonutLarge } from '@material-ui/icons';


let defaultStyle = {
  color: '#fff',
  fontFamily: 'Montserrat, sans-serif'
};
let counterStyle = {...defaultStyle, 
  width: "40%", 
  display: 'inline-block',
  marginBottom: '20px',
  fontSize: '20px',
  lineHeight: '30px'
}

function isEven(number) {
  return number % 2
}

class PlaylistCounter extends Component {
  render() {
    let playlistCounterStyle = counterStyle
    return (
      <div style={playlistCounterStyle}>
        <h2>{this.props.playlists.length} playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    }, [])
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)
    let totalDurationHours = Math.round(totalDuration/60)
    let isTooLow = totalDurationHours < 40
    let hoursCounterStyle = {...counterStyle, 
      color: isTooLow ? 'red' : 'white',
      fontWeight: isTooLow ? 'bold' : 'normal',
    }
    return (
      <div style={hoursCounterStyle}>
        <h2>{totalDurationHours} hours</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={{...defaultStyle,
      }}>
        <img/>
        <input type="text" placeholder="Search your playlists..." onKeyUp={event => 
          this.props.onTextChange(event.target.value)}
          style={{...defaultStyle, 
            color: 'black', 
            height: "5vh",
            width: "20vw",
            padding: '10px',
            borderRadius: "20px", 
            marginRight: "3vw",
            outline: "none"
            }}/>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist
    return (
      <Card style={{...defaultStyle, 
        display: 'inline-block', 
        width: "30vw",
        padding: '2vw',
        backgroundColor: "#353B3C"
        }}>
              <h2 style={{marginBottom: "10vh"}}>{playlist.name}</h2>
        <img alt="playlist-cover-collage" src={playlist.imageUrl} style={{width: '20vw', height: "35vh", marginLeft: "3vw"}}/>
        <ul style={{marginTop: '10px', fontWeight: 'bold', listStyle: "none"}}>
          {playlist.songs.map(song => 
            <li key={song.id} style={{paddingTop: '3vh', fontSize: "2vh"}}>{song.name}</li>
          )}
        </ul>
        <Link to="/party">
        <Button
        block variant="primary" style={{marginTop: "5vh", height: "6vh"}}>Start Party</Button>
        </Link>
      </Card>
    );
  }
}

class SearchPlaylist extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: ''
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
    let playlistToRender = 
      this.state.user && 
      this.state.playlists 
        ? this.state.playlists.filter(playlist => {
          let matchesPlaylist = playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase()) 
          let matchesSong = playlist.songs.find(song => song.name.toLowerCase()
            .includes(this.state.filterString.toLowerCase()))
          return matchesPlaylist || matchesSong
        }) : []
    return (
      <div style={{justifyContent:'center', alignItems: "center", marginLeft: "3vw"}}>
        {this.state.user ?
        <div>
            <div className="d-inline-flex w-100 mt-5 ml-auto justify-content-between mb-5">
          <h1 style={{
              color: "white",
            fontSize: '3vh',
           fontFamily : "Montserrat, sans-serif",
          }}>
              <img src={spotify} alt="CUUE logo" style={{width: "3vw", marginRight: "1vw"}}/>
            {this.state.user.name}
          </h1>
          <div className="w-50">
          <PlaylistCounter playlists={playlistToRender}/>
          <HoursCounter playlists={playlistToRender}/>
          </div>
          <Filter onTextChange={text => {
              this.setState({filterString: text})
            }}/>
              </div>
          {playlistToRender.map((playlist, i) => 
            <Playlist playlist={playlist} index={i} />
          )}
        </div> : <button onClick={() => {
            window.location = window.location.href.includes('localhost') 
              ? 'http://localhost:8888/login' 
              : 'https://better-playlists-backend.herokuSearchPlaylist.com/login' }
          }
          style={{padding: "20px", fontSize: '50px', marginTop: '20px'}}>Sign in with Spotify</button>
        }
      </div>
    );
  }
}

export default SearchPlaylist;