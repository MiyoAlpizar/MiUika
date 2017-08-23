import {GETTING_USER_DATA,GETTING_USER_DATA_SUCCESS,GETTING_USER_DATA_FAILURE,VALIDATING_USER,VALIDATING_USER_FAILURE,VALIDATING_USER_SUCCESS,GETTIN_STORAGE_USER_DATA,GETTIN_STORAGE_USER_DATA_SUCCESS,GETTIN_STORAGE_USER_DATA_FAILURE} from '../constants'
import {GetCurrentUser,GetUserStorage,GetUserData} from '../controllers/user.controller'

//Validatin User
export const ValidatingUser = () => {
    return {
        type: VALIDATING_USER
    }
}

export const ValidatingUserSuccess = (user) => {
    return {
        type: VALIDATING_USER_SUCCESS,
        user
    }
}

export const ValidatingUserFailure = () => {
    return {
        type: VALIDATING_USER_FAILURE
    }
}

export function ValidateUser() {
    return (dispatch) => {
        dispatch(ValidatingUser())
        return GetCurrentUser()
            .then((user) => {
                dispatch(ValidatingUserSuccess(user))
            }).catch((error) => {
                dispatch(ValidatingUserFailure())
            })
    }
}

//Getting User Storage SetUserInfo
export const GettingStorageInfo = () => {
    return {
        type: GETTIN_STORAGE_USER_DATA
    }
}

export const GettingStorageInfoSuccess = (user) => {
    return {
        type: GETTIN_STORAGE_USER_DATA_SUCCESS,
        userStorage:user
    }
}

export const GettingStorageInfoFailure = () => {
    return {
        type: GETTIN_STORAGE_USER_DATA_FAILURE
    }
}

export function GetStorageUserInfo() {
    return (dispatch) => {
        dispatch(GettingStorageInfo())
        return GetUserStorage()
            .then((user) => {
                dispatch(GettingStorageInfoSuccess(user))
            }).catch(error => dispacth(GettingStorageInfoFailure()))
    }
}

//Geting User Info
export const GettingUserInfo = ()=>{
    return{
        type: GETTING_USER_DATA
    }
}

export const GettingUserInfoSuccess = (userInfo) => {
    return{
        type: GETTING_USER_DATA_SUCCESS,
        userInfo:userInfo
    }
}

export const GettingUserInfoFailure = (error) =>{
    return{
        type: GETTING_USER_DATA_FAILURE,
        errorMessage:error
    }
}

export function GetUserInfo() {
    return (dispatch) => {
        dispatch(GettingUserInfo())
        return GetUserData()
        .then((userInfo)=>{
            dispatch(GettingUserInfoSuccess(userInfo))
        })
        .catch((error) => dispatch(GettingUserInfoFailure(error)))
    }
}
