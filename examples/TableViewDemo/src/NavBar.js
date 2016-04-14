'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');

class NavBar extends React.Component {
    render(){
        return <NavigationBar style={{backgroundColor: '#0db0d9'}}
                              titleColor='white'
                              buttonsColor='white'
                              {...this.props} />
    }
}

module.exports = NavBar;
