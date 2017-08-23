import { LOGIN_USER, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE, LOGIN_USER_CANCEL } from '../constants'

const initialState = {
    isLoged: false,
    isLogin: false,
    error: false,
    cancel: false,
    isInit:false
}

export default LoginReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return {
                ...state,
                isLoged: false,
                isLogin: true,
                isInit:true,
                cancel:false,
                error:false,
            }
        case LOGIN_USER_SUCCESS:
            return {
                ...state,
                isLoged: true,
                isLogin: false,
                isInit:false
            }
        case LOGIN_USER_FAILURE:
            return {
                ...state,
                isLogin: false,
                isLoged:false,
                error: true,
                isInit:false,
                cancel:false
            }
         case LOGIN_USER_CANCEL:
            return {
                ...state,
                isLogin: false,
                cancel: true,
                isInit:false
            }
        default:
            return state
    }
}