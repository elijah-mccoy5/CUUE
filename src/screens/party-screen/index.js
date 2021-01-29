import { Avatar } from '@material-ui/core';
import React, { Component, useCallback, useEffect, useState } from 'react';
import { Card , Jumbotron, Button, Carousel, Form} from 'react-bootstrap';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import {Link} from 'react-router-dom'
import queryString from 'query-string'
import axios from 'axios'
import _ from 'lodash'
import logo from '../../assets/Jukebox_Fixed.png'
import {useParams, useHistory} from 'react-router-dom'
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import {useDispatch , useSelector} from 'react-redux'
import './index.css'
import Header from '../../components/header'
import {db} from '../../firebase'
import {useAuth} from '../../context/AuthContext'
import Search from '../../components/search'
import SpotifyWebApi from 'spotify-web-api-js'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import { AutoComplete, Input } from 'antd'
import { DeleteTwoTone } from '@material-ui/icons';


const spotifyApi = new SpotifyWebApi();

function getAccessToken(){
  return localStorage.getItem('access_token');
}

const Party = () => {
  const history = useHistory();
  let parsed = queryString.parse(window.location.search)
  let accessToken = parsed.access_token;
  
  const [currentlyPlaying, setCurrentlyPlaying] = useState({
    name: 'Play a song', 
    image: '',
     is_playing: false, 
  })
  const [needData , setNeedData] = useState(false)

  const [name, setName] = useState(null);
  const [search, setSearch] = useState()
  const [input, setInput] = useState('')
const [options, setOptions] = useState([{name:'', image: '', artist: ''}])
const [currentSongID, setCurrentSongID] = useState('');
const [nowSong, setNowSong] = useState();
const [nextSongs, setNextSongs] = useState([]);
const [upNext, setUpNext] = useState();
const [likes, setLikes] = useState(0)
const [open, setOpen] = useState()
const [test, setTest] = useState()
const [allNext, setAllNext] = useState([])
const {currentUser} = useAuth(); 


const { Option } = AutoComplete;

const GetThisToken = async() => {

  let refreshToken = localStorage.getItem('refresh_token')
  

  try{
   await axios.post("https://accounts.spotify.com/api/token", {
      headers: {'Content-Type': "application/x-www-form-urlencoded",
    },
    params: {
      grant_type: 'refresh_token',
      client_id: process.env.CLIENT_ID,
      refresh_token: refreshToken
    }
    }).then((res) => {
      localStorage.setItem('access_token', res.access_token)
    })
  }catch{
  console.log("just give up")
  }
}


const HTTP = axios.create({
  baseURL: `http://localhost:8888/login`,
})
HTTP.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error.response.status === 401 || 400) {
    GetThisToken()
  
  }
  return Promise.reject(error);
})


const nowSongData = async() => {
  try{
  await  HTTP.get(`https://api.spotify.com/v1/tracks/${currentSongID}`,{      
       headers: {'Authorization': 'Bearer ' + getAccessToken() }
     
     }).then((res) => {
       setNowSong({
         name: _.get(res.data, 'name','Play a song'),
         image: _.get(res.data, ['album','images','0','url']),
         is_local: _.get(res.data, 'is_local' ) ,
         artist: _.get(res.data, ['artists', '0', 'name']),
         duration:  _.get(res.data, 'duration_ms')
       })
       console.log(res)
       })
   
     }catch(e){
       console.log("There was an error getting the track id for the endpoint", e)
     }
   
}

  const  FetchData  = async() => {  
    deleteTrack()
    try{
          await HTTP.get('https://api.spotify.com/v1/me/player/currently-playing',{      
      headers: {'Authorization': 'Bearer ' + getAccessToken()}
    
    }).then((res) => {
            setCurrentlyPlaying({
              name: _.get(res.data.item,'name','Play a song'),
              image: _.get(res.data.item, ['album','images','0','url']),
              is_playing: _.get(res.data, 'is_playing' ) ,
              artist: _.get(res.data.item, ['artists', '0', 'name']),
              duration:  _.get(res.data.item, 'duration_ms'),
              progress:  _.get(res.data, 'progress_ms'),
             id: _.get(res.data.item, ['id']) ,
            uri: _.get(res.data.item, ['uri']) 
            })
    })
    .then(() => {
      setCurrentSongID(currentlyPlaying.id)
    })
  }catch{
    
   GetThisToken()
  }

 }


const songTimer = () => {
const songProgress = currentlyPlaying.duration - currentlyPlaying.progress
setInterval(() => {
  FetchData()
}, [songProgress])

console.log("SONG PROGRESS", songProgress)
}


    const CuueSong =  async () => {
        await  axios({
          method: 'post',
          url: 'https://api.spotify.com/v1/me/player/queue',
          params: {
              uri: allNext.song
          },
          headers: {
            Authorization: 'Bearer ' + getAccessToken()
          }
        })
        console.log("THOTS WITH US", allNext)
  
  }
  
  



  const  deleteTrack = () => {
    
    if( nextSongs[0] && currentlyPlaying.uri !== nextSongs[0].song){
    db.collection("parties")
    .doc(partyId.id)
    .collection('up_next')
    .doc(nextSongs[0].id)
    .delete()
    .then(() => {
      console.log("Your song is playing", nextSongs[0].id)
    })
    
  }
  else{
    console.log("COULD NOT DELETE THE CURRENTLY PLAYING TRACK")
  }
}




const partyId  = useParams();

  useEffect(() => {

    if(partyId){
      db.collection("parties")
      .doc(partyId.id)
      .onSnapshot((snapshot) => 
        setName(snapshot.data())
      )
      }
        FetchData()
       

        nowSongData()


  
  const token = localStorage.getItem('access_token' , getAccessToken())
  
  if (token && name?.host !== currentUser.email ){
    nowSongData()
    }

  if(!token) 
  return;
FetchData()
.then(() => {
  if(currentlyPlaying.uri !==  allNext){
    CuueSong()
  }
})
deleteTrack()



  }, []);

  const handlePause =  () => {
    axios({
        method: 'put',
        url: 'https://api.spotify.com/v1/me/player/pause',
        headers: {
          Authorization: 'Bearer ' + getAccessToken()
        }
      })
      .then(() => {
        FetchData()
      })
 
 
}
const handlePlay = () => {
  try{
 axios({
    method: 'put',
    url: 'https://api.spotify.com/v1/me/player/play',
    headers: {
      Authorization: 'Bearer ' + getAccessToken()
    }
  }).then(() => {
    FetchData()
  })
}catch{
  GetThisToken()
  .then(() => {
    FetchData()
  })
}
  
 
 
}

const handleSkipSong = () => {
    axios({
      method: 'post',
      url: 'https://api.spotify.com/v1/me/player/next',
      headers: {
        Authorization: 'Bearer ' + getAccessToken()
      }
    })
  .then(() => {
    FetchData()
  })
  .then(() => {
    clearInterval()
  })
}
const handleGoBackSong = () => {
  
  axios({
    method: 'post',
    url: 'https://api.spotify.com/v1/me/player/previous',
    headers: {
      Authorization: 'Bearer ' + getAccessToken()
    }
  }).then(() => {
    FetchData()
  })
  .then(() => {
    clearInterval()
  })
 
}

const handleToggle = () => {
 setSearch(!search)
 setOpen(true)
}

const handleSongSearch = (e) => {

    if(!e){
      return [];
    }


    if(spotifyApi.getAccessToken() !== null){
  spotifyApi.searchTracks(e).then(data => {
    const tracks = data.tracks.items.map(song => ({

 name: song.name,
 image: song.album.images[0].url,
 uri: song.uri

    }))
  setOptions(tracks)


  })
}else{
 window.alert("Sorry, We are having trouble. Please Sign in again.")
  history.push('/')
}

     
          }
          const handleQueue = async(value) => {
              db.collection("parties")
              .doc(partyId.id)
              .collection('up_next')
              .add({
                name: value,
                song: value,
                likes: likes,
            }).then(() => {
              console.log("JUST ADDED THE SONG TO THE DATABASE")
              
            }).then(async() => {
         await db.collection("parties")
              .doc(partyId.id)
              .collection('up_next')
              .onSnapshot(snapshot => {
                setNextSongs(
                  snapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    song: doc.data().song,
                    likes: doc.data().likes
              }))
                )
              })
             
            }).then(() => {
              if( currentlyPlaying.uri === value){
                db.collection("parties")
                .doc(partyId.id)
                .collection('up_next')
                .doc(nextSongs[0].id)
                .delete()
                .then(() => {
                  console.log("Your song is playing", nextSongs[0].id)
                })
                
              }
              else{
                console.log("COULD NOT DELETE THE CURRENTLY PLAYING TRACK")
              }
            }).then(async() => {
              await  axios({
                method: 'post',
                url: 'https://api.spotify.com/v1/me/player/queue',
                params: {
                    uri: value
                },
                headers: {
                  Authorization: 'Bearer ' + getAccessToken()
                }
              })
            })
          
          }
            

          const handleUpLike = () => {
          //   db.collection("parties")
          //   .doc(partyId.id)
          //   .collection('up_next')
          //   .doc(nextSongs[0].id)
          //   .set({
          //     likes: likes,
          // })
          setLikes(likes + 1)
          }
          const handleDownLike = () => {
            setLikes(likes - 1)
           
          }
        
          
console.log("Next Song", nextSongs)
console.log(likes)
console.log("Object values",Object.values(nextSongs))
  return(
    <div>

          <Header/>
    <Jumbotron style={{height: "98vh", width: "100vw", marginBottom: "auto", backgroundColor: "#FE4871", boxSizing: "border-box", backgroundSize: "cover"}}>
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" ,marginBottom: "6vh", zIndex: 2}}>
      <Avatar className="profile-button"/>
      <h3 className="party-name">{name?.name}</h3>
      <h3 className="party-host">Host: {name?.host}</h3>
        <Link to="/">
        <Button  className="leave-party" variant="warning">Leave party</Button>
        </Link>
        </div>

          {currentlyPlaying ?
          <>  
          {(name?.host === currentUser.email ) ?
            <div className="song-contents">
            <img  className="song-image"  src={currentlyPlaying.image} alt="currently playing song name"/>
         <div style={{display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center"}}>
       <h1  className="song-name" onClick={handleToggle}>{currentlyPlaying.name}</h1>
         <p className="song-artist">{currentlyPlaying.artist}</p>
         {search ? 
         <div className="AutoCompleteText">
          <AutoComplete defaultOpen={false} type="text" className="cuue-search" onChange={handleSongSearch} onSelect={handleQueue}>
              {options.map((option) => (
            <Option value={option.uri}  className="search-options"  >
              <img  src={option.image} alt="album cover" className="search-image"/>
            <p className="search-name-option"> {option.name}</p> 
            </Option>
              ))}
              </AutoComplete>

            </div>
              : 
              <div>
              <Button className="cuue-button" variant="primary" onClick={handleToggle} >CUUE <AddIcon style={{fontSize: "3vh", marginBottom: "1vh"}}/></Button>
              
              <div className="player-controls" >
              <SkipPreviousIcon id="control-buttons" onClick={()=> handleGoBackSong()}/>
              {currentlyPlaying.is_playing ?
               <PauseCircleFilledIcon id="control-buttons"  onClick={()=> handlePause()}/> :
                <PlayCircleFilledIcon  id="control-buttons" onClick={()=> handlePlay()}/>}
              
              <SkipNextIcon id="control-buttons"  onClick={()=> handleSkipSong()}/>
              </div>
              </div>
            
          }
         </div>
         </div>
         :
         <>
         {nowSong ?
           <div className="song-contents">
           <img  className="song-image"  src={nowSong.image} alt="currently playing song name"/>
        <div style={{display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center"}}>
      <h1  className="song-name" onClick={handleToggle}>{nowSong.name}</h1>
        <p className="song-artist">{nowSong.artist}</p>
        {search ? <div className="AutoCompleteText">
         <AutoComplete  defaultOpen={false} type="text" id="cuue-search" onChange={handleSongSearch} >
         
          {options.map((option) => (
            <>
       <Option key={option.uri} value={option.name} className="search-options" onSelect={() => {
       }}>
         <img  src={option.image} alt="album cover" className="search-image"/>
       <p className="search-name-option"> {option.name}</p> 
       <Button variant="warning" className="q-btn" onClick={() => {
         // setNextSongs([...nextSongs, option.uri])
         // console.log("next songs",nextSongs)
         console.log("hello")
          }}>CUUE</Button>
       </Option>
          </> 
         
          ))}
         
                 
                </AutoComplete>
       </div>
         : 
         <div>
         <Button className="cuue-button" variant="primary" onClick={handleToggle} >CUUE <AddIcon style={{fontSize: "3vh", marginBottom: "1vh"}}/></Button>
         
         
         <div className="player-controls" >
         <SkipPreviousIcon id="control-buttons" onClick={()=> handleGoBackSong()
          &&  setNeedData(true)}/>
         <PauseCircleFilledIcon id="control-buttons"  onClick={()=> handlePause()
           && setNeedData(true)}/>
         <SkipNextIcon id="control-buttons"  onClick={()=> handleSkipSong()
            && setNeedData(true)}/>
         </div>
         </div>
         }
         
        </div>
        </div>
: []}
</>
            }
            
 
       
          
      
    <Card>
        <Card.Body>
            <h1> Up Next</h1>
          {nextSongs ?         
          <ul className="up-next-container ">
              {nextSongs.map(song => (
   <li key={song.id} className="up-next-card">
   <h3 className="up-next-song">{song.song}</h3>
     <ArrowUpwardIcon onClick={handleUpLike} style={{fontSize: "5vh"}}/>
     <h4>{song.likes}</h4>
     <ArrowDownwardIcon  onClick={handleDownLike}  style={{fontSize: "5vh"}}/>
</li>
              ))}
           
             </ul> : []
                  }
            
        </Card.Body>
    </Card>
         </>
          :
         []

}
  </Jumbotron>
           
</div>

  );

}

export default Party;
