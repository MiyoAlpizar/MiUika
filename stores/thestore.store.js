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
import { UpdateStoreField } from '../src/actions/store.actions';

let StoreInfo = [];
class TheStore extends Component {


    componentWillMount() {
        this.Init();
    }

    componentDidMount() {

    }

    RenderHeader() {
        return (
            <View>
                <StatusBar networkActivityIndicatorVisible={this.props.thestore.bussy} />
                <View style={styles.line1} />
                <TouchableHighlight onPress={() => this.GoNext('ImageStore', true)} underlayColor={colors.Gray2} style={[styles.padding15, styles.paddingRight5, styles.bgWhite]}>
                    <View style={styles.flexRow}>
                        <CachedImage style={[styles.bgImageRadius9]} source={{ uri: this.props.thestore.storeToEdit.img }} useQueryParamsInCacheKey />
                        <View style={[styles.margin10, styles.marginRigth5, styles.flex1]}>
                            <View style={styles.flex1}>
                                <Text numberOfLines={1} style={[styles.h3, styles.b6]}>{this.props.thestore.storeToEdit.name}</Text>
                                <Text numberOfLines={2} style={[styles.h2, styles.b4, styles.primaryColor]}>{this.props.thestore.storeToEdit.description}</Text>
                            </View>
                            <View style={[styles.flexRow, styles.VCenter]}>
                                <View style={[styles.flex1, styles.VCenter]}>
                                    <Text style={[styles.h1, styles.b4]}>Negocio activo</Text>
                                </View>
                                <Switch style={[styles.meRight]} value={this.props.thestore.storeToEdit.active} onValueChange={(value) => this.ToggleActive(value)} />
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
        if (this.props.thestore.bussy) {
            return;
        }
        this.props.thestore.storeToEdit.active = value;
        
        this.props.UpdateStoreField(this.props.center.key, 
            this.props.thestore.storeToPlay.key, 'active', 
            this.props.thestore.storeToPlay.active, this.props.thestore.storeToPlay)
            .then(() => {
                this.props.thestores.reloadList = true;
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
                name: this.props.thestore.storeToEdit.name,
                subtitle: 'Nombre',
                icon: 'store',
                screen: 'NameStore',
                key: 'uno'
            },
            {
                name: this.props.thestore.storeToEdit.description,
                subtitle: 'Descripción',
                icon: 'description',
                screen: 'DescriptionStore',
                key: 'dos'
            },
            {
                name: this.props.thestore.storeToEdit.products_description,
                subtitle: 'Descripción de productos',
                icon: 'shopping-basket',
                screen: 'ProductsStore',
                key: 'tres'
            },
            {
                name: `$${this.props.thestore.storeToEdit.service_extra}`,
                subtitle: 'Servicio extra',
                icon: 'attach-money',
                screen: 'ExtraService',
                key: 'cuatro'
            }
        ];
    }

    render() {
        this.SetDataStore();
        return (
            <ScrollView style={[styles.container, { paddingTop: 80 }]}>
                {this.RenderHeader()}
                <StatusBar networkActivityIndicatorVisible={this.props.thestore.bussy} />
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
    thestore: state.thestore,
    thestores: state.thestores,
    center: state.center
});

const mapDispacthToProps = dispatch => ({
    UpdateStoreField: (center, key, field, value, storeToEdit) =>
        dispatch(UpdateStoreField(center, key, field, value, storeToEdit))
});
export default connect(mapStateProps, mapDispacthToProps)(TheStore);
