import React, { Component } from 'react';
import {
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import FieldInfo from '../components/FieldInfo';
import { isNumeric } from '../globals/functions';
import { UpdateStoreField } from '../src/actions/store.actions';
import Content from '../components/Content';
import colors from '../globals/colors.global';

class ExtraService extends Component {

    constructor(props) {
        super(props);
        this.state = {
            next: !!isNumeric(this.props.thestore.storeToPlay.service_extra)
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
        this.props.thestore.storeToPlay.service_extra = text;
        if (isNumeric(this.props.thestore.storeToPlay.service_extra)) {
            this.setState({ next: true });
            this.SetSaveButton(false);
        } else {
            this.setState({ next: false });
            this.SetSaveButton(true);
        }
    }

    GoNext(screen) {
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
                disabledBackGesture: true,
                navBarHidden: true
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
            this.props.center.key, this.props.thestore.storeToPlay.key, 'extra_service', 
            this.props.thestore.storeToPlay.extra_service, this.props.thestore.storeToPlay)
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
                    title="Costo extra de servicio"
                    subtitle="¿Cobrarás un extra por este negocio?"
                    detail="Puedes cobrar un extra por este negocio si te queda lejos o el tiempo de atención es largo. Esta información será mostrada a tus clientes."
                    placeholder="0"
                    showBottomButton={!this.props.isEdit}
                    value={this.props.thestore.storeToPlay.service_extra.toString()}
                    onChangeText={(value) => this.ValidateData(value)}
                    onPressButton={() => this.GoNext('ImageStore')}
                    buttonDisabled={!this.state.next}
                    focusDelay={this.props.isEdit ? 500 : 800}
                    keyboardType="number-pad"
                    maxLength={2}
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

export default connect(mapStateProps, mapDispacthToProps)(ExtraService);
