const initalState = {
    loading: false,
    data: [],
    errorMsg: ''
}
const currentSongDataReducer = (state = initalState, action ) => {
    switch(action.type){
        case "CURRENT_SONG_DATA_LOADING":
            return {
                ...state,
                loading: true,
                errorMsg: ''
            }
            case "CURRENT_SONG_DATA_SUCCESS":
                return{
                    ...state,
                    laoding: false,
                    data: action.payload,
                    errorMsg: 'Unable to get currently playing song'
                }
                case "CURRENT_SONG_DATA_FAIL":
                    return{
                        ...state,
                        laoding: false,
                        errorMsg: ''
                    }
                default:
                    return state
    }
};

export default currentSongDataReducer;