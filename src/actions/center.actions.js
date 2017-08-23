import {
    GETTING_CENTER_DATA,
    GETTING_CENTER_DATA_SUCCESS,
    GETTING_CENTER_DATA_FAILURE,
    GET_CENTER_DATA,
    UPDATING_CENTER_DATA,
    UPDATING_CENTER_DATA_SUCCESS,
    UPDATING_CENTER_DATA_FAILURE,
} from '../constants';
import {
    GetCenterInfo,
    UpdateCenterInfo,
    GetStorageCenterData,
    CUpdateCenterLocation,
    CUpdateCenter
} from '../controllers/center.controller';

export const GettingCenterData = () => ({
    type: GETTING_CENTER_DATA
});

export const GettingCenterDataSuccess = (center, key) => ({
    type: GETTING_CENTER_DATA_SUCCESS,
    center,
    key
});

export const GettingCenterDataFailure = (message) => ({
    type: GETTING_CENTER_DATA_FAILURE,
    message
});

export const GetCenterData = () => ({
    type: GET_CENTER_DATA
});

export function GetTheCenter() {
    return (dispatch) => {
        dispatch(GetCenterData());
    };
}

export function GetCenter() {
    return (dispatch) => {
        dispatch(GettingCenterData());
        return GetCenterInfo()
            .then(([center, key]) => {
                dispatch(GettingCenterDataSuccess(center, key));
            }).catch((error) => {
                dispatch(GettingCenterDataFailure(error));
            });
    };
}

export const UpdatingCenterData = () => ({
    type: UPDATING_CENTER_DATA
});

export const UpdatingCenterDataSuccess = () => ({
    type: UPDATING_CENTER_DATA_SUCCESS
});

export const UpdatingCenterDataFailure = (message) => ({
    type: UPDATING_CENTER_DATA_FAILURE,
    message
});

export function UpdateCenterData(uid, field, value) {
    return (dispatch) => {
        dispatch(UpdatingCenterData());
        return UpdateCenterInfo(uid, field, value)
            .then(() => {
                dispatch(GetCenter());
                dispatch(UpdatingCenterDataSuccess());
            })
            .catch((error) => {
                dispatch(UpdatingCenterDataFailure(error));
            });
    };
}

export const GettingCenterStorage = () => ({
    type: GETTING_CENTER_DATA
});

export function GetCenterStorage() {
    return (dispatch) => {
        dispatch(GettingCenterStorage());
        return GetStorageCenterData()
            .then(([center, key]) => {
                dispatch(GettingCenterDataSuccess(center, key));
            }).catch((error) => {
                dispatch(GettingCenterDataFailure(error));
            });
    };
}

export function UpdateCenterLocation(center, region) {
    return (dispatch) => {
        dispatch(UpdatingCenterData());
        return CUpdateCenterLocation(center, region)
            .then(() => {
                dispatch(GetCenter());
                dispatch(UpdatingCenterDataSuccess());
            })
            .catch((error) => {
                dispatch(UpdatingCenterDataFailure(error));
            });
    };
}

export function UpdateCenter(center, centerdata) {
    return (dispatch) => {
        dispatch(UpdatingCenterData());
        return CUpdateCenter(center, centerdata)
            .then(() => {
                dispatch(GetCenter());
                dispatch(UpdatingCenterDataSuccess());
            })
            .catch((error) => {
                dispatch(UpdatingCenterDataFailure(error));
            });
    };
}
