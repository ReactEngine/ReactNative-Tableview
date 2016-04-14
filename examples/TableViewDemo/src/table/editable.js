'use strict';

var React = require('react-native');
var { View } = React;
var TableView = require('react-native-tableview');
var Section = TableView.Section;
var Item = TableView.Item;

import NavBar from '../NavBar.js'

class Edit extends React.Component {
    constructor(props){
        super(props);
        this.state = {editing: false};
    }
    render(){
        var self = this;
        return (
            <View style={{flex:1}}>
                <NavBar {...this.props} nextTitle={this.state.editing ? "Done" : "Edit"}
                                        onNext={()=>self.setState({editing: !self.state.editing})}/>
                <TableView style={{flex:1}} editing={this.state.editing}
                           onPress={(event) => alert(JSON.stringify(event))} onChange={(event) => alert("CHANGED:"+JSON.stringify(event))}>
                    <Section canMove={true} canEdit={true}>
                        <Item canEdit={false}>Item 1</Item>
                        <Item>Item 2</Item>
                        <Item>Item 3</Item>
                        <Item>Item 4</Item>
                        <Item>Item 5</Item>
                        <Item>Item 6</Item>
                        <Item>Item 7</Item>
                        <Item>Item 8</Item>
                    </Section>
                </TableView>
            </View>
        );
    }
}

module.exports = Edit;
