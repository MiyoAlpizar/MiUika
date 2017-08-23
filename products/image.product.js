import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import CachedImage from 'react-native-cached-image';
import styles from '../globals/styles.global';
import ProgressCircle from '../controls/progressCircle';
import {
    GetKeyProduct,
    UpdateProduct,
    UpdateProductField,
    GetProductsStore
} from '../src/actions/products.actions';
import { UploadFile } from '../src/actions/uploadFile.actions';


const ImagePicker = require('react-native-image-picker');

class ImageProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            next: this.props.theproducts.productToPlay.img.trim() !== '',
        };
    }

    componentWillMount() {
        this.Init();
    }

    componentDidMount() {

    }

    Init() {

    }

    GoNext(screen) {
        this.props.navigator.push({
            screen,
            title: '',
            passProps: {},
            animated: true,
        });
    }

    OpenImagePicker() {
        const options = {
            title: '',
            chooseFromLibraryButtonTitle: 'Elegir de galería',
            takePhotoButtonTitle: 'Tomar foto',
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
                this.setState({ next: true });
            }
        });
    }

    CloseModal() {
        this.props.navigator.dismissModal({
            animationType: 'slide-down'
        });
    }

    GoBack() {
        this.props.navigator.pop({
            animated: true,
        });
    }

    SaveProduct() {
        try {
            if (this.props.theproducts.productToPlay.img === '') {
                Alert.alert.Alert.alert('Debes elegir una imagen del producto');
                return;
            }
            if (!this.props.isEdit) {
                this.SaveWholeProduct();
            } else {
                this.SaveDataField();
            }
        } catch (error) {
            Alert.alert(error);
        }
    }

    SaveWholeProduct() {
        this.props.GetKeyProduct(this.props.center.key, this.props.theproducts.productToPlay.store)
            .then(() => {
                this.props.UploadFile('products', this.props.theproducts.productToPlay.img, `${this.props.theproducts.newKey}.png`, 'image/png')
                    .then(() => {
                        const productData = {
                            active: true,
                            center: this.props.center.key,
                            creation_date: Date.now(),
                            description: this.props.theproducts.productToPlay.description.trim(),
                            img: this.props.uploadFile.url,
                            last_change: Date.now(),
                            name: this.props.theproducts.productToPlay.name.trim(),
                            cost: parseInt(this.props.theproducts.productToPlay.cost.toString(), 0),
                            price: parseInt(this.props.theproducts.productToPlay.price.toString(), 0),
                            price_a12: parseInt(this.props.theproducts.productToPlay.price.toString(), 0),
                            store: this.props.theproducts.productToPlay.store,
                            image_date: Date.now()
                        };
                        this.props.UpdateProduct(this.props.center.key,
                            this.props.theproducts.productToPlay.store, this.props.theproducts.newKey, productData)
                            .then(() => {
                                this.GetProducts();
                            }).catch((error) => {
                                Alert.alert(error);
                            });
                    }).catch((error) => {
                        Alert.alert(error);
                    });
            }).catch((error) => {
                Alert.alert(error);
            });
    }

    GetProducts() {
        this.props.GetProductsStore(this.props.center.key, this.props.theproducts.productToPlay.store)
            .then(() => {
                this.ResetProductData();
                this.CloseModal();
            }).catch((err) => {
                Alert.alert(err);
            });
    }

    ResetProductData() {
        this.props.theproducts.productToPlay = {
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
        };
    }

    SaveDataField() {
        this.props.UploadFile('products', this.props.theproducts.productToPlay.img, `${this.props.theproducts.newKey}.png`, 'image/png')
            .then(() => {
                this.props.UpdateProductField(this.props.center.key, this.props.theproducts.productToPlay.store,
                    this.props.theproducts.productToPlay.key,
                    'img',
                    this.props.uploadFile.url, this.props.theproducts.productToPlay, true)
                    .then(() => {
                        this.props.theproducts.reloadList = true;
                        this.GoBack();
                    }).catch((error) => {
                        Alert.alert(error);
                    });
            }).catch((error) => {
                Alert.alert(error);
            });
    }

    render() {
        return (
            <View style={styles.containerWhite}>
                <ProgressCircle progress={this.props.uploadFile.progress / 100} indeterminate={false} visible={this.props.uploadFile.isUploading} />
                <View style={[styles.padding15, styles.marginTop30, { flex: 1 }]}>
                    <Text style={[styles.h5, styles.b8, styles.paddingBottom10, styles.textCenter]}>Imagen del producto</Text>
                    <Text style={[styles.h2, styles.b4, styles.textCenter]}>Toma una buena foto del producto y subela</Text>
                    <TouchableOpacity onPress={() => this.OpenImagePicker()} activeOpacity={0.8} style={[styles.margin30, styles.bgGray2, styles.itemsCenter, styles.rounded16, { flex: 1 }]}>
                        {
                            !this.state.next ?
                                <Icon
                                    name='picture-o'
                                    type='font-awesome'
                                    color='#fff'
                                    size={125}
                                    containerStyle={[styles.meCenter]}
                                /> :
                                <CachedImage
                                    style={[styles.backgroundImage]}
                                    source={{ uri: this.props.theproducts.productToPlay.img }}
                                    useQueryParamsInCacheKey
                                />
                        }
                    </TouchableOpacity>
                </View>

                <View style={[styles.padding10, styles.marginH30]}>
                    <TouchableOpacity
                        onPress={() => this.SaveProduct()}
                        disabled={!this.state.next}
                        activeOpacity={0.6}
                        style={[styles.rounded30,
                        styles.bgPrimary, styles.marginBottom10, styles.itemsCenter]}
                    >
                        <Text style={[styles.whiteColor, styles.margin20, styles.marginH50, styles.h2, this.state.next ? { opacity: 1 } : { opacity: 0.8 }]}>Guardar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.GoBack()}
                        activeOpacity={0.6}
                        style={[styles.marginBottom20, styles.itemsCenter]}
                    >
                        <Text style={[styles.primaryColor, styles.margin20, styles.marginH50, styles.h2, !this.props.uploadFile.isUploading ? { opacity: 1 } : { opacity: 0.8 }]}>{this.props.isEdit ? 'Cancelar' : 'Atrás'}</Text>
                    </TouchableOpacity>
                </View>
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
    UpdateProductField: (center, store, key, field, value, productToEdit, isImage) => dispatch(UpdateProductField(center, store, key, field, value, productToEdit, isImage))
});

export default connect(mapStateProps, mapDispacthToProps)(ImageProduct);
