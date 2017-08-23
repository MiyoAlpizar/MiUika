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

const initialState = {
    isLoading: false,
    error: false,
    products: null,
    listproducts: null,
    message: '',
    isEmpty: false,
    reloadList: false,
    newKey: '',
    isBussy: false,
    productToPlay: {
        key: '',
        active: true,
        center: '',
        cost: 0,
        description: '',
        img: '',
        name: '',
        price: 0,
        price_a12: 0,
        store: ''
    },
    productToEdit: {
        key: '',
        active: true,
        center: '',
        cost: 0,
        description: '',
        img: '',
        name: '',
        price: 0,
        price_a12: 0,
        store: ''
    }
};

export default TheProductsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GETTING_PRODUCTS_STORE :
            return {
                ...state,
                isLoading: true,
                error: false,
                message: '',
                isBussy: true
            };
        case GETTING_PRODUCTS_STORE_SUCCESS :
            return {
                ...state,
                isLoading: false,
                error: false,
                message: '',
                products: action.products,
                listproducts: action.products,
                reloadList: false,
                isEmpty: action.products === null,
                isBussy: false
            };
        case GETTING_PRODUCTS_STORE_ERROR :
            return {
                ...state,
                isLoading: false,
                error: true,
                message: action.message,
                reloadList: false,
                isEmpty: action.products === null,
                isBussy: false
            };
        case GETTING_KEY_PRODUCT :
            return {
                ...state,
                error: false,
                isBussy: true
            };
        case GETTING_KEY_PRODUCT_SUCCESS :
            return {
                ...state,
                error: false,
                isBussy: false,
                newKey: action.key
            };
        case GETTING_KEY_PRODUCT_ERROR :
            return {
                ...state,
                error: true,
                isBussy: false,
                newKey: null,
                message: action.message
            };
        case UPDATING_PRODUCT :
            return {
                ...state,
                error: false,
                isBussy: true
            };
        case UPDATING_PRODUCT_SUCCESS :
            return {
                ...state,
                error: false,
                isBussy: false,
                reloadList: true
            };
        case UPDATING_PRODUCT_ERROR :
            return {
                ...state,
                error: true,
                isBussy: false,
                message: action.message
            };
        case UPDATING_PRODUCT_FIELD :
            return {
                ...state,
                error: false,
                isBussy: true
            };
        case UPDATING_PRODUCT_FIELD_SUCCESS :
            return {
                ...state,
                error: false,
                isBussy: false,
                reloadList: true,
                productToEdit: action.productUpdated
            };
        case UPDATING_PRODUCT_FIELD_ERROR :
            return {
                ...state,
                error: true,
                isBussy: false,
                message: action.message
            };
        default:
            return state;
    }
};
