import React, { Component } from 'react';
import {
    View,
    Alert,
    Text,
    StyleSheet,
    SegmentedControlIOS,
    LayoutAnimation,
    TouchableWithoutFeedback,
    Switch,
    Slider,
    TouchableOpacity,
    StatusBar,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import { Icon } from 'react-native-elements';
import { BlurView } from 'react-native-blur';
import { UpdateCenterData, UpdateCenterLocation } from '../src/actions/center.actions';
import { GetLocation } from '../src/actions/geolocation.actions';
import gStyles from '../globals/styles.global';
import colors from '../globals/colors.global';
import STB from '../uis/stb';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
class KmBase extends Component {

    constructor(props) {
        super(props);
        this.state = {
            radius: 0,
            selectedMapIndex: 0,
            mapType: 'standard',
            cardHeight: 0,
            cardBottom: -800.0,
            cardVisible: false,
            cardOpacity: 0.0,
            blurBG: 'rgba(247,247,247,0.4)',
            stusBarStyle: 'dark-content',
            colorBack: colors.Primary
        };
    }
    componentWillMount() {

    }

    componentDidMount() {
        this.Init();
    }

    Init() {
        this.props.GetLocation()
            .then(() => {
                setTimeout(() => {
                    this.CalculateRegion();
                }, 1200);
                setTimeout(() => {
                    this.setState({ radius: this.props.center.center.km_base * 1000 });
                }, 3250);
            }).catch((error) => {
                Alert.alert(error.message);
            });
    }

    RefreshLocation() {
        this.props.GetLocation()
            .then(() => {
                setTimeout(() => {
                    this.ZoomMap(this.props.geolocation.region, 50);
                }, 50);
            }).catch((error) => {
                Alert.alert(error.message);
            });
    }

    ZoomMap(region, timeout = 800) {
        setTimeout(() => {
            if (this.map != null) {
                this.map.animateToRegion(region, 1200);
            }
        }, timeout);
    }

    UpdateKmBase(value) {
        if (this.props.center.center.isUpdating) {
            return;
        }
        this.setState({ radius: value * 1000 });
        this.props.UpdateCenterData(this.props.center.key, 'km_base', value)
            .then(() => {
                this.CalculateRegion();
            }).catch((error) => {
                Alert.alert(error);
            });
    }

    CalculateRegion() {
        const { region } = this.props.geolocation;
        const rKM = this.props.center.center.km_base;
        const kmInLongitudeDegree = 111.320 * Math.cos((region.latitude / 180.0) * Math.PI);
        const deltaLat = rKM / 111.1;
        const deltaLong = rKM / kmInLongitudeDegree;
        const newRegion = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: deltaLat,
            longitudeDelta: deltaLong / (ASPECT_RATIO * 0.85),
        };
        this.ZoomMap(newRegion);
    }

    UpdateWalking(value) {
        if (this.props.center.center.isUpdating) {
            return;
        }
        this.props.center.center.walking = value;
        this.props.UpdateCenterData(this.props.center.key, 'walking', value)
            .then(() => {

            }).catch((error) => {
                Alert.alert(error);
            });
    }

    CloseModal() {
        this.props.navigator.pop({

        });
    }

    ToggleOptions() {
        const show = !this.state.cardVisible;
        if (show) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut, () => {
                this.setState({ cardVisible: show });
                setTimeout(() => {
                    this.setState({ cardOpacity: 0.3 });
                }, 250);
            });
            this.setState({ cardBottom: 0 });
        } else {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut, () => {
                this.setState({ cardOpacity: 0.0 });
                this.setState({ cardVisible: show });
            });
            this.setState({ cardBottom: -this.state.cardHeight });
        }
    }

    ChangeMapType(index) {
        this.setState({ selectedMapIndex: index });
        switch (index) {
            case 0:
                this.setState({
                    mapType: 'standard',
                    stusBarStyle: 'dark-content',
                    blurBG: 'rgba(247,247,247,0.4)',
                    colorBack: colors.Primary
                });
                break;
            case 1:
                this.setState({
                    mapType: 'satellite',
                    stusBarStyle: 'light-content',
                    blurBG: 'rgba(0,0,0,0.4)',
                    colorBack: 'white'
                });
                break;
            case 2:
                this.setState({
                    mapType: 'hybrid',
                    stusBarStyle: 'light-content',
                    blurBG: 'rgba(0,0,0,0.4)',
                    colorBack: 'white'
                });
                break;
            default:
                this.setState({
                    mapType: 'standard',
                    stusBarStyle: 'dark-content',
                    blurBG: 'rgba(247,247,247,0.4)',
                    colorBack: colors.Primary
                });
        }
    }

    UpdateLocation() {
        this.props.GetLocation()
            .then(() => {
                this.props.UpdateCenterLocation(
                    this.props.center.key,
                    this.props.geolocation.region)
                    .then(() => {

                    }).catch(() => {
                        Alert.alert('Error');
                    });
            })
            .catch((error) => {
                Alert.alert(error.message);
            });
    }

    render() {
        return (
            <View style={[gStyles.flex1]}>
                <StatusBar barStyle={this.state.stusBarStyle} />
                {this.props.geolocation.region != null ?
                    < MapView
                        ref={ref => { this.map = ref; }}
                        style={[gStyles.flex1]}
                        showsUserLocation
                        region={this.state.region}
                        mapType={this.state.mapType}
                        showsMyLocationButton
                        showsCompass={false}
                    >
                        {this.state.radius > 0 ? <MapView.Circle
                            key={(this.props.geolocation.region.latitude +
                                this.props.geolocation.region.longitude +
                                this.state.radius).toString()
                            }
                            center={this.props.geolocation.region}
                            radius={this.state.radius}
                            fillColor={colors.PrimaryOpacity3}
                            strokeColor={colors.PrimaryOpacity}
                            zIndex={2}
                            strokeWidth={2}
                        />
                            : null}
                    </ MapView>
                    : null}
                <View
                    style={[styles.overlay]}
                    pointerEvents={this.state.cardVisible ? 'auto' : 'none'}
                >
                    <TouchableWithoutFeedback
                        onPress={() => this.ToggleOptions()}
                    >
                        <View
                            style={[gStyles.flex1,
                            { backgroundColor: 'rgba(0,0,0,1)', opacity: this.state.cardOpacity }]}
                        />
                    </TouchableWithoutFeedback>
                    <View style={[styles.containerCard, { bottom: this.state.cardBottom }]}>
                        <BlurView
                            blurType={'light'}
                            blurAmount={10}
                            onLayout={(event) => {
                                const { height } = event.nativeEvent.layout;
                                this.setState({ cardHeight: height });
                            }}
                        >
                            <View style={[gStyles.paddingTop25, styles.card]}>
                                <Text
                                    style={[gStyles.h4, gStyles.b7, gStyles.flex1,
                                    gStyles.marginBottom15]}
                                >Configuración de reparto
                                </Text>
                                <SegmentedControlIOS
                                    values={['Mapa', 'Satélite', 'Hibrido']}
                                    selectedIndex={this.state.selectedMapIndex}
                                    tintColor={colors.Primary}
                                    onChange={(event) => {
                                        this.ChangeMapType(event.nativeEvent.selectedSegmentIndex);
                                    }}
                                />
                                <View
                                    style={[gStyles.line1, gStyles.marginBottom10,
                                    gStyles.marginTop10]}
                                />
                                <View style={[gStyles.flexRow, gStyles.itemsCenter, gStyles.marginBottom10]}>
                                    <Text
                                        style={[gStyles.flex1, gStyles.h2, gStyles.b4]}
                                    >Ambulante</Text>
                                    <Switch
                                        value={this.props.center.center.walking}
                                        onValueChange={(value) => this.UpdateWalking(value)}
                                        onTintColor={colors.Secundary}
                                    />
                                </View>
                                <Text style={[gStyles.h1, gStyles.b7, gStyles.primaryMirrorColor]}>
                                    Podrás recibir pedidos dónde quiera que estés.
                                </Text>
                                <Text style={[gStyles.h0, gStyles.b2]}>
                                    Tu ubicación se actualizará constantemente en segundo plano.
                                </Text>
                            </View>
                            <View style={[gStyles.padding5]} />
                            <View style={[styles.card]}>
                                <Text
                                    style={[gStyles.h4, gStyles.b7, gStyles.flex1,
                                    gStyles.marginBottom15]}
                                >Radio de reparto
                                </Text>
                                <Slider
                                    minimumValue={1}
                                    maximumValue={20}
                                    value={this.props.center.center.km_base}
                                    step={0.5}
                                    minimumTrackTintColor={colors.Primary}
                                    onSlidingComplete={(value) => this.UpdateKmBase(value)}
                                    onValueChange={(value) => {
                                        this.props.center.center.km_base = value;
                                        this.setState({ radius: value * 1000 });
                                    }}
                                />
                                <Text
                                    style={[gStyles.h1]}
                                >{`${parseFloat(this.props.center.center.km_base).toFixed(2).toString()} kilometros`}
                                </Text>
                                <View
                                    style={[gStyles.line1, gStyles.marginBottom15,
                                    gStyles.marginTop10]}
                                />
                                <TouchableOpacity
                                    onPress={() => this.UpdateLocation()}
                                >
                                    <Text
                                        style={[gStyles.primaryColor, gStyles.h1]}
                                    >Marcar ubicación como centro de reparto
                                    </Text>
                                </TouchableOpacity>
                                <View style={[gStyles.line1, gStyles.marginTop15, gStyles.marginBottom10]} />
                                <Text style={[gStyles.h0, gStyles.b2]}>
                                    Cuando la opción de Ambulante no esté activa
                                </Text>
                            </View>
                        </BlurView>
                    </View>
                </View>
                <STB blurType='light' backgroundColor={this.state.blurBG} />
                <View style={styles.btnOptions}>
                    <View style={styles.containerOptions}>
                        <Icon
                            type='ionicon'
                            name='ios-information-circle-outline'
                            size={36}
                            color={colors.Primary}
                            underlayColor={'transparent'}
                            onPress={() => this.ToggleOptions()}
                        />
                        <View
                            style={[gStyles.line1, gStyles.marginBottom10, gStyles.marginTop10]}
                        />
                        <Icon
                            type='ionicon'
                            name='ios-navigate-outline'
                            size={36}
                            color={colors.Primary}
                            underlayColor={'transparent'}
                            onPress={() => this.RefreshLocation()}
                        />
                    </View>
                </View>
                <View style={styles.btnBack}>
                    <Icon
                        type='ionicon'
                        name='ios-arrow-back'
                        size={38}
                        color={this.state.colorBack}
                        underlayColor={'transparent'}
                        onPress={() => this.CloseModal()}
                        style={[gStyles.paddingRight25]}
                    />
                </View>
            </View>
        );
    }
}

const mapStateProps = state => ({
    user: state.user,
    center: state.center,
    geolocation: state.geolocation
});

const mapDispacthToProps = dispatch => ({
    UpdateCenterData: (uid, field, value) => dispatch(UpdateCenterData(uid, field, value)),
    GetLocation: () => dispatch(GetLocation()),
    UpdateCenterLocation: (center, region) => dispatch(UpdateCenterLocation(center, region))
});

export default connect(mapStateProps, mapDispacthToProps)(KmBase);

const styles = StyleSheet.create({
    btnOptions: {
        position: 'absolute',
        top: 30,
        right: 10,
        zIndex: 3
    },
    btnBack: {
        position: 'absolute',
        top: 30,
        left: 15,
        zIndex: 3
    },
    btn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'white',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 1,
        shadowOpacity: 0.4
    },
    options: {
        position: 'absolute',
        top: 80,
        right: 10,
        zIndex: 4
    },
    containerOptions: {
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.9)',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 1,
        shadowOpacity: 0.4,
        padding: 10,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 4,
    },
    containerCard: {
        position: 'absolute',
        bottom: -2000,
        right: 0,
        left: 0,
        overflow: 'hidden',
        borderTopLeftRadius: 9,
        borderTopRightRadius: 9
    },
    cardOptions: {
        backgroundColor: 'rgba(247,247,247,0.9)',
        borderTopLeftRadius: 9,
        borderTopRightRadius: 9,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 20
    }
});
