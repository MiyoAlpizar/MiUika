import {
    GETTING_CENTER_DATA,
    GETTING_CENTER_DATA_SUCCESS,
    GETTING_CENTER_DATA_FAILURE, UPDATING_CENTER_DATA,
    GET_CENTER_DATA,
    UPDATING_CENTER_DATA_SUCCESS,
    UPDATING_CENTER_DATA_FAILURE
} from '../constants';

const initialState = {
    isLoading: false,
    error: false,
    center: null,
    key: '',
    message: '',
    isUpdating: false,
    gotUpdate: false,
    isBussy: false
};

export default CenterReducer = (state = initialState, action) => {
    switch (action.type) {
        case GETTING_CENTER_DATA:
            return {
                ...state,
                isLoading: true,
                error: false,
                isBussy: true
            };
        case GETTING_CENTER_DATA_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: false,
                center: action.center,
                key: action.key,
                isBussy: false
            };
        case GETTING_CENTER_DATA_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: true,
                message: action.message,
                isBussy: false
            };
        case UPDATING_CENTER_DATA:
            return {
                ...state,
                isUpdating: true,
                error: false,
                message: '',
                gotUpdate: false,
                isBussy: true
            };
        case UPDATING_CENTER_DATA_SUCCESS:
            return {
                ...state,
                isUpdating: false,
                gotUpdate: true,
                message: '',
                isBussy: false
            };
        case UPDATING_CENTER_DATA_FAILURE:
            return {
                ...state,
                isUpdating: false,
                gotUpdate: false,
                error: true,
                message: action.message,
                isBussy: false
            };
        case GET_CENTER_DATA:
            return {
                ...state
            };
        default:
            return state;
    }
};

