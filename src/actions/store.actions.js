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
import { CPushStore, CUpdateStore, CUpdateStoreField } from '../controllers/stores.controller';

export const GettingKeyStore = () => ({
        type: GETTING_KEY_STORE
    });

export const GettingKeyStoreSuccess = (key) => ({
        type: GETTING_KEY_STORE_SUCCESS,
        key
    });

export const GettingKeyStoreFailure = (error) => ({
        type: GETTING_KEY_STORE_FAILURE,
        message: error
    });

export function GetKeyStore(center) {
    return (dispatch) => {
        dispatch(GettingKeyStore());
        return CPushStore(center)
            .then((key) => {
                dispatch(GettingKeyStoreSuccess(key));
            }).catch((error) => {
                dispatch(GettingKeyStoreSuccess(error));
            });
    };
}

export const UpdatingStore = () => ({
        type: UPDATING_STORE
    });

export const UpdateStoreSuccess = (key, store) => ({
        type: UPDATING_STORE_SUCCESS,
        key,
        store
    });

export const UpdateStoreFailure = (error) => ({
        type: UPDATING_STORE_FAILURE,
        message: error
    });

export function UpdateStore(center, thekey, datastore) {
    return (dispatch) => {
        dispatch(UpdatingStore());
        return CUpdateStore(center, thekey, datastore)
            .then(([key, store]) => {
                dispatch(UpdateStoreSuccess(key, store));
            }).catch((error) => {
                dispatch(UpdateStoreFailure(error));
            });
    };
}


export const UpdatingFieldStore = () => ({
        type: UPDATING_FIELD_STORE
    });

export const UpdateStoreFieldSuccess = (storeEdited) => ({
        type: UPDATING_FIELD_STORE_SUCCESS,
        storeToEdit: storeEdited
    });

export const UpdateStoreFieldFailure = (error) => ({
        type: UPDATING_FIELD_STORE_FAILURE,
        message: error
    });

export function UpdateStoreField(center, key, field, value, storeToEdit, isImage = false) {
    return (dispatch) => {
        dispatch(UpdatingFieldStore());
        return CUpdateStoreField(center, key, field, value, storeToEdit, isImage)
            .then((storeEdited) => {
                dispatch(UpdateStoreFieldSuccess(storeEdited));
            }).catch((error) => {
                dispatch(UpdateStoreFieldFailure(error));
            });
    };
}

