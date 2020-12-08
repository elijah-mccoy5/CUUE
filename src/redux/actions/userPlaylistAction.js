import axios from 'axios'
import queryString from 'query-string'


const GetUserPlaylist = async (dispatch, getState) => {

    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    if(!accessToken)
    return;
    const res = await axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: {'Authorization': 'Bearer ' + accessToken}
      })
        dispatch({
            type: "PLAYLIST_DATA_LOADING" 
        });
       
          dispatch({
            type: "PLAYLIST_DATA_SUCCESS" ,
            payload: res.data
        });
        dispatch({
            type: "PLAYLIST_DATA_FAILED"
        });


}
export default GetUserPlaylist;