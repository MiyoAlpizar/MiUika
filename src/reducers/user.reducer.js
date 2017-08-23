import {GETTING_USER_DATA,GETTING_USER_DATA_SUCCESS,GETTING_USER_DATA_FAILURE,VALIDATING_USER,VALIDATING_USER_SUCCESS,VALIDATING_USER_FAILURE} from '../constants'

const initialState = {
    user: null,
    isValidating: false,
    error: false,
    isLoginOut: false,
    isOut: false,
    isSaving: false,
    isGettingInfo: false,
    userStorage: null,
    userInfo:null,
    isLoading:false,
    errorMessage:''
}

export default UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case VALIDATING_USER:
            return {
                ...state,
                isValidating: true
            }
        case VALIDATING_USER_SUCCESS:
            return {
                ...state,
                user: action.user,
                isValidating: false
            }
        case VALIDATING_USER_FAILURE:
            return {
                ...state,
                isValidating: false,
                error: true
            }
        case GETTING_USER_DATA:
            return{
                ...state,
                isLoading:true,
                error:false
            }
        case GETTING_USER_DATA_SUCCESS:
            return{
                ...state,
                isLoading:false,
                error:false,
                userInfo:action.userInfo
            }
        case GETTING_USER_DATA_FAILURE:
            return{
                ...state,
                isLoading:false,
                error:true,
                errorMessage:action.errorMessage
            }
        default:
            return state
    }
}
