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
import { GetKeyStore, UpdateStore, UpdateStoreField } from '../src/actions/store.actions';
import { UploadFile } from '../src/actions/uploadFile.actions';
import { GetStores } from '../src/actions/stores.actions';

const ImagePicker = require('react-native-image-picker');

class ImageStore extends Component {

    constructor(props) {
        super(props);
        this.state = {
            next: this.props.thestore.storeToPlay.img.trim() !== '',
        };
    }

    componentWillMount() {
        this.Init();
    }

    componentDidMount() {

    }

    Init() {

    }

    ValidateData(text) {
        this.props.thestore.description = text;
        if (text.trim().length > 3) {
            this.setState({ next: true });
        } else {
            this.setState({ next: false });
        }
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
                this.props.thestore.storeToPlay.img = response.uri;
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

    SaveCenter() {
        try {
            if (this.props.thestore.storeToPlay.img === '') {
                Alert.alert.Alert.alert('Debes elegir una imagen del negocio');
                return;
            }
            if (!this.props.isEdit) {
                this.SaveWholeCenter();
            } else {
                this.SaveDataField();
            }
        } catch (error) {
            Alert.alert(error);
        }
    }

    SaveWholeCenter() {
        this.props.GetKeyStore(this.props.center.key)
            .then(() => {
                this.props.UploadFile('stores', this.props.thestore.storeToPlay.img, `${this.props.thestore.key}.png`, 'image/png')
                    .then(() => {
                        const storeData = {
                            active: true,
                            center: this.props.center.key,
                            creation_date: Date.now(),
                            description: this.props.thestore.storeToPlay.description.trim(),
                            img: this.props.uploadFile.url,
                            last_change: Date.now(),
                            name: this.props.thestore.storeToPlay.name.trim(),
                            phone: '',
                            products_description: this.props.thestore.storeToPlay.products_description.trim(),
                            service_extra: parseInt(this.props.thestore.storeToPlay.service_extra.toString(), 0),
                            image_date: Date.now()
                        };
                        this.props.UpdateStore(this.props.center.key, this.props.thestore.key, storeData)
                            .then(() => {
                                this.GetStores();
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

    GetStores() {
        this.props.GetStores(this.props.center.key)
            .then(() => {
                this.ResetStoreData();
                this.CloseModal();
            }).catch((err) => {
                Alert.alert(err);
            });
    }

    ResetStoreData() {
        this.props.thestore.storeToPlay = {
            key: '',
            description: '',
            name: '',
            service_extra: '0',
            img: ''
        };
    }

    SaveDataField() {
        this.props.UploadFile('stores', this.props.thestore.storeToPlay.img, `${this.props.thestore.storeToPlay.key}.png`, 'image/png')
            .then(() => {
                this.props.UpdateStoreField(this.props.center.key, this.props.thestore.storeToPlay.key, 'img', this.props.uploadFile.url, this.props.thestore.storeToPlay, true)
                    .then(() => {
                        this.props.thestores.reloadList = true;
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
                    <Text style={[styles.h5, styles.b8, styles.paddingBottom10, styles.textCenter]}>Imagen del negocio</Text>
                    <Text style={[styles.h2, styles.b4, styles.textCenter]}>Toma una buena foto del negocio y subela</Text>
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
                                    source={{ uri: this.props.thestore.storeToPlay.img }}
                                    useQueryParamsInCacheKey
                                />
                        }
                    </TouchableOpacity>
                </View>

                <View style={[styles.padding10, styles.marginH30]}>
                    <TouchableOpacity
                        onPress={() => this.SaveCenter()}
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
    thestore: state.thestore,
    uploadFile: state.uploadFile,
    thestores: state.thestores
});

const mapDispacthToProps = dispatch => ({
    GetKeyStore: (center) => dispatch(GetKeyStore(center)),
    UpdateStore: (center, key, datastore) => dispatch(UpdateStore(center, key, datastore)),
    GetStores: (center) => dispatch(GetStores(center)),
    UploadFile: (reference, uri, fileName, mime) => dispatch(UploadFile(reference, uri, fileName, mime)),
    UpdateStoreField: (center, key, field, value, storeToEdit, isImage) => dispatch(UpdateStoreField(center, key, field, value, storeToEdit, isImage))
});

export default connect(mapStateProps, mapDispacthToProps)(ImageStore);
