import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    Switch,
    TouchableHighlight,
    Alert,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Animated,
    FlatList
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import CachedImage from 'react-native-cached-image';
import { ValidateUser } from '../src/actions/user.actions';
import {
    GetCenter,
    UpdateCenterData,
    GetCenterStorage,
    UpdateCenter
} from '../src/actions/center.actions';
import colors from '../globals/colors.global';
import gStyles from '../globals/styles.global';

const { BlurView } = require('react-native-blur');

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const SLIDER_WIDTH = WINDOW_WIDTH - 30;

const HEADER_HEIGHT = 320;
const HEADER_MAX_HEIGHT = WINDOW_HEIGHT / 2;
const HEADER_MIN_HEIGHT = HEADER_HEIGHT / 2;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const Adversaments = [
    {
        key: 1,
        title: 'BIENVENIDO',
        detail: 'Ahora puedes comenzar a ofrecer tu servicio de reparto',
        image: 'https://scontent-lax3-1.xx.fbcdn.net/v/t31.0-8/20424015_1429974043706322_5844912014117016986_o.jpg?oh=3fe0d4f6567776c0abc19e0786e14de6&oe=59F4BF15'
    },
    {
        key: 2,
        title: 'HORARIO',
        detail: 'Tú eliges cuando estar disponible y cuando no',
        image: 'https://scontent-lax3-1.xx.fbcdn.net/v/t31.0-8/20423932_1429481597088900_2368836652285497858_o.jpg?oh=211b71c2129fdc484587b032950a616e&oe=59EE057A'
    },
    {
        key: 3,
        title: 'NEGOCIOS Y PRODUCTOS',
        detail: 'Registra los negocios y productos más cercanos a ti',
        image: 'https://scontent-lax3-1.xx.fbcdn.net/v/t31.0-8/11064771_857152647655134_2131764239765349186_o.jpg?oh=b01286da86937c5bf13942224158b5c5&oe=5A288A68'
    },
    {
        key: 4,
        title: 'FAVOR',
        detail: 'También puedes realizar favores, estos te llegarán por escrito',
        image: 'https://scontent-lax3-1.xx.fbcdn.net/v/t31.0-8/20423995_1429481743755552_3569555955366941373_o.jpg?oh=b7e809e60256cc91893f63c33db93c0c&oe=5A2AB2EF'
    },
    {
        key: 5,
        title: '¿ESTÁS LISTO?',
        detail: 'Disfruta de este trabajo sin horarios y vive tu vida',
        image: 'https://scontent-lax3-1.xx.fbcdn.net/v/t31.0-8/13227688_1028992957137768_3151081120865267604_o.jpg?oh=a5260d2deba895449e1f78cc39991aed&oe=5A2C3B4B'
    }
];

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            img: '',
            colorsBG: ['#fff', '#fff'],
            contrastedColors: ['#000', '#000'],
            contrastedColorsNumber: [1, 1],
            BS: 'dark-content',
            color_name: 'black',
            bg_color: 'white',
            bg_height: new Animated.Value(0)
        };
    }

    componentWillMount() {
        this.Init();
        this.props.ValidateUser()
            .then(() => {
                if (!this.props.user.user) {
                    this.GoLogin(false);
                }
            });
    }

    RenderNavBar(center) {
        return (
            <View
                style={gStyles.Bar}
            >
                <BlurView
                    blurType={'light'}
                    blurAmount={10}
                    style={[gStyles.flex1,
                    gStyles.NavBar,
                    gStyles.VCenter]}
                >
                    <View style={[gStyles.flex1, gStyles.flexRow, gStyles.HCenter]}>
                        <TouchableOpacity
                            onPress={() => this.ShowModal('Profile')}
                            activeOpacity={0.8}
                        >
                            <CachedImage
                                source={{ uri: center.img_profile }}
                                style={[gStyles.imgRounded38]}
                                useQueryParamsInCacheKey
                            />
                        </TouchableOpacity>
                        <Text
                            style={[gStyles.h2, gStyles.b8, gStyles.flex1, gStyles.paddingLeft10]}
                            numberOfLines={1}
                        >
                            {`${center.name.toUpperCase()} ${center.last_name.toUpperCase()}`}
                        </Text>
                    </View>
                </BlurView>
            </View>
        );
    }

    CreateDataCell(title, subtitle, field, value, prefix, min, max) {
        return (
            <TouchableHighlight
                onPress={() =>
                    this.GoSettings(field, value, this.props.center.key, title, subtitle, min, max)}
            >
                <View style={styles.row}>
                    <View style={styles.center}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <View style={styles.right} >
                        <View style={styles.txtArrow}>
                            <Text style={styles.value}>{prefix.toString() + value.toString()}</Text>
                            <Icon
                                name='navigate-next'
                                color={colors.Secundary}
                            />
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    CreateDataNext(title, value, sufix, screen, screenTitle = '', navBarHidden = false) {
        return (
            <TouchableHighlight
                onPress={() => this.GoNext(screen, screenTitle, navBarHidden)}
            >
                <View style={styles.row}>
                    <View style={styles.center}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <View style={styles.right} >
                        <View style={styles.txtArrow}>
                            <Text style={styles.value}>{value.toString() + sufix.toString()}</Text>
                            <Icon
                                name='navigate-next'
                                color={colors.Secundary}
                            />
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    CreateDataSwitch(title, value, onChange) {
        return (
            <View style={styles.row}>
                <View style={styles.center}>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <Switch
                    style={styles.right}
                    onValueChange={(val) => onChange(val)}
                    value={value}
                    onTintColor={colors.Secundary}
                />
            </View>
        );
    }

    Init() {
        this.props.GetCenterStorage()
            .then(() => {
                if (this.props.center.center) {
                    this.setState({
                        img: this.props.center.center.img_profile,
                        colorsBG: this.props.center.center.colors_profile,
                        BS: this.props.center.center.style_bar
                    });
                }
                this.props.GetCenter()
                    .then(() => {
                        if (this.props.center.center) {
                            this.setState({
                                img: this.props.center.center.img_profile,
                                colorsBG: this.props.center.center.colors_profile,
                                BS: this.props.center.center.style_bar
                            });
                        }
                    });
            }).catch(err => Alert.alert(err));
    }

    GoLogin(animated = true) {
        this.props.navigator.resetTo({
            screen: 'Login',
            title: '',
            passProps: {},
            animated,
            animationType: 'fade',
            navigatorStyle: {
                navBarHidden: true,
                tabBarHidden: true
            },
        });
    }

    UpdateCenter() {
        if (this.props.center.center.isUpdating) {
            return;
        }
        const centerData = {
            img_profile: this.props.uploadFile.url,
            colors_profile: this.state.colorsBG,
            style_bar: this.state.BS,
            colors_contrast: this.state.contrastedColors,
            colors_contrast_number: this.state.contrastedColorsNumber,
            image_date: Date.now()
        };
        console.log(centerData);
        this.props.UpdateCenter(this.props.center.key, centerData)
            .then(() => {
                Alert.alert('Ok');
            }).catch((error) => {
                Alert.alert(error);
            });
    }

    ToggleActive(value) {
        if (this.props.center.center.isUpdating) {
            return;
        }
        this.props.center.center.active = value;
        this.props.UpdateCenterData(this.props.center.key, 'active', value)
            .then(() => {

            }).catch((error) => {
                Alert.alert(error);
            });
    }

    ToggleFavor(value) {
        if (this.props.center.center.isUpdating) {
            return;
        }
        this.props.center.center.favor = value;
        this.props.UpdateCenterData(this.props.center.key, 'favor', value)
            .then(() => {

            }).catch((error) => {
                Alert.alert(error);
            });
    }

    GoSettings(field, value, uid, title, subtitle, min, max) {
        this.props.navigator.push({
            screen: 'UpdateSettings',
            title: 'Ajustes',
            passProps: { field, value, uid, title, subtitle, min, max },
            animated: true,
            navigatorStyle: {
                navBarButtonColor: colors.Primary,
                navBarTranslucent: true,
                navBarNoBorder: false,
                drawUnderNavBar: true,
                drawUnderTabBar: true,
                navBarBlur: false,
                navBarHidden: false,
                disabledBackGesture: false
            }
        });
    }

    GoNext(screen, title, navBarHidden = false, disabledBackGesture = true) {
        this.props.navigator.push({
            screen,
            title,
            passProps: {},
            animated: true,
            navigatorStyle: {
                navBarButtonColor: colors.Primary,
                navBarTranslucent: true,
                navBarNoBorder: false,
                navBarTransparent: true,
                drawUnderNavBar: true,
                drawUnderTabBar: true,
                navBarBlur: false,
                navBarHidden,
                tabBarHidden: true,
                disabledBackGesture
            }
        });
    }

    RenderAdversaments(item) {
        return (
            <View style={[{ width: SLIDER_WIDTH }, gStyles.itemsCenter]}>
                <View>
                    <View style={[gStyles.line1, gStyles.marginBottom10]} />
                    <Text style={[gStyles.hs12, gStyles.primaryColor, gStyles.b8, gStyles.paddingBottom5]}>{item.title}</Text>
                    <Text
                        style={[gStyles.h4, gStyles.b5, gStyles.paddingBottom15, { width: SLIDER_WIDTH - 10 }]}
                        numberOfLines={2}
                    >
                        {item.detail}
                    </Text>
                </View>
                <CachedImage
                    style={[{ width: SLIDER_WIDTH - 10, height: 240, borderRadius: 4 }]}
                    source={{ uri: item.image }}
                />
            </View>
        );
    }

    ShowModal(screen) {
        this.props.navigator.showModal({
            screen,
            title: 'Nuevo Producto',
            animationType: 'slide-up',
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
        });
    }

    renderCarousel() {
        return (
            <View
                style={[gStyles.itemsCenter, gStyles.padding10,
                gStyles.paddingLeft15, gStyles.paddingRight15]}
            >
                <FlatList
                    horizontal
                    data={Adversaments}
                    keyExtractor={(item) => item.key}
                    renderItem={(item) => this.RenderAdversaments(item.item)}
                    pagingEnabled
                    style={[{ width: SLIDER_WIDTH, overflow: 'visible' }]}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[gStyles.itemsCenter]}
                />
            </View>
        );
    }

    render() {
        const { center } = this.props.center;

        const BGHeight = this.state.bg_height.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        });

        return (
            <View style={styles.container}>
                <ScrollView
                    style={[gStyles.flex1]}
                    automaticallyAdjustContentInsets={false}
                    contentInset={{ top: 64, bottom: 48 }}
                    contentOffset={{ y: -64 }}
                >
                    <View style={[gStyles.padding20, { paddingBottom: 0 }]}>
                        <Text style={[gStyles.h9, gStyles.b9]}>MI UIKA</Text>
                    </View>
                    {this.renderCarousel()}
                    {this.props.center.center != null ?
                        <View style={styles.settinsContainer}>
                            <StatusBar barStyle='dark-content' networkActivityIndicatorVisible={this.props.center.isBussy} />
                            {this.CreateDataSwitch('Activo', center.active, this.ToggleActive.bind(this))}
                            {this.CreateDataSwitch('Favores escritos', center.favor, this.ToggleFavor.bind(this))}
                            {this.CreateDataCell('Servicio', 'El costo del servicio debe ser igual o mayor a $10, cualquier cambio será reflejeado inmediatamente...', 'service', center.service, '$', 10, -1)}
                            {this.CreateDataCell('Extra multiples negocios', 'Puedes cobrar un extra cuando te pidan de 2 o más negocios. El costo extra aplica por cada negocio a partir del segundo en adelante...', 'extra_multiples', center.extra_multiples, '$', 0, -1)}
                            {this.CreateDataCell('Extra después de media noche', 'Puedes cobrar un costo extra de servicio para pedidos después de la media noche, este costo aplicará atutomaticamente de 12 am a 5 am...', 'extra12', center.extra12, '$', 0, -1)}
                            {this.CreateDataNext('Radio de reparto', center.km_base, ' km', 'KmBase', '', true)}
                        </View>
                        : null
                    }
                </ScrollView>
                {this.props.center.center != null ?
                    this.RenderNavBar(center)
                    : null}
            </View>
        );
    }
}

const mapStateProps = state => ({
    user: state.user,
    center: state.center,
    uploadFile: state.uploadFile
});

const mapDispacthToProps = dispatch => ({
    ValidateUser: () => dispatch(ValidateUser()),
    GetCenter: () => dispatch(GetCenter()),
    GetCenterStorage: () => dispatch(GetCenterStorage()),
    UpdateCenterData: (uid, field, value) => dispatch(UpdateCenterData(uid, field, value)),
    UpdateCenter: (center, datacenter) => dispatch(UpdateCenter(center, datacenter)),
});

export default connect(mapStateProps, mapDispacthToProps)(Home);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    navBar: {
        height: 64,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },

    imgProfile:
    {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignSelf: 'flex-end',
    },
    lineData: {
        marginTop: 20,
        backgroundColor: colors.Primary,
        padding: 2,
        marginRight: 40,
        borderTopRightRadius: 26,
        borderBottomRightRadius: 26,
        flexDirection: 'row'
    },
    centerData: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 10
    },
    name: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    name_center: {
        color: '#fff',
        fontSize: 12
    },
    settinsContainer: {
        marginTop: 20,
        backgroundColor: 'white',
        flex: 1,
        paddingBottom: 20
    },
    row: {
        backgroundColor: '#fff',
        padding: 10,
        flexDirection: 'row',
        borderBottomColor: '#F0F0F0',
        borderBottomWidth: 1,
        height: 50
    },
    center: {
        flex: 1,
        justifyContent: 'center'
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.Primary
    },
    right: {
        alignSelf: 'flex-end'
    },
    txtArrow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    value: {
        fontSize: 16,
        fontWeight: '500'
    },
    next: {
        alignSelf: 'center',
    }
});
