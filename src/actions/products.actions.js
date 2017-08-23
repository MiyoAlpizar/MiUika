import {
    GETTING_PRODUCTS_STORE,
    GETTING_PRODUCTS_STORE_SUCCESS,
    GETTING_PRODUCTS_STORE_ERROR,
    GETTING_KEY_PRODUCT,
    GETTING_KEY_PRODUCT_SUCCESS,
    GETTING_KEY_PRODUCT_ERROR,
    UPDATING_PRODUCT,
    UPDATING_PRODUCT_SUCCESS,
    UPDATING_PRODUCT_ERROR,
    UPDATING_PRODUCT_FIELD,
    UPDATING_PRODUCT_FIELD_SUCCESS,
    UPDATING_PRODUCT_FIELD_ERROR
} from '../constants';

import {
    CGetProductsStore,
    CPushProduct,
    CUpdateProduct,
    CUpdateProductField
} from '../controllers/products.controller';

export const GettingProductsStores = () => ({
        type: GETTING_PRODUCTS_STORE
    });

export const GettingProductsStoresSuccess = (products) => ({
        type: GETTING_PRODUCTS_STORE_SUCCESS,
        products
    });

export const GettingProductsStoresError = (error) => ({
        type: GETTING_PRODUCTS_STORE_ERROR,
        message: error
    });

export function GetProductsStore(center, store) {
    return (dispatch) => {
        dispatch(GettingProductsStores());
        return CGetProductsStore(center, store)
            .then((products) => {
                dispatch(GettingProductsStoresSuccess(products));
            }).catch((error) => {
                dispatch(GettingProductsStoresError(error));
            });
    };
} 

export const GettingKeyProduct = () => ({
        type: GETTING_KEY_PRODUCT
    });

export const GettingKeyProductSuccess = (key) => ({
        type: GETTING_KEY_PRODUCT_SUCCESS,
        key
    });

export const GettingKeyProductFailure = (error) => ({
        type: GETTING_KEY_PRODUCT_ERROR,
        message: error
    });

export function GetKeyProduct(center, store) {
    return (dispatch) => {
        dispatch(GettingKeyProduct());
        return CPushProduct(center, store)
            .then((key) => {
                dispatch(GettingKeyProductSuccess(key));
            }).catch((error) => {
                dispatch(GettingKeyProductSuccess(error));
            });
    };
}

export const UpdatingProduct = () => ({
        type: UPDATING_PRODUCT
    });

export const UpdateProductSuccess = (key, productUpdated) => ({
        type: UPDATING_PRODUCT_SUCCESS,
        key,
        productUpdated
    });

export const UpdateProductFailure = (error) => ({
        type: UPDATING_PRODUCT_ERROR,
        message: error
    });

export function UpdateProduct(center, store, thekey, datastore) {
    return (dispatch) => {
        dispatch(UpdatingProduct());
        return CUpdateProduct(center, store, thekey, datastore)
            .then(([key, thestore]) => {
                dispatch(UpdateProductSuccess(key, thestore));
            }).catch((error) => {
                dispatch(UpdateProductFailure(error));
            });
    };
}


export const UpdatingFieldProduct = () => ({
        type: UPDATING_PRODUCT_FIELD
    });

export const UpdateProductFieldSuccess = (productUpdated) => ({
        type: UPDATING_PRODUCT_FIELD_SUCCESS,
        productUpdated
    });

export const UpdateProductFieldFailure = (error) => ({
        type: UPDATING_PRODUCT_FIELD_ERROR,
        message: error
    });

export function UpdateProductField(center, store, key, field, value, storeToEdit, isImage = false) {
    return (dispatch) => {
        dispatch(UpdatingFieldProduct());
        return CUpdateProductField(center, store, key, field, value, storeToEdit, isImage)
            .then((storeEdited) => {
                dispatch(UpdateProductFieldSuccess(storeEdited));
            }).catch((error) => {
                dispatch(UpdateProductFieldFailure(error));
            });
    };
}
