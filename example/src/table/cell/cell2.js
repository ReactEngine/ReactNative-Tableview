'use strict';

var React = require('react-native');
var { Text, View } = React;

//Should be pure... setState on top-level component doesn't seem to work
class TableViewExampleCell2 extends React.Component {
    render(){
        var style = {};
        //cell height is passed from <Item> child of tableview and native code passes it back up to javascript in "app params" for the cell.
        //This way our component will fill the full native table cell height.
        if (this.props.data.height !== undefined) {
            style.height = this.props.data.height;
        } else {
            style.flex = 1;
        }
        if (this.props.data.backgroundColor !== undefined) {
            style.backgroundColor = this.props.data.backgroundColor;
        }
        return (<View style={style}><Text>{this.props.data.label}</Text></View>);
    }
}

module.exports = TableViewExampleCell2;
