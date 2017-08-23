import React, { Component } from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import colors from '../globals/colors.global';
import styles from '../globals/styles.global';

class FieldInfo extends Component {

    static propTypes = {
        title: React.PropTypes.string.isRequired,
        subtitle: React.PropTypes.string,
        detail: React.PropTypes.string,
        value: React.PropTypes.string.isRequired,
        onChangeText: React.PropTypes.func,
        placeholder: React.PropTypes.string,
        autoFocus: React.PropTypes.bool,
        showBottomButton: React.PropTypes.bool,
        onPressButton: React.PropTypes.func,
        buttonLabel: React.PropTypes.string,
        buttonDisabled: React.PropTypes.bool,
        maxLength: React.PropTypes.number,
        keyboardType: React.PropTypes.oneOf(['default', 'email-address', 'numeric', 'phone-pad', 'ascii-capable', 'numbers-and-punctuation', 'url', 'number-pad', 'name-phone-pad', 'decimal-pad', 'twitter', 'web-search']),
        focusDelay: React.PropTypes.number
    }

    static defaultProps = {
        buttonLabel: 'Siguiente',
        autoFocus: false,
        showBottomButton: true,
        subtitle: null,
        detail: null,
        buttonDisabled: true,
        maxLength: 100,
        keyboardType: 'default',
        focusDelay: 500
    }
    

    componentWillMount() {
        if (this.props.focusDelay > 0) {
            setTimeout(() => {
                this.onGoFocus();
            }, this.props.focusDelay);
        }
    }

    onGoFocus() {
        this.refs.txtValue.focus();
    }
    render() {
        const { title, subtitle, detail, value, onChangeText, placeholder, showBottomButton, onPressButton, buttonLabel, buttonDisabled, maxLength, keyboardType } = this.props;
        return (
            <View style={styles.containerWhite}>
                <View style={[styles.padding15, { flex: 1, paddingTop: 0 }]}>
                    <ScrollView keyboardDismissMode="on-drag" style={{ paddingTop: 70 }}>
                        <View style={[styles.marginTop10]}>
                            <Text style={[styles.h5, styles.b8, styles.paddingBottom10, subtitle ? styles.paddingBottom10 : styles.paddingBottom30]}>{title}</Text>
                            {subtitle ? <Text style={[styles.h2, styles.b4, styles.paddingBottom30]}>{subtitle}</Text> : null}
                            <TextInput
                                style={[styles.primaryColor, styles.input1, styles.b6]}
                                value={value}
                                selectionColor={colors.Primary}
                                onChangeText={onChangeText}
                                placeholderTextColor={colors.Gray5}
                                placeholder={placeholder}
                                maxLength={maxLength}
                                keyboardType={keyboardType}
                                ref="txtValue"
                            />
                            <View style={[styles.line1, styles.marginTop10]} />
                            {detail ? <Text style={[styles.h0, styles.b4, styles.paddingBottom30, styles.primaryMirrorColor, styles.marginTop15]}>{detail}</Text> : null}
                        </View>
                    </ScrollView>
                </View>
                {showBottomButton ?
                    <View>
                        <View>
                            <View style={styles.line1} />
                            <View style={[styles.itemsRigth, styles.padding10]}>
                                <TouchableOpacity onPress={onPressButton} disabled={buttonDisabled} activeOpacity={0.6} style={[styles.rounded20, styles.bgPrimary]}>
                                    <Text style={[styles.whiteColor, styles.margin10, styles.h1, !buttonDisabled ? { opacity: 1 } : { opacity: 0.8 }]}>{buttonLabel}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.line1} />
                        </View>
                        <KeyboardSpacer />
                    </View>
                    : null
                }
            </View>
        );
    }
}

export default FieldInfo;

