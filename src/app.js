import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import { registerScreens } from './screens';
import configureStore from './configureStore';
import colors from '../globals/colors.global';
import { iconsMap, iconsLoaded } from '../globals/icons';
import firebase from '../libs/firebase';

const store = configureStore();

registerScreens(store, Provider);
firebase.init();
iconsLoaded.then(() => {
   startApp();
});

function startApp() {
    Navigation.startTabBasedApp({
        tabs: [
            {
                label: 'Inicio',
                screen: 'Home',
                icon: iconsMap['ios-home-outline'],
                selectedIcon: iconsMap['ios-home'],
                title: '',
                navigatorStyle: {
                    navBarButtonColor: colors.Primary,
                    navBarTranslucent: true,
                    navBarNoBorder: false,
                    drawUnderNavBar: true,
                    drawUnderTabBar: true,
                    statusBarBlur: false,
                    navBarBlur: false,
                    navBarHidden: true,
                }
            },
            {
                label: 'Negocios',
                screen: 'Stores',
                title: 'Negocios',
                icon: iconsMap['ios-paper-outline'],
                selectedIcon: iconsMap['ios-paper'],
                navigatorStyle: {
                    navBarButtonColor: colors.Primary,
                    navBarTranslucent: true,
                    navBarNoBorder: false,
                    drawUnderNavBar: true,
                    drawUnderTabBar: true,
                    statusBarBlur: false,
                    navBarBlur: false,
                    navBarHidden: true
                }
            },
            {
                label: 'Otros',
                screen: 'Home',
                title: 'Otros',
                icon: iconsMap['ios-cube-outline'],
                selectedIcon: iconsMap['ios-cube'],
                navigatorStyle: {
                    navBarButtonColor: colors.Primary,
                    navBarTranslucent: true,
                    navBarNoBorder: false,
                    drawUnderNavBar: true,
                    drawUnderTabBar: true,
                    statusBarBlur: false,
                    navBarBlur: false
                }
            },
            {
                label: 'Notificaciones',
                screen: 'Home',
                title: 'Notificaciones',
                icon: iconsMap['ios-time-outline'],
                selectedIcon: iconsMap['ios-time'],
                navigatorStyle: {
                    navBarButtonColor: colors.Primary,
                    navBarTranslucent: true,
                    navBarNoBorder: false,
                    drawUnderNavBar: true,
                    drawUnderTabBar: true,
                    statusBarBlur: false,
                    navBarBlur: false
                }
            },
            {
                label: 'Centros',
                screen: 'Home',
                title: '',
                icon: iconsMap['ios-globe-outline'],
                selectedIcon: iconsMap['ios-globe'],
                navBarButtonColor: colors.Primary
            }
        ],
        tabsStyle: {
            tabBarSelectedButtonColor: colors.Primary,
        },
        appStyle: {
            orientation: 'portrait'
        }
    });
}
