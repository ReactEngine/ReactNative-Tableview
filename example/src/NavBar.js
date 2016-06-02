'use strict';

import React, {Component} from 'react'
import NavigationBar from 'react-native-navbar'

export default class NavBar extends Component {
    render() {
        return (
            <NavigationBar
                style={{backgroundColor: '#0db0d9'}}
                titleColor='white'
                buttonsColor='white'
                {...this.props} />
        )
    }
}
