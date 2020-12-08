const initalState = {
    loading: false,
    data: [],
    errorMsg: ''
}
const userPlaylistReducer = (state = initalState, action ) => {
    switch(action.type){
        case "PlAYLIST_DATA_LOADING":
            return {
                ...state,
                loading: true,
                errorMsg: ''
            }
            case "PlAYLIST_DATA_SUCCESS":
                return{
                    ...state,
                    laoding: false,
                    data: action.payload,
                    errorMsg: 'Unable to get Playlist'
                }
                case "PlAYLIST_DATA_FAIL":
                    return{
                        ...state,
                        laoding: false,
                        errorMsg: ''
                    }
                default:
                    return state
    }
};

export default userPlaylistReducer;