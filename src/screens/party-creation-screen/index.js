import React, { Component, useEffect, useCallback } from 'react';
import queryString from 'query-string'; 
import { Card , Jumbotron, Button} from 'react-bootstrap';
import ClearIcon from '@material-ui/icons/Clear';
import { Avatar } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SearchPlaylist from '../search-playlist-screen';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import spotify from '../../assets/spotify.png'
import {useDispatch, useSelector} from 'react-redux'
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import _ from 'lodash'
import GetUserInfo from '../../actions/userInfoAction'




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
      localStorage.setItem('user', this.state.user)
      localStorage.setItem('access_token', accessToken)
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
          <div style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#25283D",backgroundSize: "cover"}}>
              <Card className="playlist-card" style={{  backgroundColor: "#25283D", width: "100vw", height: "100%",display: "flex", flexDirection: "row", top: 0}}>
                  <Card.Body>
                      <Card >
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
          </div> :  <div style={{backgroundColor: "#FE4871", width: "100vw", height: "100vh", alignItems: 'center', justifyContent: "center", display: "flex"}}>
            <Button onClick={() => {
            window.location = window.location.href.includes('localhost') 
            ? 
            'http://localhost:8888/login'
            : 'https://cuue-web-backend.herokuapp.com/login'
        }} variant="light" size="lg" style={{ alignSelf: "center"}}>
            <img style={{ width: "3vw",}} className="mr-4 dash-button" src={spotify} alt="spotify icon"/>Connect with Spotify
            </Button> 
          
        </div>
    }  
     </div>
          );
        }
      }

      export default PartyCreation;
      
   // const PartyCreation = () => {
        //     const dispatch = useDispatch();
        //     const userInfoData = useSelector(state => state.u)
          
          
        //     const FetchData = useCallback(()=> {
        //       dispatch(GetUserInfo())
        //     },[dispatch])
          
        //     useEffect(() => {
        //       FetchData()
        //     },[FetchData])
          
          
        //     const ShowData = () => {
        //       if(_.isEmpty(userInfoData)){
        //         console.log(userInfoData)
        //         return userInfoData.data.map(song => (
        //           <div className="song-contents" >
        //                              <img  className="song-image"  alt="currently playing song name"/>
        //                           <div style={{display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center"}}>
        //         <h1 className="song-name">{song.item.name}</h1>
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
        //                   if (userInfoData.loading){
        //         return <p>Loading...</p>
        //       }
        //       if(userInfoData.errorMsg !== ""){
        //       return <p>{userInfoData.errorMsg}</p>
        //       }
            
        //     }
        //   return(
        //     <div>
        //       {ShowData()}
        //   </div>
        //   )
        // }
        // export default PartyCreation;