import React, { Component } from 'react';
import {
    Dimensions,
    Text,
    View,
    StatusBar,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TouchableHighlight,
    Alert,
    Animated,
    TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import CachedImage from 'react-native-cached-image';
import { Icon } from 'react-native-elements';
import { GetProductsStore } from '../src/actions/products.actions';
import colors from '../globals/colors.global';
import gStyles from '../globals/styles.global';

const { BlurView } = require('react-native-blur');
const SearchBar = require('react-native-search-bar');


const window = Dimensions.get('window');
const HEADER_HEIGHT = 132;
const IMAGE_SIZE = 90;
class StoreProducts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            statusBarStyle: 'light-content',
            filterText: '',
            InsetTop: 0,
            overlay: false,
            opacity: new Animated.Value(0.0),
        };

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentWillMount() {
        this.Init();
    }

    componentWillUnmount() {
        this.props.theproducts.listproducts = null;
    }

    onNavigatorEvent(event) {
        if (event.id === 'willAppear') {
            if (this.props.theproducts.reloadList) {
                this.GetProducts();
            }
        }
    }

    Init() {
        this.GetProducts();
    }

    GetProducts() {
        this.props.GetProductsStore(this.props.center.key, this.props.thisstore.key)
            .then(() => {
                this.FilterProducts(this.state.filterText, true);
            }).catch((err) => {
                Alert.alert(err);
            });
    }

    handleScroll(event) {
        if (event.nativeEvent.contentOffset.y > 0) return;
    }

    RenderHeader = () => (
        <SearchBar
            placeholder='Filtrar productos'
            hideBackground
            searchBarStyle={'minimal'}
            onChangeText={(text) => this.FilterSotres(text)}
            onFocus={() => this.FocusSearchBar()}
        />
    )

    RenderProduct(item) {
        return (
            <TouchableHighlight
                underlayColor={colors.Gray3}
                onPress={() => this.GoNext(item)}
            >
                <View style={[gStyles.flexRow, gStyles.padding10]}>
                    <CachedImage style={gStyles.imgRounded50} source={{ uri: item.item.img }} useQueryParamsInCacheKey />
                    <View style={[gStyles.VCenter, gStyles.flex1, gStyles.paddingLeft10]}>
                        <Text style={[gStyles.h1, gStyles.b6]}>{item.item.name}</Text>
                        <Text style={[gStyles.h0, gStyles.b4, gStyles.primaryMirrorColor]}>{item.item.description}</Text>
                    </View>
                    <View style={[gStyles.meRight]} >
                        <View style={[gStyles.flexRow, gStyles.itemsCenter, gStyles.flex1]}>
                            <Icon
                                name='navigate-next'
                                color="#000"
                                color={colors.Primary}
                            />
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    RenderEmpty() {
        return (
            <View
                style={[gStyles.container, gStyles.flex1, gStyles.itemsCenter]}
            >
                <Text
                    style={
                        [gStyles.h8, gStyles.b5, gStyles.primaryMirrorColor]
                    }
                >
                    {this.props.theproducts.isLoading ? 'Cargando...' : 'Sin resultados'}</Text>
            </View>
        );
    }

    RenderSeparator() {
        return (
            <View style={styles.separator} />
        );
    }

    GoNewProduct() {
        this.UnfocusSearchBar();

        this.props.theproducts.productToPlay = {
            key: '',
            active: true,
            center: '',
            cost: '',
            creation_date: null,
            description: '',
            img: '',
            last_change: null,
            name: '',
            price: '',
            price_a12: '',
            store: this.props.thisstore.key
        };

        this.props.navigator.showModal({
            screen: 'AEProduct',
            title: 'Nuevo Producto',
            subtitle: this.props.thisstore.name,
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
                navBarHidden: false,
                navBarSubtitleFontSize: 12,
            }
        });
    }

    FilterProducts(text, animated = false) {
        if (this.props.theproducts.products == null) { return; }

        this.setState({ filterText: text });
        const filteredProducts =
            this.props.theproducts.products
                .filter(products => products.name.indexOf(text) !== -1);
        this.props.theproducts.listproducts = filteredProducts;
        this.refs.flProducts.scrollToOffset({ offset: -HEADER_HEIGHT, animated });
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

    GoBack() {
        this.props.navigator.pop({
            animated: true
        });
    }

    GoNext(item) {
         try {
            const sProduct = JSON.stringify(item.item);
            const Product = JSON.parse(sProduct);
            this.props.theproducts.productToPlay = Product;
            this.props.theproducts.productToEdit = Product;
            this.UnfocusSearchBar();
            this.props.navigator.showModal({
                screen: 'AEProduct',
                title: 'Editar producto',
                subtitle: item.item.name,
                passProps: { isEdit: true },
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

    render() {
        return (
            <View style={gStyles.container}>
                <StatusBar networkActivityIndicatorVisible={this.props.theproducts.isBussy} />
                <FlatList
                    style={[gStyles.container, { paddingTop: 0 }]}
                    data={this.props.theproducts.listproducts}
                    renderItem={(item) => this.RenderProduct(item)}
                    keyExtractor={(item) => item.key}
                    ItemSeparatorComponent={() => this.RenderSeparator()}
                    refreshing={this.props.theproducts.isLoading}
                    onRefresh={() => this.GetProducts()}
                    automaticallyAdjustContentInsets={false}
                    contentInset={{ top: HEADER_HEIGHT, left: 0, bottom: 48, right: 0 }}
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="on-drag"
                    ListEmptyComponent={() => this.RenderEmpty()}
                    ref="flProducts"
                    contentOffset={{ x: 0, y: -HEADER_HEIGHT }}
                />
                <BlurView
                    blurType="light"
                    blurAmount={20} 
                    style={[gStyles.paddingTop40, gStyles.TopBar, { height: HEADER_HEIGHT }]}
                >
                    <View style={[gStyles.flexRow, gStyles.marginRight10]}>
                        <View style={[gStyles.flexRow, gStyles.flex1, gStyles.paddingLeft10]}>
                            <TouchableOpacity
                                onPress={() => this.GoBack()}
                                style={[gStyles.paddingRight20]}
                            >
                                <View>
                                    <Icon
                                        name='ios-arrow-back'
                                        color='transparent'
                                        type="ionicon"
                                        size={38}
                                        color={colors.Primary}
                                    />
                                </View>
                            </TouchableOpacity>
                            <CachedImage
                                style={[gStyles.imgRounded]}
                                source={{ uri: this.props.thisstore.img }}
                                useQueryParamsInCacheKey
                            />
                            <Text
                                style={[gStyles.paddingLeft10, gStyles.h11, gStyles.b8]}
                            >
                                Productos
                            </Text>
                        </View>
                        <Icon
                            name='ios-add'
                            color='transparent'
                            type="ionicon"
                            size={40}
                            color={colors.Primary}
                            onPress={() => this.GoNewProduct()}
                        />
                    </View>
                    <SearchBar
                        placeholder='Filtrar productos'
                        hideBackground
                        searchBarStyle={'minimal'}
                        ref="searchbar"
                        onSearchButtonPress={() => this.UnfocusSearchBar()}
                        onCancelButtonPress={() => this.UnfocusSearchBar()}
                        onFocus={() => this.FocusSearchBar()}
                        onChangeText={(text) => this.FilterProducts(text)}
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
    theproducts: state.theproducts,
    center: state.center
});

const mapDispacthToProps = dispatch => ({
    GetProductsStore: (center, store) => dispatch(GetProductsStore(center, store))
});

export default connect(mapStateProps, mapDispacthToProps)(StoreProducts);

const styles = StyleSheet.create({
    imageBG: {
        width: window.width,
        height: HEADER_HEIGHT
    },
    imageStore: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE
    },
    bg: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    view: {
        flex: 1
    },
    text: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
    },
    Bar: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: colors.NavBarColorRGBAO
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
    },
    separator: {
        backgroundColor: '#d3d1d1',
        height: 1,
        marginLeft: 10,
        marginRight: 5
    },
});
