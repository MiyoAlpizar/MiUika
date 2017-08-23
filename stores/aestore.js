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
import { GetKeyStore, UpdateStore } from '../src/actions/store.actions';
import { GetStores } from '../src/actions/stores.actions';
import { UploadFile } from '../src/actions/uploadFile.actions';
import styles from '../globals/styles.global';
import FieldCheck from '../components/FieldCheck';
import { isTextValid, isNumeric } from '../globals/functions';
import ProgressCircle from '../controls/progressCircle';
import colors from '../globals/colors.global';

const ImagePicker = require('react-native-image-picker');

const NAV_HEIGHT = 60;

class AEStore extends Component {
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
            name: this.props.thestore.storeToPlay.name,
            description: this.props.thestore.storeToPlay.description,
            products_description: this.props.thestore.storeToPlay.products_description,
            service_extra: this.props.thestore.storeToPlay.service_extra.toString(),
            active: this.props.thestore.storeToPlay.active,
            img: this.props.thestore.storeToPlay.img,
            isNewImage: false,
            canSave: true
        };

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidMount() {
        this.ValidateData();
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'save') {
                this.SaveStore();
            }
            if (event.id === 'cancel') {
                this.CloseModal();
            }
        }
    }

    setButtonsDisabled(disabled, cancelDiabled = false) {
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
                    disabled: cancelDiabled,
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
                this.props.thestore.storeToPlay.img = response.uri;
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
                    if (!isTextValid(this.state.products_description, 3)) {
                        resolve(false);
                    }
                    if (!isTextValid(this.state.img, 3)) {
                        resolve(false);
                    }
                    if (!isNumeric(this.state.service_extra)) {
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

    SaveStore() {
        Keyboard.dismiss();

        if (!isTextValid(this.state.name, 3)) {
            Alert.alert('Debes escribir un nombre de negocio');
            this.Name.refs.Input.focus();
            return;
        }
        if (!isTextValid(this.state.description, 3)) {
            Alert.alert('Debes escribir una descripción de negocio');
            this.Description.refs.Input.focus();
            return;
        }
        if (!isTextValid(this.state.products_description, 3)) {
            Alert.alert('Debes escribir algunos productos');
            this.Products.refs.Input.focus();
            return;
        }

        if (!isNumeric(this.state.service_extra)) {
            Alert.alert('Debes escribir un servicio extra númerico');
            this.Cost.refs.Input.focus();
            return;
        }

        if (!isTextValid(this.state.img, 3)) {
            Alert.alert('Debes elegir una imagen de negocio');
            return;
        }

        this.setButtonsDisabled(true, true);
        if (this.props.isEdit) {
            this.EditStore();
        } else {
            this.PushStore();
        }
    }

    PushStore() {
        this.props.GetKeyStore(this.props.center.key)
            .then(() => {
                this.UploadImage(this.props.thestore.key);
            });
    }

    UploadImage(name) {
        this.props.UploadFile('stores',
            this.props.thestore.storeToPlay.img, `${name}.png`, 'image/png')
            .then(() => {
                if (this.props.isEdit) {
                    this.UpdateStore();
                } else {
                    this.NewStore();
                }
            }).catch(() => {
                this.setButtonsDisabled(false, false);
            });
    }

    NewStore() {
        const storeData = {
            active: true,
            center: this.props.center.key,
            creation_date: Date.now(),
            description: this.state.description.trim(),
            img: this.props.uploadFile.url,
            last_change: Date.now(),
            name: this.state.name.trim(),
            phone: '',
            products_description: this.state.products_description.trim(),
            service_extra: parseInt(this.state.service_extra.toString(), 0),
            image_date: Date.now()
        };
        this.props.UpdateStore(this.props.center.key, this.props.thestore.key, storeData)
            .then(() => {
                this.props.GetStores(this.props.center.key);
                this.CloseModal();
            }).catch((error) => {
                Alert.alert(error);
                this.setButtonsDisabled(false, false);
            });
    }

    EditStore() {
        if (this.state.isNewImage) {
            this.UploadImage(this.props.thestore.storeToPlay.key);
        } else {
            this.UpdateStore();
        }
    }

    UpdateStore() {
        const storeData = {
            active: true,
            center: this.props.center.key,
            description: this.state.description.trim(),
            last_change: Date.now(),
            name: this.state.name.trim(),
            products_description: this.state.products_description.trim(),
            service_extra: parseInt(this.state.service_extra.toString(), 0),
        };

        if (this.state.isNewImage) {
            storeData.image_date = Date.now();
            storeData.img = this.props.uploadFile.url;
        }

        this.props.UpdateStore(this.props.center.key, this.props.thestore.storeToPlay.key, storeData)
            .then(() => {
                this.props.GetStores(this.props.center.key);
                this.CloseModal();
            }).catch((error) => {
                Alert.alert(error);
                this.setButtonsDisabled(false, false);
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
                        this.Products.refs.Input, this.Cost.refs.Input]}
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
                            title='Nombre del negocio'
                            placeholder="Nombre"
                            value={this.state.name}
                            onChangeText={(value) => { this.setState({ name: value }); this.ValidateData(); }}
                            minLenght={3}
                            ref={(r) => { this.Name = r; }}
                            onSubmitEditing={() => this.Description.refs.Input.focus()}
                        />
                        <FieldCheck
                            title='Descripción del negocio'
                            placeholder="Lema o descripción"
                            value={this.state.description}
                            onChangeText={(value) => { this.setState({ description: value }); this.ValidateData(); }}
                            minLenght={3}
                            ref={(r) => { this.Description = r; }}
                            onSubmitEditing={() => this.Products.refs.Input.focus()}
                        />

                        <FieldCheck
                            title='Productos'
                            placeholder="Ej: Las mejores enchiladas"
                            value={this.state.products_description}
                            onChangeText={(value) => { this.setState({ products_description: value }); this.ValidateData(); }}
                            minLenght={3}
                            ref={(r) => { this.Products = r; }}
                            onSubmitEditing={() => this.Cost.refs.Input.focus()}
                            detail={'Escribe algunos productos para llamar la atención de tus clientes.'}
                        />

                        <FieldCheck
                            title='Servicio extra'
                            placeholder="Costo extra"
                            value={this.state.service_extra}
                            onChangeText={(value) => { this.setState({ service_extra: value }); this.ValidateData(); }}
                            minLenght={3}
                            maxLenght={2}
                            keyboardType={'number-pad'}
                            isNumeric
                            returnKeyType={'done'}
                            ref={(r) => { this.Cost = r; }}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            detail={'¿Este negocio te queda lejos o el tiempo de espera es largo?. Puedes cobrar un adicional.'}
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
    user: state.user,
    center: state.center,
    thestore: state.thestore,
    uploadFile: state.uploadFile
});

const mapDispacthToProps = dispatch => ({
    GetKeyStore: (center) => dispatch(GetKeyStore(center)),
    UpdateStore: (center, key, datastore) => dispatch(UpdateStore(center, key, datastore)),
    GetStores: (center) => dispatch(GetStores(center)),
    UploadFile: (reference, uri, fileName, mime) =>
        dispatch(UploadFile(reference, uri, fileName, mime))
});

export default connect(mapStateProps, mapDispacthToProps)(AEStore);

