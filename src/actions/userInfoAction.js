import axios from 'axios'
import queryString from 'query-string'


const GetUserInfo = async (dispatch, getState) => {

    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    if(!accessToken)
    return;
    const res = await axios.get('https://api.spotify.com/v1/me', {
        headers: {'Authorization': 'Bearer ' + accessToken}
      })
        dispatch({
            type: "USER_INFO_DATA_LOADING" 
        });
       
          dispatch({
            type: "USER_INFO_DATA_SUCCESS" ,
            payload: res.data
        });
        dispatch({
            type: "USER_INFO_DATA_FAILED"
        });


}
export default GetUserInfo;