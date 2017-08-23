import React, { Component } from 'react';
import {
    Keyboard,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import FieldInfo from '../components/FieldInfo';
import { UpdateProductField } from '../src/actions/products.actions';
import Content from '../components/Content';
import colors from '../globals/colors.global';

class DescriptionProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            next: this.props.theproducts.productToPlay.description.trim().length > 3,
            keyBoardShown: false,
            timeNext: 0
        };

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.SetSaveButton(!this.state.next);
    }

    componentWillMount() {
         this.keyboardDidShowListener = 
        Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
        this.keyboardDidHideListener = 
        Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
    }   

    componentDidMount() {
        
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'save') {
                this.SaveDataField();
            }
        }
    }

    keyboardDidShow() {
        this.setState({ keyBoardShown: true, timeNext: 550 });
    }

    keyboardDidHide() {
        this.setState({ keyBoardShown: false, timeNext: 0 });
    }

    ValidateData(text) {
        if (text == null) { return; }

        this.props.theproducts.productToPlay.description = text;
        if (text.trim().length > 3) {
            this.setState({ next: true });
            this.SetSaveButton(false);
        } else {
            this.setState({ next: false });
            this.SetSaveButton(true);
        }
    }

    GoNext(screen) {
        Keyboard.dismiss();
        setTimeout(() => {
            this.props.navigator.push({
                screen,
                title: '',
                passProps: {},
                animated: true,
                navigatorStyle: {
                    navBarButtonColor: colors.Primary,
                    navBarTranslucent: true,
                    navBarNoBorder: false,
                    drawUnderNavBar: true,
                    drawUnderTabBar: true,
                    navBarBlur: false,
                    navBarHidden: false,
                    disabledBackGesture: true
                }
            });
        }, this.state.timeNext);
    }

    GoBack() {
        this.props.navigator.pop({
            animated: true
        });
    }

    SaveDataField() {
       this.props.UpdateProductField(this.props.center.key, this.props.theproducts.productToPlay.store,
            this.props.theproducts.productToPlay.key,
            'description',
            this.props.theproducts.productToPlay.description,
            this.props.theproducts.productToPlay)
            .then(() => {
                this.props.theproducts.reloadList = true;
                this.GoBack();
            }).catch((error) => {
                Alert.alert(error);
            });
    }

    SetSaveButton(disabled) {
        if (this.props.isEdit) {
            this.props.navigator.setButtons({
                rightButtons: [
                    {
                        title: 'Guardar',
                        id: 'save',
                        disabled,
                        disableIconTint: true,
                        showAsAction: 'ifRoom',
                    }
                ]
            });
        }
    }

    render() {
        return (
            <Content
                isBussy={this.props.theproducts.isBussy}
            >
                <FieldInfo
                    title="Descripción del producto"
                    subtitle="¿Tiene alguna característica especial, como tamaño color o presentación?"
                    detail="Escribe una característica del producto, o algo para que el cliente sepa que tiene que especificar a la hora de realizar el pedido."
                    placeholder="Descripción del producto"
                    showBottomButton={!this.props.isEdit}
                    value={this.props.theproducts.productToPlay.description}
                    onChangeText={(value) => this.ValidateData(value)}
                    onPressButton={() => this.GoNext('CostProduct')}
                    buttonDisabled={!this.state.next}
                    maxLength={100}
                    focusDelay={this.props.isEdit ? 1000 : 1000}
                />
            </Content>
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

export default connect(mapStateProps, mapDispacthToProps)(DescriptionProduct);
