import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    StatusBar
} from 'react-native';
import PropTypes from 'prop-types';
import gStyles from '../globals/styles.global';
import colors from '../globals/colors.global';


const { BlurView } = require('react-native-blur');


class Content extends Component {
    static propTypes = {
        children: PropTypes.element,
        statusBarBlur: PropTypes.bool,
        paddingTop: PropTypes.number,
        backgroundColor: PropTypes.string,
        isBussy: PropTypes.bool
    }

    static defaultProps = {
        children: null,
        statusBarBlur: false,
        paddingTop: 0,
        backgroundColor: colors.bgWhite,
        isBussy: false
    }
    
    render() {
        const { children, statusBarBlur, paddingTop, backgroundColor, isBussy } = this.props;
        return (
            <View style={[gStyles.flex1, { backgroundColor, paddingTop }]}>
                <StatusBar networkActivityIndicatorVisible={isBussy} />
                {statusBarBlur ? <BlurView blurType="light" blurAmount={10} style={styles.topBar} /> : null}
                {children}
            </View>
        );
    }
}

export default Content;

const styles = StyleSheet.create({
    topBar:
    {
        height: 20,
        backgroundColor: 'rgba(247,247,247,0.4)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
    }
});
