import { GETTING_LOCATION, GETTING_LOCATION_SUCCESS, GETTING_LOCATION_FAILURE } from '../constants';

const initialState = {
    isLoading: false,
    error: false,
    region: null,
    message: ''
};

export default GeolocationReducer = (state = initialState, action) => {
    switch (action.type) {
        case GETTING_LOCATION:
            return {
                ...state,
                isLoading: true,
                error: false
            };
        case GETTING_LOCATION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                region: action.region,
                error: false
            };
        case GETTING_LOCATION_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: true
            };
        default:
            return state;
    }
};
