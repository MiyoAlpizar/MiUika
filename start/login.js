import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import colors from '../globals/colors';
import TxtInput from '../controls/txtSq';
import { ValidateUser } from '../src/actions/user.actions';
import { LogUser } from '../src/actions/login.actions';
import { GetCenter, GetCenterStorage } from '../src/actions/center.actions';

const { width } = Dimensions.get('window');

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: 'miyo.alpizar@gmail.com',
      pwd: 'magdalitA'
    };
  }

  Login() {
    this.props.LogUser(this.state.email, this.state.pwd)
      .then(() => {
        if (this.props.login.isLoged) {
          this.props.ValidateUser()
            .then(() => {
              if (!this.props.user.user) {
                Alert.alert('Correo o contraseña incorrecta');
              } else {
                this.SetCenter();
              }
            });
        } else {
          Alert.alert('Correo o contraseña incorrecta');
        }
      })
      .catch((errr) => {
        Alert.alert(errr);
      });
  }

  SetCenter() {
    this.props.GetCenter()
      .then(() => {
        this.props.GetCenterStorage()
            .then(() => {
                this.GoHome(this.props.center.center, this.props.center.key);
            }).catch(err => Alert.alert(err));
      }).catch((err) => {
        Alert.alert(err);
      });
  }

  GoHome(center, key, animated = true) {
    this.props.navigator.resetTo({
      screen: 'Home',
      title: '',
      passProps: {},
      animated,
      navigatorStyle: {
        navBarButtonColor: colors.Primary,
        navBarTranslucent: true,
        navBarNoBorder: false,
        drawUnderNavBar: true,
        drawUnderTabBar: true,
        statusBarBlur: false,
        navBarBlur: false,
        navBarHidden: true,
      }
    });
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <View style={styles.container}>
          <StatusBar barStyle="light-content" />

          <Image source={require('../img/uika_delivery.jpg')} style={styles.topImage} />
          <View style={styles.form}>
            <TxtInput
              ref={(r) => { this.txtEmail = r; }}
              icon='mail'
              keyboardType='email-address'
              placeholder='Correo electrónico'
              returnKeyType='next'
              placeholderTextColor={'#A7A8A8'}
              autoCapitalize='none'
              onSubmitEditing={() => this.txtPwd.focus()}
              autoCorrect={false}
              value={this.state.email}
              onChangeText={(email) => this.setState({ email })}
            />
            <TxtInput
              ref={(r) => { this.txtPwd = r; }}
              icon='lock'
              secureTextEntry
              placeholder='Contraseña'
              placeholderTextColor={'#A7A8A8'}
              value={this.state.pwd}
              onChangeText={(pwd) => this.setState({ pwd })}
            />
            <TouchableOpacity style={styles.btnContainer} onPress={() => this.Login()} >
              <Text style={styles.text}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

}

const mapStateProps = state => ({
  user: state.user,
  login: state.login,
  center: state.center
});

const mapDispacthToProps = dispatch => ({
  LogUser: (email, pwd) => dispatch(LogUser(email, pwd)),
  ValidateUser: () => dispatch(ValidateUser()),
  GetCenter: () => dispatch(GetCenter()),
  GetCenterStorage: () => dispatch(GetCenterStorage()),
});

export default connect(mapStateProps, mapDispacthToProps)(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.Primary,
  },
  form:
  {
    paddingTop: 20,
    flex: 1,
    alignItems: 'center'

  },
  topImage:
  {
    height: 200,
    width,
    marginTop: 20
  },
  btnContainer:
  {
    backgroundColor: colors.Primary,
    paddingVertical: 16,
    borderRadius: 25,
    marginLeft: 15,
    marginRight: 15
  },
  text:
  {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600'
  }
});

