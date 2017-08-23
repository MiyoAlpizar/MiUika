import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import CachedImage from 'react-native-cached-image';
import propTypes from 'prop-types';
import styles from '../globals/styles.global';

class NavBar extends Component {

    static propTypes = {
        center: propTypes.object,
        title: propTypes.string,
        onImagePress: propTypes.func
    }

    static defaultProps = {
        title: 'Mi Uika',
        center: {
            img_profile: 'https://firebasestorage.googleapis.com/v0/b/uika-1328.appspot.com/o/defaults%2Fprofile_empty.jpg?alt=media&token=28ef2185-572b-4a86-ae41-02655c3bde9e'
        }
    }

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={[styles.flex1, styles.flexRow]}>
                <TouchableOpacity
                    onPress={this.props.onImagePress}
                >
                    <CachedImage
                        style={styles.imgRounded} source={{ uri: this.props.center.img_profile }}
                    />
                </TouchableOpacity>
                <View style={[styles.flex1, styles.itemsCenter]}>
                    <Text style={[styles.h2, styles.b6]}>{this.props.title}</Text>
                </View>
                <View style={{ width: 50 }} />
            </View>
        );
    }
}

const mapStateProps = state => ({
    user: state.user
});

export default connect(mapStateProps, null)(NavBar);
