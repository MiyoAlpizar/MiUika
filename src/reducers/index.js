import { combineReducers } from 'redux';
import LoginReducer from './login.reducer';
import UserReducer from './user.reducer';
import CenterReducer from './center.reducer';
import TheStoresReducer from './stores.reducer';
import TheStoreReducer from './store.reducer';
import UploadFileReducer from './uploadFile.reducer';
import TheProductsReducer from './products.reducer';
import GeolocationReducer from './geolocation.reducer';

export default combineReducers({
    login: LoginReducer,
    user: UserReducer,
    center: CenterReducer,
    thestores: TheStoresReducer,
    thestore: TheStoreReducer,
    uploadFile: UploadFileReducer,
    theproducts: TheProductsReducer,
    geolocation: GeolocationReducer
});
