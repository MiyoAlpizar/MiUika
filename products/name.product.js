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

class NameProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            next: this.props.theproducts.productToPlay.name.trim().length > 3,
            keyBoardShown: false,
            timeNext: 0
        };

        if (!this.props.isEdit) {
            this.props.navigator.setButtons({
                leftButtons: [
                    {
                        title: 'Cancelar',
                        id: 'cancel',
                        disabled: false,
                        disableIconTint: true,
                        showAsAction: 'ifRoom',
                    }
                ]
            });
        }

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
            } else if (event.id === 'cancel') {
                this.CloseModal();
            }
        }
    }

    keyboardDidShow() {
        this.setState({ keyBoardShown: true, timeNext: 550 });
    }

    keyboardDidHide() {
        this.setState({ keyBoardShown: false, timeNext: 0 });
    }

    CloseModal() {
        this.ResetStoreData();
        this.props.navigator.dismissModal({
            animationType: 'slide-down'
        });
    }

    ResetStoreData() {
        this.props.theproducts.productToPlay = {
            active: true,
            center: '',
            cost: 0,
            creation_date: null,
            name: '',
            img: '',
            last_change: null,
            description: '',
            price: 0,
            price_a12: 0,
            store: ''
        };
    }

    ValidateData(text) {
        if (text == null) { return; }

        this.props.theproducts.productToPlay.name = text;
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
            'name',
            this.props.theproducts.productToPlay.name,
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
                    title="Nombre del producto"
                    subtitle=""
                    detail=""
                    placeholder="Nombre del producto"
                    showBottomButton={!this.props.isEdit}
                    value={this.props.theproducts.productToPlay.name}
                    onChangeText={(value) => this.ValidateData(value)}
                    onPressButton={() => this.GoNext('DescriptionProduct')}
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

export default connect(mapStateProps, mapDispacthToProps)(NameProduct);
