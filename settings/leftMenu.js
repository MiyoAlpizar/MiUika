import React, { Component } from 'react';
import {
    ScrollView,
    
} from 'react-native';
import { connect } from 'react-redux';

class LeftMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        this.Init();
    }

    componentDidMount() {

    }

    Init() {
        
    }

    render() {
        return (
            <ScrollView />
        );
    }

}

const mapStateProps = state => ({
        user: state.user,
        center: state.center
    });

const mapDispacthToProps = dispatch => ({
    
});

export default connect(mapStateProps, mapDispacthToProps)(LeftMenu);

