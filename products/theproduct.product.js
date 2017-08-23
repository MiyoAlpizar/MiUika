import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableHighlight,
    ScrollView,
    Switch,
    StatusBar,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import CachedImage from 'react-native-cached-image';
import { Icon } from 'react-native-elements';
import colors from '../globals/colors.global';
import styles from '../globals/styles.global';
import { UpdateProductField } from '../src/actions/products.actions';

let StoreInfo = [];
class TheProduct extends Component {


    componentWillMount() {
        this.Init();
    }

    componentDidMount() {

    }

    RenderHeader() {
        return (
            <View>
                <StatusBar networkActivityIndicatorVisible={this.props.theproducts.isBussy} />
                <View style={styles.line1} />
                <TouchableHighlight onPress={() => this.GoNext('ImageProduct', true)} underlayColor={colors.Gray2} style={[styles.padding15, styles.paddingRight5, styles.bgWhite]}>
                    <View style={styles.flexRow}>
                        <CachedImage style={[styles.bgImageRadius9]} source={{ uri: this.props.theproducts.productToEdit.img }} useQueryParamsInCacheKey />
                        <View style={[styles.margin10, styles.marginRigth5, styles.flex1]}>
                            <View style={styles.flex1}>
                                <Text numberOfLines={1} style={[styles.h3, styles.b6]}>{this.props.theproducts.productToEdit.name}</Text>
                                <Text numberOfLines={2} style={[styles.h2, styles.b4, styles.primaryColor]}>{this.props.theproducts.productToEdit.description}</Text>
                            </View>
                            <View style={[styles.flexRow, styles.VCenter]}>
                                <View style={[styles.flex1, styles.VCenter]}>
                                    <Text style={[styles.h1, styles.b4]}>Producto activo</Text>
                                </View>
                                <Switch style={[styles.meRight]} value={this.props.theproducts.productToEdit.active} onValueChange={(value) => this.ToggleActive(value)} />
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
                <View style={[styles.line1, styles.marginBottom20]} />
            </View>
        );
    }

    RenderItem(item, i) {
        return (
            <View key={item.key}>
                <TouchableHighlight
                    style={[styles.bgWhite, styles.padding15]}
                    onPress={() => { this.GoNext(item.screen); }}
                    underlayColor={colors.Gray2}
                >
                    <View style={[styles.flexRow]}>
                        <View style={[styles.flex1, styles.VCenter]}>
                            <Text style={[styles.h0]} >{item.subtitle}</Text>
                            <Text numberOfLines={1} style={[styles.h1, styles.b6]}>{item.name}</Text>
                        </View>
                        <View style={[styles.VCenter]}>
                            <Icon
                                name='navigate-next'
                                color={colors.Primary}
                                size={22}
                            />
                        </View>
                    </View>
                </TouchableHighlight>
                {
                    i + 1 < StoreInfo.length ?
                        <View style={[styles.line1, styles.marginLeft10]} /> :
                        <View style={[styles.line1]} />
                }
            </View>
        );
    }

    Init() {

    }

    ToggleActive(value) {
        if (this.props.theproducts.isBussy) {
            return;
        }
        this.props.theproducts.productToEdit.active = value;
        
        this.props.UpdateProductField(this.props.center.key, 
            this.props.theproducts.productToEdit.key, 'active', 
            this.props.theproducts.productToEdit.active, this.props.theproducts.productToEdit)
            .then(() => {
                this.props.theproducts.reloadList = true;
            }).catch((error) => {
                Alert.alert(error);
            });
    }

    GoNext(screen, FullScreen = false) {
        this.props.navigator.push({
            screen,
            title: '',
            passProps: { isEdit: true, autoFocus: true },
            animated: true,
            navigatorStyle: {
                navBarButtonColor: colors.Primary,
                navBarTranslucent: true,
                navBarNoBorder: false,
                drawUnderNavBar: true,
                drawUnderTabBar: true,
                navBarBlur: false,
                navBarHidden: FullScreen,
                disabledBackGesture: FullScreen,
                tabBarHidden: FullScreen
            }
        });
    }

    SetDataStore() {
        StoreInfo = [
            {
                name: this.props.theproducts.productToEdit.name,
                subtitle: 'Nombre',
                icon: 'store',
                screen: 'NameProduct',
                key: 'uno'
            },
            {
                name: this.props.theproducts.productToEdit.description,
                subtitle: 'Descripción',
                icon: 'description',
                screen: 'DescriptionProduct',
                key: 'dos'
            },
            {
               name: `$${this.props.theproducts.productToEdit.cost}`,
                subtitle: 'Costo del producto',
                icon: 'shopping-basket',
                screen: 'CostProduct',
                key: 'tres'
            },
            {
                name: `$${this.props.theproducts.productToEdit.price}`,
                subtitle: 'Precio del producto',
                icon: 'attach-money',
                screen: 'PriceProduct',
                key: 'cuatro'
            }
        ];
    }

    render() {
        this.SetDataStore();
        return (
            <ScrollView style={[styles.container, { paddingTop: 80 }]}>
                {this.RenderHeader()}
                <StatusBar networkActivityIndicatorVisible={this.props.theproducts.isBussy} />
                <View style={[styles.line1]} />
                {
                    StoreInfo.map((item, i) => (
                        this.RenderItem(item, i)
                    ))
                }
            </ScrollView>
        );
    }


}

const mapStateProps = state => ({
    theproducts: state.theproducts,
    center: state.center
});

const mapDispacthToProps = dispatch => ({
    UpdateProductField:
    (center, store, key, field, value, productToEdit) =>
        dispatch(UpdateProductField(center, store, key, field, value, productToEdit)),
});

export default connect(mapStateProps, mapDispacthToProps)(TheProduct);
