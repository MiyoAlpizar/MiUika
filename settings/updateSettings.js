import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    StatusBar,
    ScrollView,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import { UpdateCenterData } from '../src/actions/center.actions';
import colors from '../globals/colors';

class UpdateSettings extends Component {

    static navigatorButtons = {
        rightButtons: [
            {
                title: 'Guardar',
                id: 'guardar',
                showAsAction: 'ifRoom',
            }
        ]
    }

    constructor(props) {
        super(props);
        this.state = {
            valueSetting: ''
        };
        this.props.navigator.setOnNavigatorEvent(this.OnNavigatorEvent.bind(this));
    }
    componentWillMount() {
        this.Init();
    }

    componentDidMount() {
        this.setState({
            valueSetting: this.props.value.toString()
        });
    }

    OnNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'guardar') {
                this.UpdateValue(this.state.valueSetting);
            }
        }
    }

    Init() {
        setTimeout(() => {
            this.refs.txtValue.focus();
        }, 550);
    }

    UpdateValue(value) {
        if (this.props.min >= 0) {
            if (value < this.props.min) {
                Alert.alert('Atención',
                    `El costo de ${this.props.title} debe ser mayor o igual a ${this.props.min}`, [
                        { text: 'Ok', onPress: () => this.refs.txtValue.focus() }
                    ]);
                return;
            }
        }
        if (this.props.center.center.isUpdating) {
            return;
        }
        this.props.UpdateCenterData(this.props.center.key, this.props.field, value)
            .then(() => {
                this.props.navigator.pop({
                    animated: true
                });
            }).catch((error) => {
                Alert.alert(error);
            });
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
                    <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
                        <StatusBar barStyle="dark-content" />
                        <Text style={styles.title} >
                            {this.props.title}
                        </Text>
                        <TextInput
                            ref="txtValue"
                            style={styles.txtValue}
                            value={this.state.valueSetting}
                            onChangeText={(value) => this.setState({ valueSetting: value })}
                            keyboardType="numeric"
                        />
                        <Text style={styles.txtSubititle} >
                            {this.props.subtitle}
                        </Text>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </ScrollView>

        );
    }
}

UpdateSettings.navigatorStyle = {
    drawUnderNavBar: true,
    navBarTranslucent: true,
    navBarBlur: false,
    drawUnderTabBar: true,
    navBarHideOnScroll: false,
    navBarButtonColor: colors.Primary,
    navBarNoBorder: false,
    statusBarTextColorSchemeSingleScreen: 'light'
};

const mapStateProps = state => ({
    user: state.user,
    center: state.center
});

const mapDispacthToProps = dispatch => ({
    UpdateCenterData: (uid, field, value) => dispatch(UpdateCenterData(uid, field, value))
});

export default connect(mapStateProps, mapDispacthToProps)(UpdateSettings);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.LightBackground,
        paddingTop: 80
    },
    txtValue: {
        fontSize: 120,
        textAlign: 'center',
        height: 140
    },
    title: {
        fontSize: 48,
        textAlign: 'center'
    },
    txtSubititle: {
        padding: 15,
        color: colors.TextSecundary,
        fontSize: 14
    }
});
