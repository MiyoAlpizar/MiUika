import { GETTING_LOCATION, GETTING_LOCATION_SUCCESS, GETTING_LOCATION_FAILURE } from '../constants';
import { CGetLocation } from '../controllers/geolocation.controller';

export const GettinLocation = () => ({
        type: GETTING_LOCATION
    });

export const GettinLocationSuccess = (region) => ({
        type: GETTING_LOCATION_SUCCESS,
        region
    });

export const GettinLocationFailure = (error) => ({
        type: GETTING_LOCATION_FAILURE,
        error: true,
        message: error.message
    });

export function GetLocation() {
    return (dispatch) => {
        dispatch(GettinLocation());
        return CGetLocation()
        .then((region) => {
            dispatch(GettinLocationSuccess(region));
        }).catch((error) => {
            dispatch(GettinLocationFailure(error));
        });
    };
}
