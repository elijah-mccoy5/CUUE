import { Avatar } from '@material-ui/core';
import React, { Component, useCallback, useEffect } from 'react';
import { Card , Jumbotron, Button} from 'react-bootstrap';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import {Link} from 'react-router-dom'
import queryString from 'query-string'
import axios from 'axios'
import _ from 'lodash'
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import {useDispatch , useSelector} from 'react-redux'
import './index.css'
import GetCurrentSongData from '../../actions/currentSongAction';



function getAccessToken(){
  return localStorage.getItem('access_token');
}




class PartyOptions extends Component {
  
    constructor(){
        super();
        this.state = {
          currentlyPlaying: { name: 'Play a song', image: '', is_playing: false, backgroundImage: '' }
        }
      }
componentDidMount(){
  let parsed = queryString.parse(window.location.search);
  let accessToken = parsed.access_token;
  const token = localStorage.getItem('access_token' , accessToken)
 if(!token) 
  return;
this.getCurrentSongData();
  }
  getCurrentSongData = () => {
    axios.get('https://api.spotify.com/v1/me/player/currently-playing',{      
      headers: {'Authorization': 'Bearer ' + getAccessToken() }
    
    })
      .then((res) => {
        this.setState({
              currentlyPlaying:{
                name: _.get(res.data.item,'name','Play a song'),
                image: _.get(res.data.item, ['album','images','0','url']),
                backgroundImage: _.get(res.data.item, ['album','images','3','url']),
                is_playing: _.get(res.data, 'is_playing' ) ,
                artist: _.get(res.data.item, ['artists', '0', 'name']) //data.is_playing
              }
             })
      })
      console.log(this.state.currentlyPlaying.is_playing)
      this.intervalID = setTimeout(this.getCurrentSongData.bind(this), 2000);
  } 
  componentWillUnmount() {

    clearTimeout(this.intervalID);
  }
    render(){

      const handlePause = () => {
        axios({
          method: 'put',
          url: 'https://api.spotify.com/v1/me/player/pause',
          headers: {
            Authorization: 'Bearer ' + getAccessToken()
          }
        })
      }
      const handlePlay = () => {
        axios({
          method: 'put',
          url: 'https://api.spotify.com/v1/me/player/play',
          headers: {
            Authorization: 'Bearer ' + getAccessToken()
          }
        })
      }
      const handleSkipSong = () => {
        axios({
          method: 'post',
          url: 'https://api.spotify.com/v1/me/player/next',
          headers: {
            Authorization: 'Bearer ' + getAccessToken()
          }
        })
      }
      const handleGoBackSong = () => {
        axios({
          method: 'post',
          url: 'https://api.spotify.com/v1/me/player/previous',
          headers: {
            Authorization: 'Bearer ' + getAccessToken()
          }
        })
      }

    return (
        <div>
            <Jumbotron style={{height: "98vh", width: "100vw", marginBottom: "auto", backgroundColor: "#FE4871", boxSizing: "border-box", backgroundSize: "cover"}}>
              <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" ,marginBottom: "6vh", zIndex: 2}}>
            <Avatar/> <p>Host:</p>
                    <h3>Party Name</h3>
                    <Link to="/">
                    <Button variant="warning">Leave party</Button>
                    </Link>
                    </div>
                  {this.state.currentlyPlaying.is_playing  ? 
                  <>
                     
                  <div className="song-contents" >
                     <img  className="song-image"  src={this.state.currentlyPlaying.image} alt="currently playing song name"/>
                  <div style={{display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center"}}>
                <h1 className="song-name">{this.state.currentlyPlaying.name}</h1>
                  <p className="song-artist">{this.state.currentlyPlaying.artist}</p>
                 <Button className="cuue-button" variant="primary">CUUE <AddIcon style={{fontSize: "3vh", marginBottom: "1vh"}}/></Button>
                      <div className="player-controls" >
                      <SkipPreviousIcon id="control-buttons" onClick={()=> handleGoBackSong()}/>
                      <PauseCircleFilledIcon id="control-buttons"  onClick={()=> handlePause()}/>
                      <SkipNextIcon id="control-buttons"  onClick={()=> handleSkipSong()}/>
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
                  <img  className="song-image"  src={this.state.currentlyPlaying.image} alt="currently playing song name"/>
               <div style={{display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center"}}>
             <h1  className="song-name">{this.state.currentlyPlaying.name}</h1>
               <p className="song-artist">{this.state.currentlyPlaying.artist}</p>
              <Button  variant="primary" className="cuue-button">CUUE <AddIcon style={{fontSize: "3vh", marginBottom: "1vh"}}/></Button>
       
              <div className="player-controls">
                <SkipPreviousIcon id="control-buttons"onClick={()=> handleGoBackSong()}/>
                  <PlayCircleFilledIcon  id="control-buttons" onClick={()=> handlePlay()}/>
                  <SkipNextIcon id="control-buttons" onClick={()=> handleSkipSong()}/>
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
};  

export default PartyOptions;
// const PartyOptions = () => {
//   const dispatch = useDispatch();
//   const currentSongData = useSelector(state => state.songData)


//   const FetchData = useCallback(()=> {
//     dispatch(GetCurrentSongData())
//   },[dispatch])

//   useEffect(() => {
//     FetchData()
//   },[FetchData])


//   const ShowData = () => {
//     if(_.isEmpty(currentSongData.data)){
//       console.log(currentSongData)
//       return currentSongData.data.map(song => (
//         <div className="song-contents" >
//                            <img  className="song-image"  alt="currently playing song name"/>
//                         <div style={{display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center"}}>
//       <h1 className="song-name">{song.item.name}</h1>
//                          <p className="song-artist">Song artist Here</p>
//                        <Button className="cuue-button" variant="primary">CUUE <AddIcon style={{fontSize: "3vh", marginBottom: "1vh"}}/></Button>
//                           <div className="player-controls" >
//                              <SkipPreviousIcon id="control-buttons"/>
//                            <PauseCircleFilledIcon id="control-buttons"  />
//                                <SkipNextIcon id="control-buttons" />
//                             </div>
                        
                                
//                            </div>
//                           </div>
//       ))   
//                 }
//                 if (currentSongData.loading){
//       return <p>Loading...</p>
//     }
//     if(currentSongData.errorMsg !== ""){
//     return <p>{currentSongData.errorMsg}</p>
//     }
  
//   }
// return(
//   <div>
//     {ShowData()}
// </div>
// )
// }