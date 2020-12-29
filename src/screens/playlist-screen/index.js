import React, { Component, useEffect, useCallback, useState } from 'react';
import queryString from 'query-string';
import { Card, Button, Form, Alert } from 'react-bootstrap'
import spotify from '../../assets/spotify.png';
import logo from '../../assets/Jukebox_Fixed.png';
import {Link } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import GetUserPlaylist from '../../redux/actions/userInfoAction'
import _ from 'lodash'
import {useHistory, useParams} from 'react-router-dom'
import AddIcon from '@material-ui/icons/Add';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import './index.css'
import axios from 'axios'
import {useAuth} from '../../context/AuthContext'
import { db } from '../../firebase';

const GeneratParty = () => {
  const [channels, setChannels] = useState([]);
  const [partyName, setPartyName] = useState('');
  const partyId  = useParams();
  const history = useHistory();
  const {currentUser} = useAuth(); 

  function getAccessToken(){
    return localStorage.getItem('access_token');
  }
const makeParty = (e) => {

  e.preventDefault()
  if(partyName !== ''){
    axios.post('https://api.spotify.com/v1/users/{user_id}/playlists',{      
      headers: {'Authorization': 'Bearer ' + getAccessToken() }
    }).then((res) => res.json())
    .then((data) => (
        console.log(data)
    ))
    

  db.collection("parties").add({
    name: partyName,
    host: currentUser.email,
    members: 1

}).then(function(docRef) {
  const partyRoom = docRef.id;
  history.push(`/party/${partyRoom}`)
})
}else{
 window.alert("Enter a name for the party")
}
}


  useEffect(() => {
      db.collection("parties")
      .onSnapshot(snapshot => {
          setChannels(
            snapshot.docs.map(doc => ({
                  id: doc.id,
                  name: doc.data().name,
            }))
          )
      })
    },[])
return(
  <div>
        <Form onSubmit={makeParty}>
        <input
         onChange={e => setPartyName(e.target.value)}
        className='party-name'
        />
         </Form>
         
         <Button
     onClick={makeParty}
        variant="warning" className="start-party-btn">Start Party</Button>
    </div>
);

}
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
      <div>
        <h2  className="playlist-count">{this.props.playlists.length} playlists</h2>
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
 
    return (
      <div>
        <h2 className="playlist-hours">{totalDurationHours} hours</h2>
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
          className="playlist-search"/>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist
    return (
      <Card className="playlist-card-container">
              <h2 className="playlist-name">{playlist.name}</h2>
        <img alt="playlist-cover-collage" src={playlist.imageUrl} className="playlist-image"/>
        <ul className="song-preview">
          {playlist.songs.map(song => 
            <li key={song.id} className="song-names">{song.name}</li>
          )}
        </ul>
       <GeneratParty/>
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
    })).then(() => {
      db.collection("user").add({
        name: this.state.user.name
  })
}).then(function(docRef) {
console.log(docRef)
      })
  
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
    }).then(playlists => this.setState({
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
      <div style={{justifyContent:'center', alignItems: "center", marginLeft: "3vw", backgroundColor: "#FE4871"}}>
        {this.state.user ?
        <div>
            <div className="d-inline-flex w-100 mt-5 ml-auto justify-content-between mb-5">
            <img src={logo} alt="CUUE logo" className="spotify"/>
            <div className="w-50">
          <h1 className="playlist-hours">
            {this.state.user.name}
          </h1>
          <PlaylistCounter playlists={playlistToRender}/>
          <HoursCounter playlists={playlistToRender}/>
          </div>
          <Filter onTextChange={text => {
              this.setState({filterString: text})
            }}/>
              </div>
              <div className="all-playlists">
          {playlistToRender.map((playlist, i) => 
      
            <Playlist playlist={playlist} index={i} />
          )}
             </div>
        </div> :[]
        }
      </div>
    );
  }
}
export default SearchPlaylist;

// const SearchPlaylist = () => {
//   const dispatch = useDispatch();
//   const userPlaylistData = useSelector(state => state.playlistData)


//   const FetchData = useCallback(()=> {
//     dispatch(GetUserPlaylist())
//   },[dispatch])

//   useEffect(() => {
//     FetchData()
//   },[FetchData])
//   const ShowData = () => {
//       if(_.isEmpty(userPlaylistData.tracks)){
//         console.log(userPlaylistData)
//         return userPlaylistData.data.map(playlist => (
//           <div className="song-contents" >
//                              <img  className="song-image"  alt="currently playing song name"/>
//                           <div style={{display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center"}}>
//         <h1 className="song-name">{playlist.tracks.href}</h1>
//                            <p className="song-artist">Song artist Here</p>
//                          <Button className="cuue-button" variant="primary">CUUE <AddIcon style={{fontSize: "3vh", marginBottom: "1vh"}}/></Button>
//                             <div className="player-controls" >
//                                <SkipPreviousIcon id="control-buttons"/>
//                              <PauseCircleFilledIcon id="control-buttons"  />
//                                  <SkipNextIcon id="control-buttons" />
//                               </div>
                          
                                  
//                              </div>
//                             </div>
//         ))   
//                   }
//                   if (userPlaylistData.loading){
//         return <p>Loading...</p>
//       }
//       if(userPlaylistData.errorMsg !== ""){
//       return <p>{userPlaylistData.errorMsg}</p>
//       }
    
//     }
//   return(
//     <div>
//       {ShowData()}
//   </div>
//   )
// }
// export default SearchPlaylist;