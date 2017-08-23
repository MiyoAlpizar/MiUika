import React, { Component } from 'react';
import {
    ScrollView,
    StatusBar,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    Platform,
    ActivityIndicator,
    Keyboard,
    ActionSheetIOS
} from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { getAllSwatches } from 'react-native-palette';
import { Icon } from 'react-native-elements';
import CachedImage from 'react-native-cached-image';
import {
    GetCenter,
    UpdateCenterData,
    GetCenterStorage,
    UpdateCenter
} from '../src/actions/center.actions';
import { UploadFile } from '../src/actions/uploadFile.actions';
import gStyles from '../globals/styles.global';
import colors from '../globals/colors.global';
import { ImageOptions } from '../globals/variables.globlal';

const ImagePicker = require('react-native-image-picker');

const HEIDER_HEIGHT = 70;

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: this.props.center.center.name,
            last_name: this.props.center.center.last_name,
            img_profile: this.props.center.center.img_profile,
            colorsBG: ['#fff', '#fff'],
            contrastedColors: ['#000', '#000'],
            contrastedColorsNumber: [1, 1],
            isUpdating: false,
            barStyle: 'light-content'
        };
    }

    componentWillMount() {
        this.Init();
    }

    componentDidMount() {

    }

    Init() {

    }

    OpenImagePicker() {
        ActionSheetIOS.showActionSheetWithOptions({
            options: ['Tomar foto ', 'Elegir foto', 'Cancelar'],
            cancelButtonIndex: 2,
            tintColor: colors.Primary
        },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        this.SetImage(1);
                        break;
                    case 1:
                        this.SetImage(2);
                        break;
                    default:
                        break;
                }
            });
    }

    SetImage(type) {
        setTimeout(() => {
            this.setState({ barStyle: 'dark-content' });
        }, 500);


        if (type === 1) {
            ImagePicker.launchCamera(ImageOptions, (response) => {
                if (!response.didCancel && !response.error && !response.customButton) {
                    this.GetColors(response);
                    this.setState({ img_profile: response.uri });
                } else if (response.error) {
                    Alert.alert(response.error);
                }
                this.setState({ barStyle: 'light-content' });
            });
        } else {
            ImagePicker.launchImageLibrary(ImageOptions, (response) => {
                if (!response.didCancel && !response.error && !response.customButton) {
                    this.GetColors(response);
                    this.setState({ img_profile: response.uri });
                } else if (response.error) {
                    Alert.alert(response.error);
                }
                this.setState({ barStyle: 'light-content' });
            });
        }
    }

    UploadImage(name, img) {
        this.props.UploadFile('centers',
            img, `${name}.png`, 'image/png')
            .then(() => {
                this.UpdateCenter();
            }).catch(() => {
                Alert.alert(this.props.uploadFile.message);
                this.setState({ isUpdating: false });
            });
    }

    GetColors(response) {
        const path = Platform.OS === 'ios' ? response.origURL : response.path;
        const Colors = [];
        const Contrasted = [];
        const ContrastedNumber = [];
        let i = 0;
        getAllSwatches({}, path, (error, swatches) => {
            if (error) {
                console.log(error);
            } else {
                swatches.sort((a, b) => b.population - a.population);
                swatches.forEach((swatch) => {
                    if (i < 2) {
                        Colors.push(swatch.color);
                        if (i === 0) {
                            Contrasted.push(swatch.titleTextColor);
                            ContrastedNumber.push(swatch.population);
                        }
                        if (i === 1) {
                            Contrasted.push(swatch.titleTextColor);
                            ContrastedNumber.push(swatch.population);
                        }
                        i++;
                    }
                });

                this.setState({
                    colorsBG: Colors,
                    contrastedColors: Contrasted,
                    contrastedColorsNumber: ContrastedNumber
                });
            }
        });
    }

    RenderHeader() {
        return (
            <LinearGradient
                style={[gStyles.flex1,
                gStyles.AbsoluteWithHeight,
                gStyles.paddingTop20,
                { height: HEIDER_HEIGHT, zIndex: 1 }]}
                colors={colors.Gradient}
                start={{ x: 0.0, y: 0.5 }}
                end={{ x: 1.0, y: 0.5 }}
            >
                <View
                    style={[gStyles.flex1,
                    gStyles.VCenter,
                    gStyles.paddingH15,
                    gStyles.flexRow]}
                >
                    <View style={[gStyles.VCenter, gStyles.LeftButton]}>
                        <TouchableOpacity
                            onPress={() => this.CloseModal()}
                        >
                            <Text style={[gStyles.h2, gStyles.whiteColor]}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[gStyles.flex1, gStyles.itemsCenter]}>
                        <Text
                            style={[gStyles.h3, gStyles.b7, gStyles.whiteColor]}
                        >
                            CUENTA
                        </Text>
                    </View>
                    <View style={[gStyles.VCenter, gStyles.RightButton]}>
                        {!this.state.isUpdating ?
                            <TouchableOpacity
                                onPress={() => this.ValidateChanges()}
                                style={[gStyles.paddingLeft15]}
                            >
                                 <Text style={[gStyles.h2, gStyles.whiteColor]}>Aceptar</Text>
                            </TouchableOpacity>
                            :
                            <ActivityIndicator color='white' />
                        }
                    </View>
                </View>
            </LinearGradient>
        );
    }

    CloseModal() {
        if (this.state.isUpdating) {
            return;
        }

        this.props.navigator.dismissModal({
            animationType: 'slide-down'
        });
    }

    ValidateChanges() {
        Keyboard.dismiss();
        const { center } = this.props.center;
        if (this.state.name !== center.name ||
            this.state.last_name !== center.last_name ||
            this.state.img_profile !== center.img_profile) {
            this.setState({ isUpdating: true });
            this.ValidateImage();
        } else {
            this.CloseModal();
        }
    }

    ValidateImage() {
        const { center } = this.props.center;
        if (this.state.img_profile !== center.img_profile) {
            this.UploadImage(this.props.center.key, this.state.img_profile);
        } else {
            this.UpdateCenter();
        }
    }

    UpdateCenter() {
        const centerData = {
            name: this.state.name.trim(),
            last_name: this.state.last_name.trim()
        };

        if (this.state.img_profile !== this.props.center.center.img_profile) {
            centerData.img_profile = this.props.uploadFile.url;
            centerData.colors_profile = this.state.colorsBG;
            centerData.colors_contrast = this.state.contrastedColors;
            centerData.colors_contrast_number = this.state.contrastedColorsNumber;
            centerData.image_date = Date.now();
        }

        this.props.UpdateCenter(this.props.center.key, centerData)
            .then(() => {
                this.setState({ isUpdating: false });
                this.CloseModal();
            }).catch((error) => {
                Alert.alert(error);
                this.setState({ isUpdating: false });
            });
    }

    render() {
        return (
            <View style={gStyles.container}>
                <StatusBar barStyle={this.state.barStyle} />
                {this.RenderHeader()}
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    contentInset={{ top: HEIDER_HEIGHT }}
                    contentOffset={{ y: -HEIDER_HEIGHT }}
                >
                    <View style={[gStyles.flex1]}>
                        <Text
                            style={[gStyles.hs12,
                            gStyles.padding15,
                            gStyles.GrayColor7,
                            gStyles.paddingBottom10]}
                        >
                            Tu foto de perfil será mostrada en el mapa de la Aplicación de
                            Clientes (Uika),
                            ésta imagen deberá representarte a ti como persona, mostrando
                            de forma clara tu rostro.
                        </Text>
                        <View style={[gStyles.line1]} />
                        <View style={[gStyles.bgWhite, gStyles.padding10, gStyles.VCenter]}>
                            <View style={[gStyles.flexRow]}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => this.OpenImagePicker()}
                                >
                                    <CachedImage
                                        useQueryParamsInCacheKey
                                        source={{ uri: this.state.img_profile }}
                                        style={gStyles.imgRounded70}
                                    />
                                </TouchableOpacity>

                                <View style={[gStyles.flex1, gStyles.paddingLeft10]}>
                                    <TextInput
                                        placeholder='Nombre'
                                        placeholderTextColor={colors.Primary}
                                        selectionColor={colors.Primary}
                                        style={[gStyles.flex1, gStyles.input1]}
                                        value={this.state.name}
                                        onChangeText={(name) => this.setState({ name })}
                                    />
                                    <View style={[gStyles.line1]} />
                                    <TextInput
                                        placeholder='Apellidos'
                                        placeholderTextColor={colors.Primary}
                                        selectionColor={colors.Primary}
                                        style={[gStyles.flex1, gStyles.input1]}
                                        value={this.state.last_name}
                                        onChangeText={(lastName) =>
                                            this.setState({ last_name: lastName })}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={[gStyles.line1]} />

                        <Text
                            style={[gStyles.hs12,
                            gStyles.padding15,
                            gStyles.GrayColor7,
                            gStyles.paddingBottom10]}
                        >
                            Debes proporcionar información veridica, ya que en base a esto
                            recibirás calificaciones
                        </Text>

                    </View>
                </ScrollView>
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
    GetCenter: () => dispatch(GetCenter()),
    GetCenterStorage: () => dispatch(GetCenterStorage()),
    UpdateCenterData: (uid, field, value) => dispatch(UpdateCenterData(uid, field, value)),
    UpdateCenter: (center, datacenter) => dispatch(UpdateCenter(center, datacenter)),
    UploadFile: (reference, uri, fileName, mime) =>
        dispatch(UploadFile(reference, uri, fileName, mime))
});

export default connect(mapStateProps, mapDispacthToProps)(Profile);
