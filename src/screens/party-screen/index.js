import { Avatar } from '@material-ui/core';
import React, { Component, useCallback, useEffect, useState } from 'react';
import { Card , Jumbotron, Button} from 'react-bootstrap';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import {Link} from 'react-router-dom'
import queryString from 'query-string'
import axios from 'axios'
import _ from 'lodash'
import logo from '../../assets/Jukebox_Fixed.png'
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import {useDispatch , useSelector} from 'react-redux'
import './index.css'




function getAccessToken(){
  return localStorage.getItem('access_token');
}

const Party = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState({
    name: 'Play a song', 
    image: '',
     is_playing: false, 
  })
  const [needData , setNeedData] = useState(false)

  const  FetchData  = async() => {  
    await axios.get('https://api.spotify.com/v1/me/player/currently-playing',{      
      headers: {'Authorization': 'Bearer ' + getAccessToken() }
    
    }).then((res) => {
            setCurrentlyPlaying({
              name: _.get(res.data.item,'name','Play a song'),
              image: _.get(res.data.item, ['album','images','0','url']),
              is_playing: _.get(res.data, 'is_playing' ) ,
              artist: _.get(res.data.item, ['artists', '0', 'name']),
              duration:  _.get(res.data.item, 'duration_ms'),
              progress:  _.get(res.data, 'progress_ms') 
            })
    })
    .then(() => {
      songChange()
     
    })
 }
 function songChange (){
  if(needData === true){
    FetchData()
    .then(() => {
      setNeedData(false)
    })
  }
  if(currentlyPlaying.duration - currentlyPlaying.progress === 0){
    FetchData()
  }
  else{
   console.log("error")
  }
}


  useEffect(() => {
    let parsed = queryString.parse(window.location.search);
  let accessToken = parsed.access_token;
  const token = localStorage.getItem('access_token' , accessToken)
 if(!token) 
  return;
  
 
FetchData()

 
    

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
      }).then(() => {
        songChange()
      })
 
 
}
const handlePlay = () => {
 axios({
    method: 'put',
    url: 'https://api.spotify.com/v1/me/player/play',
    headers: {
      Authorization: 'Bearer ' + getAccessToken()
    }
  }).then(() => {
    FetchData()
  }).then(() => {
    songChange()
  })
   
  
 
 
}
const handleSkipSong = () => {
   axios({
    method: 'post',
    url: 'https://api.spotify.com/v1/me/player/next',
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
  return(
    <div>
    <Jumbotron style={{height: "98vh", width: "100vw", marginBottom: "auto", backgroundColor: "#FE4871", boxSizing: "border-box", backgroundSize: "cover"}}>
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" ,marginBottom: "6vh", zIndex: 2}}>
    <Avatar/> <p>Host:</p>
            <h3>Party Name</h3>
            <Link to="/">
            <Button variant="warning">Leave party</Button>
            </Link>
            </div>
          {currentlyPlaying.is_playing  ? 
          <>
             
          <div className="song-contents" >
             <img  className="song-image"  src={currentlyPlaying.image} alt="currently playing song name"/>
          <div style={{display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center"}}>
        <h1 className="song-name">{currentlyPlaying.name}</h1>
          <p className="song-artist">{currentlyPlaying.artist}</p>
         <Button className="cuue-button" variant="primary">CUUE <AddIcon style={{fontSize: "3vh", marginBottom: "1vh"}}/></Button>
              <div className="player-controls" >
              <SkipPreviousIcon id="control-buttons" onClick={()=> handleGoBackSong()
               &&  setNeedData(true)}/>
              <PauseCircleFilledIcon id="control-buttons"  onClick={()=> handlePause()
                && setNeedData(true)}/>
              <SkipNextIcon id="control-buttons"  onClick={()=> handleSkipSong()
                 && setNeedData(true)}/>
              </div>
        
                
          </div>
          </div>
    <Card>
        <Card.Body>
            <h1>Members</h1>
        </Card.Body>
    </Card>
         </>
          :
          <>
          <div className="song-contents">
          <img  className="song-image"  src={logo} alt="currently playing song name"/>
       <div style={{display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center"}}>
     <h1  className="song-name">{currentlyPlaying.name}</h1>
       <p className="song-artist">{currentlyPlaying.artist}</p>
      <Button  variant="primary" className="cuue-button">CUUE <AddIcon style={{fontSize: "3vh", marginBottom: "1vh"}}/></Button>

      <div className="player-controls">
      <SkipPreviousIcon id="control-buttons" onClick={()=> handleGoBackSong()
               &&
               setNeedData(true)}/>
          <PlayCircleFilledIcon  id="control-buttons" onClick={()=> handlePlay()
           &&
           setNeedData(true)}/>
          <SkipNextIcon id="control-buttons"  onClick={()=> handleSkipSong()
              &&
              setNeedData(true)}/>
       </div>
       </div>
       </div>
 <Card>
     <Card.Body>
         <h1>Members</h1>
     </Card.Body>
 </Card>
 </>

}
  </Jumbotron>
           
</div>
  );

}

export default Party;
