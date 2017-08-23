import { GETTING_STORES, GETTING_STORES_SUCCESS, GETTING_STORES_FAILURE } from '../constants';
import { GetCenterStores } from '../controllers/stores.controller';

export const GettingStores = () => ({
        type: GETTING_STORES
    });

export const GettingStoresSuccess = (stores) => ({
        type: GETTING_STORES_SUCCESS,
        stores
    });

export const GettingStoresFailure = (error) => ({
        type: GETTING_STORES_FAILURE,
        message: error
    });

export function GetStores(center) {
    return (dispatch) => {
        dispatch(GettingStores());
        return GetCenterStores(center)
            .then((stores) => {
                dispatch(GettingStoresSuccess(stores));
            }).catch((error) => {
                dispatch(GettingStoresFailure(error));
            });
    };
} 
