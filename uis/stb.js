import React, { Component } from 'react';
import {
    StyleSheet
} from 'react-native';

const { BlurView } = require('react-native-blur');

export default class STB extends Component {
    static propTypes = {
        blurType: React.PropTypes.string,
        blurAmount: React.PropTypes.number,
        backgroundColor: React.PropTypes.string
    }
    static defaultProps = {
        blurType: 'light',
        blurAmount: 10,
        backgroundColor: 'rgba(247,247,247,0.4)',
    }

    render() {
        return (
            <BlurView 
            blurType={this.props.blurType} 
            blurAmount={this.props.blurAmount} 
            style={[styles.topBar, { backgroundColor: this.props.backgroundColor }]} 
            />
        );
    }
}

const styles = StyleSheet.create({
    topBar:
    {
        height: 20,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    }
});
