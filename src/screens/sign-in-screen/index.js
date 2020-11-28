import React from 'react';
import {auth } from '../../firebase'
import {db } from '../../firebase'
import { encode as btoa } from 'base-64';
import SpotifyWebAPI from 'spotify-web-api-js';
import { Button, Card } from 'react-bootstrap';
import spotify from '../../assets/spotify.png';
import logo from '../../assets/Jukebox_Fixed.png';


const scopesArr = ['user-modify-playback-state','user-read-currently-playing','user-read-playback-state','user-library-modify',
                   'user-library-read','playlist-read-private','playlist-read-collaborative','playlist-modify-public',
                   'playlist-modify-private','user-read-recently-played','user-top-read'];
const scopes = scopesArr.join(' ');



const getSpotifyCredentials = async () => {
    return {
    clientId:'24ee46b7be184b5eac0b50e6e3a5c271',
    clientSecret:'47536ed52288486bb0cb1e7620aa369f',
    redirectUri: auth.getRedirectUrl()}
  }
  const getAuthorizationCode = async () => {
    let result = '';
    try {
      const credentials = await getSpotifyCredentials() //we wrote this function above
      const redirectUrl = auth.getRedirectUrl(); //this will be something like https://auth.expo.io/@your-username/your-app-slug
      result = await auth.startAsync({
        authUrl:
          'https://accounts.spotify.com/authorize' +
          '?response_type=code' +
          '&client_id=' +
          credentials.clientId +
          (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
          '&redirect_uri=' +
          encodeURIComponent(redirectUrl),
      })
    } catch (err) {
      console.error(err)
    }
    return result.params.code
  }

const setUserData= async (key, item) => {
  try {
      //we want to wait for the Promise returned by localStorage.setItem()
      //to be resolved to the actual value before returning the value
      var jsonOfItem = await localStorage.setItem(key, JSON.stringify(item));
      return jsonOfItem;
  } catch (error) {
    console.log(error.message);
  }
}

const getUserData = async (key)=> {
  try {
    const retrievedItem =  await localStorage.getItem(key);
    const item = JSON.parse(retrievedItem);
    return item;
  } catch (error) {
    console.log(error.message);
  }
  return
}





const getTokens = async () => {
  try {
    const authorizationCode = await getAuthorizationCode() //we wrote this function above
    const credentials = await getSpotifyCredentials() //we wrote this function above (could also run this outside of the functions and store the credentials in local scope)
    const credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`);
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credsB64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${
        credentials.redirectUri
      }`,
    });
    const responseJson = await response.json();
    // destructure the response and rename the properties to be in camelCase to satisfy my linter ;)
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    } = responseJson;
    const expirationTime = new Date().getTime() + expiresIn * 1000;
    await setUserData('accessToken', accessToken);
    await setUserData('refreshToken', refreshToken);
    await setUserData('expirationTime', expirationTime);
  } catch (err) {
    console.error(err);
  }
}

export const refreshTokens = async () => {
  try {
    const credentials = await getSpotifyCredentials()
    const credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`);
    const refreshToken = await getUserData('refreshToken');
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credsB64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });
    const responseJson = await response.json();
    if (responseJson.error) {
      await getTokens();
    } else {
      const {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_in: expiresIn,
      } = responseJson;

      const expirationTime = new Date().getTime() + expiresIn * 1000;
      await setUserData('accessToken', newAccessToken);
      if (newRefreshToken) {
        await setUserData('refreshToken', newRefreshToken);
      }
      await setUserData('expirationTime', expirationTime);
  }
 } catch (err) {
    console.error(err)
  }
}



export const getValidSPObj = async () => {
  const tokenExpirationTime = await getUserData('expirationTime');
  if (new Date().getTime() > tokenExpirationTime) {
    // access token has expired, so we need to use the refresh token
    await refreshTokens();
  }
  const accessToken = await getUserData('accessToken');
  var sp = new SpotifyWebAPI();
  await sp.setAccessToken(accessToken);
  await setUserData('spotify_obj', sp);
  return sp;
}
export const getUserPlaylists = async () => {
  const sp = await getValidSPObj();
  const { id: userId } = await sp.getMe();
  const { items: playlists } = await sp.getUserPlaylists(userId, { limit: 50 });
  console.log(playlists)
  return playlists;
};
export const getQuery = async () => {
  const sp = await getValidSPObj();
  const item = await sp.searchTracks("hello", {limit: 5}).then(function(data) {
    console.log('Artist: ', data.tracks.items[0].artists[0].name);
    console.log('Artist: ', data.tracks.items[1].artists[0].name);
    console.log('Artist: ', data.tracks.items[2].artists[0].name);
  })
};
//
export const getQuery2 = async () => {
  const sp = await getValidSPObj();
  const item = await sp.getMyCurrentPlayingTrack().then(function(data) {
    console.log('Artist: ', data);
  })
};
//Get playlist by id
export const getQuery3 = async () => {
  const sp = await getValidSPObj();
  const item = await sp.getPlaylist('6ZQKZNrw7rqQeWZ9iiEO5y').then(function(data) {
    console.log('Artist: ', data);
  })
};
//Ger username
export const getQuery4 = async () => {
  const sp = await getValidSPObj();
  const item = await sp.getMe().then(function(data) {
    //console.log(data.display_name);
    //console.log(data.id);
    return data;
  })
  return item;
};

const SignIn = ({navigation}) => {


    return (
        <div>
            <Card>
        <img
          style={{width: 160, height: 160, marginTop: "20%", marginBottom: 40}}
          src={logo} 
       alt="Logo"
       />
        <span>
          Connect!
          </span>
        <Button 
        variant="light" size="lg"
        style={{marginTop: "5vh"}}
          onClick={() => {
            getTokens().then(getValidSPObj).then(async function(){
              const data = await getQuery4();
              console.log(data.images)
              if (data.images.length === 0){
                console.log('hello')
                db.ref('/users/'+data.id+'/').set({
                  name: data.display_name,
                  profile_picture: 'https://i.stack.imgur.com/l60Hf.jpeg'
            }).then(window.pp='https://i.stack.imgur.com/l60Hf.jpeg').then(window.name=data.display_name).then(async function(){await navigation.navigate('Home')})
              }
              else{
                
                db.ref('/users/'+data.id+'/').set({
                  name: data.display_name,
                  profile_picture: data.images[0].url
            }).then(window.pp=data.images[0].url).then(window.name=data.display_name).then(async function(){await navigation.navigate('Home')})
              }

   })
          }}
        ><img style={{ width: "3vw",}} className="mr-4" src={spotify} alt="spotify icon"/> Get connected with Spotify</Button>
        </Card>
        </div>
    );
};

export default SignIn;