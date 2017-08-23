import { GETTING_STORES, GETTING_STORES_SUCCESS, GETTING_STORES_FAILURE } from '../constants';

const initialState = {
    isLoading: false,
    error: false,
    stores: null,
    liststores: null,
    message: '',
    isEmpty: false,
    reloadList: false
};

export default TheStoresReducer = (state = initialState, action) => {
    switch (action.type) {
        case GETTING_STORES:
            return {
                ...state,
                isLoading: true,
                error: false,
                message: ''
            };
        case GETTING_STORES_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: false,
                message: '',
                stores: action.stores,
                liststores: action.stores,
                isEmpty: action.stores == null,
                reloadList: false
            };
        case GETTING_STORES_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: true,
                message: action.message,
                reloadList: false
            };
        default:
            return state;
    }
};
