import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';

import * as Progress from 'react-native-progress';

const { BlurView } = require('react-native-blur');

const ProgressCircle = ({ progress, indeterminate, visible }) => (
    visible ? <View style={styles.overlay}>
        <BlurView blurType="light" blurAmount={10} style={styles.VProgress}>
            <Progress.Circle
                style={styles.progress}
                progress={progress}
                indeterminate={indeterminate}
                size={90}
                color='black'
                showsText
            />
        </BlurView>
    </View> : null
);

ProgressCircle.propTypes = {
    progress: React.PropTypes.number.isRequired,
    indeterminate: React.PropTypes.bool,
    visible: React.PropTypes.bool
};

ProgressCircle.defaultProps = {
    progress: 0,
    indeterminate: false,
    visible: false
};

export default ProgressCircle;

const styles = StyleSheet.create({
    overlay:
    {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    VProgress:
    {
        width: 160,
        height: 160,
        borderRadius: 12,
        backgroundColor: 'rgba(247,247,247,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progress: {
        margin: 10,
    },
});
