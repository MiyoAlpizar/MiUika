import {
    GETTING_KEY_STORE,
    GETTING_KEY_STORE_SUCCESS,
    GETTING_KEY_STORE_FAILURE,
    UPDATING_STORE,
    UPDATING_STORE_SUCCESS,
    UPDATING_STORE_FAILURE,
    UPDATING_FIELD_STORE,
    UPDATING_FIELD_STORE_SUCCESS,
    UPDATING_FIELD_STORE_FAILURE
} from '../constants';


const initialState = {
    error: false,
    key: null,
    isGettingKey: false,
    isUpdating: false,
    store: null,
    message: '',
    bussy: false,
    storeToPlay: {
        key: '',
        description: '',
        name: '',
        service_extra: '0',
        products_description: '',
        img: '',
        active: true
    },
    storeToEdit: {
        key: '',
        description: '',
        name: '',
        service_extra: '0',
        products_description: '',
        img: '',
        active: true
    }
};

export default TheStoreReducer = (state = initialState, action) => {
    switch (action.type) {
        case GETTING_KEY_STORE:
            return {
                ...state,
                error: false,
                message: '',
                isGettingKey: true,
                isUpdating: false,
                bussy: true
            };
        case GETTING_KEY_STORE_SUCCESS:
            return {
                ...state,
                error: false,
                message: '',
                store: action.store,
                key: action.key,
                isGettingKey: false,
                isUpdating: false,
                bussy: false
            };
        case GETTING_KEY_STORE_FAILURE:
            return {
                ...state,
                error: true,
                message: action.message,
                isGettingKey: false,
                isUpdating: false,
                bussy: false
            };
        case UPDATING_STORE:
            return {
                ...state,
                isUpdating: true,
                bussy: true
            };
        case UPDATING_STORE_SUCCESS:
            return {
                ...state,
                isUpdating: false,
                key: action.key,
                store: action.store,
                bussy: false
            };
        case UPDATING_STORE_FAILURE:
            return {
                ...state,
                error: true,
                message: action.message,
                isGettingKey: false,
                isUpdating: false,
                bussy: false
            };
        case UPDATING_FIELD_STORE:
            return {
                ...state,
                isUpdating: true,
                bussy: true
            };
        case UPDATING_FIELD_STORE_SUCCESS:
            return {
                ...state,
                isUpdating: false,
                bussy: false,
                storeToEdit: action.storeToEdit
            };
        case UPDATING_FIELD_STORE_FAILURE:
            return {
                ...state,
                error: true,
                message: action.message,
                isGettingKey: false,
                isUpdating: false,
                bussy: false
            };
        default:
            return state;
    }
};
