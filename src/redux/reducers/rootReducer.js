import {combineReducers} from 'redux'
import currentSongDataReducer from './currentSongDataReducer';
import userInfoReducer from './userInfoReducer';


const rootReducer = combineReducers({
    songData: currentSongDataReducer,
    userData: userInfoReducer
})
export default rootReducer;