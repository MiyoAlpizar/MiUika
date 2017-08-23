import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput
} from 'react-native';
import propTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import styles from '../globals/styles.global';
import colors from '../globals/colors.global';
import { isNumeric } from '../globals/functions';

class FieldCheck extends Component {
    static propTypes = {
        title: propTypes.string,
        placeholder: propTypes.string,
        keyboardType: React.PropTypes.oneOf(['default', 'email-address', 'numeric', 'phone-pad', 'ascii-capable', 'numbers-and-punctuation', 'url', 'number-pad', 'name-phone-pad', 'decimal-pad', 'twitter', 'web-search']),
        detail: propTypes.string,
        onSubmitEditing: propTypes.func,
        value: propTypes.string,
        minLength: propTypes.number,
        onChangeText: propTypes.func,
        maxLength: propTypes.number,
        returnKeyType: propTypes.oneOf(['done', 'go', 'next', 'search', 'send', 'none', 'previous', 'default', 'emergency-call', 'google', 'join', 'route', 'yahoo']),
        isNumeric: propTypes.bool,
        isValid: propTypes.bool
    }

    static defaultProps = {
        title: '',
        placeholder: '',
        keyboardType: 'default',
        detail: null,
        minLength: 3,
        maxLength: 100,
        returnKeyType: 'next',
        isNumeric: false,
        isValid: false
    }

    constructor(props) {
        super(props);
        this.state = {
            valid: false
        };
    }

    componentDidMount() {
        this.Validate(this.props.value);
    }

    Validate(txt) {
        if (txt === null) {
            return;
        }
        if (this.props.isNumeric) {
            if (isNumeric(txt)) {
                this.setState({ valid: true });
            } else {
                this.setState({ valid: false });
            }
        } else if (txt.trim().length > this.props.minLength) {
            this.setState({ valid: true });
        } else {
            this.setState({ valid: false });
        }
        
        this.props.isValid = this.state.valid;
        if (this.props.onChangeText) {
            this.props.onChangeText(txt);
        }
    }

    render() {
        const { title, placeholder, returnKeyType, keyboardType, onSubmitEditing, value, maxLength, detail } = this.props;

        return (
            <View style={[styles.flexRow]}>
                <View style={[styles.marginLeft10, styles.itemsCenter]}>
                    <Icon
                        name="check"
                        raised
                        size={12}
                        iconStyle={{ fontSize: 20 }}
                        color={this.state.valid ? colors.GreenOk : colors.Gray2}
                    />
                </View>
                <View style={[styles.flex1, styles.margin10]}>
                    <Text>{title}</Text>
                    <TextInput
                        style={[styles.input1, styles.margin10, { marginLeft: 0 }]}
                        placeholder={placeholder}
                        returnKeyType={returnKeyType}
                        onSubmitEditing={onSubmitEditing}
                        keyboardType={keyboardType}
                        value={value}
                        onChangeText={(txt) => { this.Validate(txt); }}
                        maxLength={maxLength}
                        ref='Input'
                    />
                    <View style={styles.line1} />
                    {
                        detail ?
                            <Text style={[styles.h0, styles.b5, styles.primaryMirrorColor]}>{detail}</Text>
                            : null
                    }
                </View>
            </View>
        );
    }
}

export default FieldCheck;
