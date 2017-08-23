import React, { Component } from 'react';
import {
    Keyboard,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import FieldInfo from '../components/FieldInfo';
import { UpdateStoreField } from '../src/actions/store.actions';
import Content from '../components/Content';
import colors from '../globals/colors.global';

class DescriptionStore extends Component {

    constructor(props) {
        super(props);
        this.state = {
            next: this.props.thestore.storeToPlay.description.trim().length > 3
        };

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
            if (event.id === 'save') {
                this.SaveDataField();
            }
        }
    }

    Init() {

    }

    ValidateData(text) {
        if (text == null) { return; }
        this.props.thestore.storeToPlay.description = text;
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
    }

    GoBack() {
        this.props.navigator.pop({
            animated: true
        });
    }

    SaveDataField() {
        this.props.UpdateStoreField(
            this.props.center.key, this.props.thestore.storeToPlay.key, 
            'description', this.props.thestore.storeToPlay.description, 
            this.props.thestore.storeToPlay)
            .then(() => {
                this.props.thestores.reloadList = true;
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
                isBussy={this.props.thestore.bussy}
            >
                <FieldInfo
                    title="Descripción del negocio"
                    subtitle="¿Hay algo que caracterice a este negocio?"
                    detail="Puedes escribir el lema del negocio, o una frase para que tus clientes lo identifiquen rápido."
                    placeholder="Lema o descripción"
                    showBottomButton={!this.props.isEdit}
                    value={this.props.thestore.storeToPlay.description}
                    onChangeText={(value) => this.ValidateData(value)}
                    onPressButton={() => this.GoNext('ProductsStore')}
                    buttonDisabled={!this.state.next}
                    focusDelay={this.props.isEdit ? 700 : 800}
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

export default connect(mapStateProps, mapDispacthToProps)(DescriptionStore);
