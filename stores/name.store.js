import React, { Component } from 'react';
import {
    Keyboard,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import FieldInfo from '../components/FieldInfo';
import Content from '../components/Content';
import colors from '../globals/colors.global';

import { UpdateStoreField } from '../src/actions/store.actions';

class NameStore extends Component {

    constructor(props) {
        super(props);
        this.state = {
            next: this.props.thestore.storeToPlay.name.trim().length > 3
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
        this.Init();
    }

    componentDidMount() {

    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'cancel') {
                this.CloseModal();
            }
            if (event.id === 'save') {
                this.SaveDataField();
            }
        }
    }

    Init() {

    }

    CloseModal() {
        this.ResetStoreData();
        this.props.navigator.dismissModal({
            animationType: 'slide-down'
        });
    }

    ValidateName(text) {
        this.props.thestore.storeToPlay.name = text;
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
                passProps: { focus: false },
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
        }, 550);
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

    RemoveDataStore() {
        if (this.props.isEdit) {
            this.props.thestore.name = '';
        }
    }

    SaveDataField() {
        this.props.UpdateStoreField(this.props.center.key, this.props.thestore.storeToPlay.key,
            'name', this.props.thestore.storeToPlay.name, this.props.thestore.storeToPlay)
            .then(() => {
                this.props.thestores.reloadList = true;
                this.GoBack();
            }).catch((error) => {
                Alert.alert(error);
            });
    }

    GoBack() {
        this.props.navigator.pop({
            animated: true
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
                isBussy={this.props.thestore.bussy}
            >
                <FieldInfo
                    title="¿Cuál es el nombre del negocio?"
                    placeholder="Nombre del negocio"
                    showBottomButton={!this.props.isEdit}
                    value={this.props.thestore.storeToPlay.name}
                    onChangeText={(value) => this.ValidateName(value)}
                    onPressButton={() => this.GoNext('DescriptionStore')}
                    buttonDisabled={!this.state.next}
                    autoFocus={this.props.autoFocus}
                />
            </Content>
        );
    }


}


const mapStateProps = state => ({
    thestore: state.thestore,
    thestores: state.thestores,
    center: state.center
});

const mapDispacthToProps = dispatch => ({
    UpdateStoreField: (center, key, field, value, storeToEdit) =>
        dispatch(UpdateStoreField(center, key, field, value, storeToEdit)),
});

export default connect(mapStateProps, mapDispacthToProps)(NameStore);
