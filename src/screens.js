import { Navigation } from 'react-native-navigation';

import NavBar from '../components/NavBar';
import Login from '../start/login';
import Home from '../home/home';
import UpdateSettings from '../settings/updateSettings';
import LeftMenu from '../settings/leftMenu';
import Stores from '../stores/stores';
import AEStore from '../stores/aestore';
import StoreProducts from '../products/storeProducts';
import AEProduct from '../products/aeproduct';
import KmBase from '../settings/kmBase';
import Profile from '../profile/profile';

export function registerScreens(store, Provider) {
    Navigation.registerComponent('NavBar', () => NavBar, store, Provider);
    Navigation.registerComponent('Login', () => Login, store, Provider);
    Navigation.registerComponent('Home', () => Home, store, Provider);
    Navigation.registerComponent('LeftMenu', () => LeftMenu, store, Provider);
    Navigation.registerComponent('UpdateSettings', () => UpdateSettings, store, Provider);
    Navigation.registerComponent('Stores', () => Stores, store, Provider);
    Navigation.registerComponent('AEStore', () => AEStore, store, Provider);
    Navigation.registerComponent('StoreProducts', () => StoreProducts, store, Provider);
    Navigation.registerComponent('AEProduct', () => AEProduct, store, Provider);
    Navigation.registerComponent('KmBase', () => KmBase, store, Provider);
    Navigation.registerComponent('Profile', () => Profile, store, Provider);
}
