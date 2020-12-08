import axios from 'axios'

function getAccessToken(){
    return localStorage.getItem('access_token');
  }
  
const GetCurrentSongData = () => {
    return async (dispatch, getState) =>{
        const res = await axios.get('https://api.spotify.com/v1/me/player/currently-playing',{      
            headers: {'Authorization': 'Bearer ' + getAccessToken() }
          })
          dispatch({
            type: "CURRENT_SONG_DATA_LOADING" 
        });
        dispatch({
            type: "CURRENT_SONG_DATA_LOADING" 
        });
      
        dispatch({
            type: "CURRENT_SONG_DATA_SUCCESS" ,
            payload: res.data
        });
        dispatch({
            type: "CURRENT_SONG_DATA_FAIL"
        });
    }
            
   

}
export default GetCurrentSongData;