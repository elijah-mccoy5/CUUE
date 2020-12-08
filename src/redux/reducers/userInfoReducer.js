const initialState = {
  user: {}
}
const userInfoReducer = (state = initialState, action) => {
    switch(action.type){
        case "USER_INFO_DATA_LOADING":
        return {
           user: action.payload
        }
        default:
            return state
    }
}
export default userInfoReducer;