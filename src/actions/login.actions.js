import { LOGIN_USER, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE, LOGIN_USER_CANCEL } from '../constants';
import { CLogUser } from '../controllers/login.controller';

export const LoginUser = () => ({
        type:"LOGIN_USER"
    });

export const LoginUserSuccess = (isLoged) => ({
        type:"LOGIN_USER_SUCCESS",
        isLoged:isLoged
    });

export const LoginUserFailure = () => ({
        type:"LOGIN_USER_FAILURE"
    });

export function LogUser(email, pwd) {
    return (dispatch) => {
        dispatch(LoginUser());
        return CLogUser(email, pwd)
        .then((loged) => {
            dispatch(LoginUserSuccess(loged));
        })
        .catch((err) => {
            dispatch(LoginUserFailure());
        });
    };
}
