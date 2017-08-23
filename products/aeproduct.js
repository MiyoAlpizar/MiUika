import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Alert,
    Keyboard
} from 'react-native';

import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import CachedImage from 'react-native-cached-image';
import { Icon } from 'react-native-elements';
import { GetKeyProduct, UpdateProduct, GetProductsStore } from '../src/actions/products.actions';
import { UploadFile } from '../src/actions/uploadFile.actions';
import styles from '../globals/styles.global';
import FieldCheck from '../components/FieldCheck';
import { isTextValid, isNumeric } from '../globals/functions';
import ProgressCircle from '../controls/progressCircle';
import colors from '../globals/colors.global';

const ImagePicker = require('react-native-image-picker');

const NAV_HEIGHT = 60;

class AEProduct extends Component {
    static navigatorButtons = {
        rightButtons: [
            {
                title: 'Guardar',
                id: 'save',
                disabled: false,
                disableIconTint: true,
                showAsAction: 'ifRoom',
            }
        ],
        leftButtons: [
            {
                title: 'Cancelar',
                id: 'cancel',
                disabled: false,
                disableIconTint: true,
                showAsAction: 'ifRoom',
            }
        ]
    }

    constructor(props) {
        super(props);

        this.state = {
            name: this.props.theproducts.productToPlay.name,
            description: this.props.theproducts.productToPlay.description,
            cost: this.props.theproducts.productToPlay.cost.toString(),
            price: this.props.theproducts.productToPlay.price.toString(),
            price_a12: this.props.theproducts.productToPlay.price_a12.toString(),
            active: this.props.theproducts.productToPlay.active,
            img: this.props.theproducts.productToPlay.img,
            isNewImage: false,
            canSave: true,
        };

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidMount() {
        this.ValidateData();
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'save') {
                this.SaveProduct();
            }
            if (event.id === 'cancel') {
                this.CloseModal();
            }
        }
    }

    setButtonsDisabled(disabled, cancelDisabled = false) {
        this.props.navigator.setButtons({
            rightButtons: [
                {
                    title: 'Guardar',
                    id: 'save',
                    disabled,
                    disableIconTint: true,
                    showAsAction: 'ifRoom',
                }
            ],
            leftButtons: [
                {
                    title: 'Cancelar',
                    id: 'cancel',
                    disabled: cancelDisabled,
                    disableIconTint: true,
                    showAsAction: 'ifRoom',
                }
            ]
        });
    }

    CloseModal() {
        this.props.navigator.dismissModal({
            animationType: 'slide-down'
        });
    }

    OpenImagePicker() {
        const options = {
            title: '',
            chooseFromLibraryButtonTitle: 'Elegir de galería',
            takePhotoButtonTitle: 'Tomar foto',
            cancelButtonTitle: 'Cancelar',
            allowsEditing: false,
            maxWidth: 1252,
            maxHeight: 937,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {

            } else if (response.error) {

            } else if (response.customButton) {

            } else {
                this.props.theproducts.productToPlay.img = response.uri;
                this.setState({ img: response.uri, isNewImage: true });
                this.ValidateData();
            }
        });
    }

    isValidData() {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    if (!isTextValid(this.state.name, 3)) {
                        resolve(false);
                    }
                    if (!isTextValid(this.state.description, 3)) {
                        resolve(false);
                    }
                    if (!isTextValid(this.state.img, 3)) {
                        resolve(false);
                    }
                    if (!isNumeric(this.state.cost)) {
                        resolve(false);
                    }
                    if (!isNumeric(this.state.price)) {
                        resolve(false);
                    }
                    resolve(true);
                }, 200);
            } catch (err) {
                reject(err);
            }
        });
    }

    ValidateData() {
        this.isValidData().then((isvalid) => {
            this.setState({ canSave: isvalid });
            this.setButtonsDisabled(!isvalid);
        }).catch(() => {
            this.setState({ canSave: false });
            this.setButtonsDisabled(true);
        });
    }

    SaveProduct() {
        Keyboard.dismiss();
        if (this.props.isEdit) {
            this.EditProduct();
        } else {
            this.PushProduct();
        }
    }

    PushProduct() {
        this.props.GetKeyProduct(this.props.center.key, this.props.theproducts.productToPlay.store)
            .then(() => {
                this.UploadImage(this.props.theproducts.newKey);
            });
    }

    UploadImage(name) {
        this.props.UploadFile('products',
            this.props.theproducts.productToPlay.img, `${name}.png`, 'image/png')
            .then(() => {
                if (this.props.isEdit) {
                    this.UpdateProduct();
                } else {
                    this.NewProduct();
                }
            });
    }

    NewProduct() {
        const productData = {
            center: this.props.center.key,
            active: true,
            name: this.state.name.trim(),
            description: this.state.description.trim(),
            cost: parseInt(this.state.cost.toString(), 0),
            price: parseInt(this.state.price.toString(), 0),
            price_a12: parseInt(this.state.price.toString(), 0),
            img: this.props.uploadFile.url,
            creation_date: Date.now(),
            last_change: Date.now(),
            image_date: Date.now(),
            store: this.props.theproducts.productToPlay.store
        };
        this.props.UpdateProduct(this.props.center.key,
            this.props.theproducts.productToPlay.store, this.props.theproducts.newKey, productData)
            .then(() => {
                this.props.GetProductsStore(this.props.center.key,
                    this.props.theproducts.productToPlay.store);
                this.CloseModal();
            }).catch((error) => {
                this.setButtonsDisabled(false, false);
                Alert.alert(error);
            });
    }

    EditProduct() {
        if (this.state.isNewImage) {
            this.UploadImage(this.props.theproducts.productToPlay.key);
        } else {
            this.UpdateProduct();
        }
    }

    UpdateProduct() {
        const productData = {
            active: true,
            name: this.state.name.trim(),
            description: this.state.description.trim(),
            cost: parseInt(this.state.cost.toString(), 0),
            price: parseInt(this.state.price.toString(), 0),
            price_a12: parseInt(this.state.price_a12.toString(), 0),
            last_change: Date.now(),
        };

        if (this.state.isNewImage) {
            productData.image_date = Date.now();
            productData.img = this.props.uploadFile.url;
        }

        this.props.UpdateProduct(this.props.center.key,
            this.props.theproducts.productToPlay.store, this.props.theproducts.productToPlay.key, productData)
            .then(() => {
                this.props.GetProductsStore(this.props.center.key,
                    this.props.theproducts.productToPlay.store);
                this.CloseModal();
            }).catch((error) => {
                this.setButtonsDisabled(false, false);
                Alert.alert(error);
            });
    }

    render() {
        return (
            <View style={styles.flex1}>
                <KeyboardAwareScrollView
                    style={[styles.containerWhite, { paddingTop: NAV_HEIGHT }]}
                    automaticallyAdjustContentInsets={false}
                    contentInset={{ top: NAV_HEIGHT, left: 0, bottom: 0, right: 0 }}
                    contentOffset={{ x: 0, y: 0 }}
                    scrollToInputAdditionalOffset={120}
                    getTextInputRefs={() =>
                        [this.Name.refs.Input, this.Description.refs.Input,
                        this.Cost.refs.Input, this.Price.refs.Input]}
                >
                    <View style={[styles.ImageHolder, this.state.img === '' ? { backgroundColor: colors.Primary } : { backgroundColor: 'transparent' }, styles.marginBottom20]}>
                        <TouchableOpacity
                            style={[styles.flex1, styles.itemsCenter]}
                            onPress={() => this.OpenImagePicker()}
                            activeOpacity={0.6}
                        >
                            {this.state.img === '' ?
                                <Icon
                                    name='camera'
                                    type='simple-line-icon'
                                    color='#fff'
                                    size={90}
                                /> :
                                <CachedImage useQueryParamsInCacheKey style={[styles.canvas]} source={{ uri: this.state.img }} />
                            }
                        </TouchableOpacity>
                    </View>
                    <View>
                        <FieldCheck
                            title='Nombre del producto'
                            placeholder="Nombre"
                            value={this.state.name}
                            onChangeText={(value) => { this.setState({ name: value }); this.ValidateData(); }}
                            minLenght={3}
                            ref={(r) => { this.Name = r; }}
                            onSubmitEditing={() => this.Description.refs.Input.focus()}
                        />

                        <FieldCheck
                            title='Descripción del producto'
                            placeholder="Descripción"
                            value={this.state.description}
                            onChangeText={(value) => { this.setState({ description: value }); this.ValidateData(); }}
                            minLenght={3}
                            ref={(r) => { this.Description = r; }}
                            onSubmitEditing={() => this.Cost.refs.Input.focus()}
                        />

                        <FieldCheck
                            title='Costo del producto'
                            placeholder="¿Cuánto te cuesta a ti?"
                            value={this.state.cost}
                            onChangeText={(value) => { this.setState({ cost: value }); this.ValidateData(); }}
                            maxLenght={4}
                            keyboardType={'number-pad'}
                            isNumeric
                            ref={(r) => { this.Cost = r; }}
                            onSubmitEditing={() => this.Price.refs.Input.focus()}
                            detail='El costo del producto es para que sepas cuánto ganas en informes periódicos.'
                            isNumeric
                        />

                        <FieldCheck
                            title='Precio del producto'
                            placeholder="¿Cuánto le costará al cliente?"
                            value={this.state.price}
                            onChangeText={(value) => { this.setState({ price: value }); this.ValidateData(); }}
                            maxLenght={4}
                            keyboardType={'number-pad'}
                            isNumeric
                            ref={(r) => { this.Price = r; }}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            returnKeyType={'done'}
                            isNumeric
                        />

                        <View style={{ flex: 1, height: 120 }} />

                    </View>
                </KeyboardAwareScrollView>
                <ProgressCircle progress={this.props.uploadFile.progress / 100} indeterminate={false} visible={this.props.uploadFile.isUploading} />
            </View>
        );
    }


}

const mapStateProps = state => ({
    center: state.center,
    theproducts: state.theproducts,
    uploadFile: state.uploadFile
});

const mapDispacthToProps = dispatch => ({
    GetKeyProduct: (center, store) => dispatch(GetKeyProduct(center, store)),
    UpdateProduct: (center, store, key, dataproduct) => dispatch(UpdateProduct(center, store, key, dataproduct)),
    GetProductsStore: (center, store) => dispatch(GetProductsStore(center, store)),
    UploadFile: (reference, uri, fileName, mime) => dispatch(UploadFile(reference, uri, fileName, mime)),
});

export default connect(mapStateProps, mapDispacthToProps)(AEProduct);
