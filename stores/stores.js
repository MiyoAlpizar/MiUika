import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    FlatList,
    Animated,
    Dimensions,
    ActionSheetIOS,
    Alert,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StatusBar
} from 'react-native';
import CachedImage from 'react-native-cached-image';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { GetCenterStorage } from '../src/actions/center.actions';
import { GetStores } from '../src/actions/stores.actions';
import colors from '../globals/colors.global';
import gStyles from '../globals/styles.global';

const { BlurView } = require('react-native-blur');
const SearchBar = require('react-native-search-bar');

const HEADER_HEIGHT = 132;
const { height } = Dimensions.get('window');

class Stores extends Component {

    constructor(props) {
        super(props);
        this.state = {
            overlay: false,
            opacity: new Animated.Value(0.0),
            filterText: ''
        };

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentWillMount() {
        this.Init();
    }

    componentDidMount() {
    }

    onNavigatorEvent(event) {
        if (event.id === 'willAppear') {
            if (this.props.thestores.reloadList) {
                this.GetStores();
            }
        }
    }

    RenderStore2(item) {
        return (
            <TouchableHighlight
                underlayColor={colors.Gray3}
                onPress={() => this.GoNext(item)}
            >
                <View style={styles.cell}>
                    <CachedImage style={styles.imgRounded} source={{ uri: item.item.img }} useQueryParamsInCacheKey />
                    <View style={styles.cellData}>
                        <Text style={styles.name_store}>{item.item.name}</Text>
                        <Text style={styles.descripction_store}>{item.item.description}</Text>
                    </View>
                    <View style={styles.right} >
                        <View style={styles.txtArrow}>
                            <TouchableOpacity
                                style={[gStyles.itemsCenter, gStyles.marginRight10,
                                {
                                    height: 28,
                                    width: 28,
                                    borderRadius: 15
                                }]}
                            >
                                <Icon
                                    name='ios-more'
                                    type='ionicon'
                                    color={colors.Primary}
                                    iconStyle={{ fontSize: 30, margin: 0, padding: 0 }}
                                    containerStyle={{
                                        margin: 0,
                                        paddingTop: 2.5,
                                        height: 20,
                                        width: 28
                                    }}
                                    underlayColor={'transparent'}
                                    onPress={() => this.StoreOptions(item)}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.right} >
                        <View style={styles.txtArrow}>
                            <Icon
                                name='navigate-next'
                                color="#000"
                                color={colors.PrimaryMirror}
                            />
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    RenderStore(item) {
        return (
            <TouchableHighlight
                underlayColor={colors.Gray3}
                onPress={() => this.GoNext(item)}
            >
                <View style={[gStyles.flexRow, gStyles.padding10]}>
                    <CachedImage
                        source={{ uri: item.item.img }}
                        style={[gStyles.bgImage110Radius]}
                    />
                    <View style={[gStyles.paddingLeft10, gStyles.flex1]}>
                        <Text
                            numberOfLines={2}
                            style={[gStyles.h3, gStyles.b6]}
                        >
                            {item.item.name}
                        </Text>

                        <Text
                            numberOfLines={2}
                            style={[gStyles.h2, gStyles.b3]}
                        >
                            {item.item.description}
                        </Text>

                        <View style={[gStyles.meLeft, gStyles.VEnd, gStyles.flex1]}>
                            <TouchableOpacity
                                style={[gStyles.itemsCenter, gStyles.marginRight10,
                                {
                                    backgroundColor: colors.Primary,
                                    height: 28,
                                    width: 28,
                                    borderRadius: 15
                                }]}
                            >
                                <Icon
                                    name='ios-more'
                                    type='ionicon'
                                    color={'white'}
                                    iconStyle={{ fontSize: 30, margin: 0, padding: 0 }}
                                    containerStyle={{
                                        margin: 0,
                                        paddingTop: 2.5,
                                        height: 20,
                                        width: 28
                                    }}
                                    underlayColor={'transparent'}
                                    onPress={() => this.StoreOptions(item)}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[gStyles.itemsCenter]}>
                        <View>
                            <Icon
                                name='navigate-next'
                                color="#000"
                                color={colors.PrimaryMirror}
                            />
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    RenderEmpty() {
        return (
            <View style={[gStyles.container, gStyles.itemsCenter, { height: height - 320 }]}>
                <Text
                    style={[gStyles.h8,
                    gStyles.b5, gStyles.marginTop30, gStyles.primaryMirrorColor]}
                >
                    {this.props.thestores.isLoading ? 'Cargando...' : 'Sin resultados'}</Text>
            </View>
        );
    }

    RenderSeparator() {
        return (
            <View style={styles.separator} />
        );
    }

    Init() {
        this.props.GetCenterStorage()
            .then(() => {
                this.GetStores();
            }).catch(err => Alert.alert(err));
    }

    GetStores() {
        this.props.GetStores(this.props.center.key)
            .then(() => {
                this.FilterSotres(this.state.filterText, true);
            }).catch((err) => {
                Alert.alert(err);
            });
    }

    GoNewStore() {
        this.UnfocusSearchBar();

        this.props.thestore.storeToPlay = {
            key: '',
            description: '',
            name: '',
            service_extra: '0',
            products_description: '',
            img: '',
            active: true
        };

        this.props.navigator.showModal({
            screen: 'AEStore',
            title: 'Nuevo Negocio',
            passProps: { isEdit: false },
            overrideBackPress: true,
            animationType: 'slide-up',
            navigatorStyle: {
                navBarButtonColor: colors.Primary,
                navBarTranslucent: true,
                navBarNoBorder: false,
                drawUnderNavBar: true,
                drawUnderTabBar: true,
                statusBarBlur: false,
                navBarBlur: false,
                navBarHidden: false
            }
        });
    }

    FilterSotres(text, animated = false) {
        if (this.props.thestores.stores == null) { return; }

        this.setState({ filterText: text });
        const filteredStores =
            this.props.thestores.stores.filter(stores => stores.name.indexOf(text) !== -1);
        this.props.thestores.liststores = filteredStores;
        this.refs.flStores.scrollToOffset({ offset: -HEADER_HEIGHT, animated });
    }

    UnfocusSearchBar() {
        this.refs.searchbar.unFocus();
        Animated.timing(this.state.opacity, {
            toValue: 0.0,
            duration: 200
        }).start(() => {
            this.setState({
                overlay: false
            });
        });
    }

    FocusSearchBar() {
        this.setState({
            overlay: true
        });
        Animated.timing(this.state.opacity, {
            toValue: 0.22,
            duration: 200
        }).start();
    }

    GoNext(item) {
        this.props.navigator.push({
            screen: 'StoreProducts',
            title: '',
            passProps: { thisstore: item.item },
            animated: true,
            navigatorStyle: {
                navBarButtonColor: colors.Primary,
                navBarTranslucent: true,
                navBarNoBorder: false,
                drawUnderNavBar: true,
                drawUnderTabBar: true,
                navBarBlur: false,
                navBarHidden: true,
                disabledBackGesture: false,
            }
        });
    }

    GoEdit(screen, item) {
        try {
            const sStore = JSON.stringify(item.item);
            const Store = JSON.parse(sStore);
            this.props.thestore.storeToPlay = Store;
            this.props.thestore.storeToEdit = Store;
            this.UnfocusSearchBar();
            this.props.navigator.showModal({
                screen: 'AEStore',
                title: 'Editar Negocio',
                subtitle: item.item.name,
                passProps: { theStore: item.item, isEdit: true },
                animated: true,
                navigatorStyle: {
                    navBarButtonColor: colors.Primary,
                    navBarTranslucent: true,
                    navBarNoBorder: false,
                    drawUnderNavBar: true,
                    drawUnderTabBar: true,
                    navBarSubtitleFontSize: 12,
                    navBarBlur: false,
                    navBarHidden: false,
                    disabledBackGesture: false
                }
            });
        } catch (error) {
            Alert.alert(error);
        }
    }

    StoreOptions(item) {
        ActionSheetIOS.showActionSheetWithOptions({
            options: ['Editar ', 'Agregar productos', 'Desactivar', 'Cancelar'],
            cancelButtonIndex: 3,
            destructiveButtonIndex: 2,
            tintColor: colors.Primary
        },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        this.GoEdit('TheStore', item);
                        break;
                    case 1:
                        this.GoNext(item);
                        break;
                    default:
                        break;
                }
            });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle='dark-content' />
                <FlatList
                    style={gStyles.container}
                    data={this.props.thestores.liststores}
                    renderItem={(item) => this.RenderStore2(item)}
                    keyExtractor={(item) => item.key}
                    ItemSeparatorComponent={() => this.RenderSeparator()}
                    refreshing={this.props.thestores.isLoading}
                    onRefresh={() => this.GetStores()}
                    automaticallyAdjustContentInsets={false}
                    contentInset={{ top: HEADER_HEIGHT, left: 0, bottom: 48, right: 0 }}
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="on-drag"
                    ListEmptyComponent={() => this.RenderEmpty()}
                    ref="flStores"
                    contentOffset={{ x: 0, y: -HEADER_HEIGHT }}
                />

                <BlurView
                    blurType="light"
                    blurAmount={20}
                    style={[gStyles.paddingTop40, gStyles.TopBar, { height: HEADER_HEIGHT }]}
                >
                    <View style={[gStyles.flexRow, gStyles.marginRight10]}>
                        <Text
                            style={[gStyles.paddingLeft10, gStyles.flex1, gStyles.h11, gStyles.b8]}
                        >
                            Negocios
                        </Text>
                        <Icon
                            name='ios-add'
                            color='transparent'
                            type="ionicon"
                            size={40}
                            color={colors.Primary}
                            onPress={() => this.GoNewStore()}
                        />
                    </View>
                    <SearchBar
                        placeholder='Filtrar negocios'
                        hideBackground
                        searchBarStyle={'minimal'}
                        ref="searchbar"
                        onSearchButtonPress={() => this.UnfocusSearchBar()}
                        onCancelButtonPress={() => this.UnfocusSearchBar()}
                        onFocus={() => this.FocusSearchBar()}
                        onChangeText={(text) => this.FilterSotres(text)}
                    />
                </BlurView>

                {this.state.overlay ?
                    <TouchableWithoutFeedback onPress={() => this.UnfocusSearchBar()} >
                        <Animated.View style={[styles.BGOpacity, { opacity: this.state.opacity }]} />
                    </TouchableWithoutFeedback> : null}

            </View>
        );
    }
}

const mapStateProps = state => ({
    thestores: state.thestores,
    thestore: state.thestore,
    center: state.center
});

const mapDispacthToProps = dispatch => ({
    GetCenterStorage: () => dispatch(GetCenterStorage()),
    GetStores: (center) => dispatch(GetStores(center))
});

export default connect(mapStateProps, mapDispacthToProps)(Stores);

const styles = StyleSheet.create({

    row: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 48,
        textAlign: 'left',
        fontWeight: '800',
        paddingLeft: 10,
        flex: 1
    },
    addButton: {
        alignSelf: 'flex-end'
    },
    cell: {
        padding: 10,
        flexDirection: 'row'
    },
    imgRounded:
    {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignSelf: 'flex-start',
    },
    cellData: {
        paddingLeft: 10,
        justifyContent: 'center',
        flex: 1
    },
    name_store: {
        fontSize: 16,
        textAlign: 'left',
        fontWeight: '600',
    },
    descripction_store: {
        fontSize: 14,
        textAlign: 'left',
        fontWeight: '400',
        color: colors.TextSecundary
    },
    right: {
        alignSelf: 'flex-end',
    },
    txtArrow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    separator: {
        backgroundColor: '#d3d1d1',
        height: 1,
        marginLeft: 10,
        marginRight: 5
    },
    overlay:
    {
        position: 'absolute',
        top: 150,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'black',
        zIndex: 1
    },
    tapOverlay:
    {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 2
    },
    BGOpacity:
    {
        left: 0,
        top: HEADER_HEIGHT,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        position: 'absolute',
        zIndex: 2
    }
});
