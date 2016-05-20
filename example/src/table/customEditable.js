'use strict';

var React = require('react-native');
var { Text, View, TouchableHighlight, TextInput } = React;
var TableView = require('react-native-rich-tableview');
var Section = TableView.Section;
var Item = TableView.Item;
var { Actions } = require('react-native-router-flux');

import NavBar from '../NavBar.js'

class CustomEditableExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:null,editing:false,text:""};
        this.reactCellModule = "TableViewExampleCell2";
    }
    onExternalData(data) {
        var self = this;
        if (self.state.editing) {
            console.warn("Ignoring update from firebase while editing data locally");
        } else {
            self.setState({data:data});
        }
    }
    editOrSave() {
        if (this.state.editing) {
            //Save edited data

            var self = this;
            var newData = (this.dataItemKeysBeingEdited || []).map(itemKey=>self.preEditData[itemKey]);
            this.dataItemKeysBeingEdited = null;
            this.preEditData = null;

            this.setState({editing: false, data: newData}, function() {
                //Simulate saving data remotely and getting a data-changed callback
                setTimeout(()=> self.onExternalData(newData), 2);
            });
        } else {
            this.preEditData = (this.state.data || []).slice(0);
            //Must be same ordering as used in rendering items
            this.dataItemKeysBeingEdited = Object.keys(this.state.data || {});
            this.setState({editing: true});
        }
    }
    cancelEditing() {
        var data = this.preEditData;
        this.dataItemKeysBeingEdited = null;
        this.preEditData = null;
        var self = this;

        self.setState({editing: false, data: data});
    }
    moveItem(info) {
        if (!this.dataItemKeysBeingEdited || info.sourceIndex >= this.dataItemKeysBeingEdited.length
            || info.destinationIndex >= this.dataItemKeysBeingEdited.length) {
            console.error("moved row source/destination indices are out of range");
            return;
        }
        var itemKey = this.dataItemKeysBeingEdited[info.sourceIndex];
        this.dataItemKeysBeingEdited.splice(info.sourceIndex, 1);
        this.dataItemKeysBeingEdited.splice(info.destinationIndex, 0, itemKey);

        var self = this;
        var newData = (this.dataItemKeysBeingEdited || []).map(itemKey=>self.preEditData[itemKey]);
        this.setState({data: newData});
    }
    deleteItem(info) {
        if (!this.dataItemKeysBeingEdited || info.selectedIndex >= this.dataItemKeysBeingEdited.length) {
            console.error("deleted row index is out of range");
            return;
        }
        this.dataItemKeysBeingEdited.splice(info.selectedIndex, 1);

        var self = this;
        var newData = (this.dataItemKeysBeingEdited || []).map(itemKey=>self.preEditData[itemKey]);
        this.setState({data: newData});
    }
    addItem() {
        var {text} = this.state;
        if (!text) return;
        var self = this;

        //Simulate saving data remotely and getting a data-changed callback
        setTimeout(()=>self.onExternalData(!this.state.data?[text]:[...(this.state.data), text]), 2);

        //clear text & hide keyboard
        this.setState({text:""});
        this.refs.addTextInput.blur();
    }
    onChange(info) {
        if (info.mode == 'move') {
            this.moveItem(info);
        } else if (info.mode == 'delete') {
            this.deleteItem(info);
        } else {
            console.error("unknown change mode: "+info.mode);
        }
    }
    renderItem(itemData, key, index) {
        return (
            <Item key={key} label={itemData}>
            </Item>);
    }
    getNavProps() {
        var self = this;
        var navProps = {
            title:{title:"Custom Editable"},
            rightButton: {
                title: (this.state.editing? 'Save':'Edit'),
                handler: function onNext() {
                    self.editOrSave();
                }
            }
        };
        navProps.leftButton = {
            title: (this.state.editing?'Cancel':'Back'),
            handler: function onNext() {
                if (self.state.editing)
                    self.cancelEditing();
                else {
                    Actions.pop();
                }
            }
        };
        return navProps;
    }
    getAddItemRow() {
        return (
            <View style={{paddingBottom: 4, height:44, flexDirection:"row", alignItems:"stretch"}}>
                <TextInput ref="addTextInput"
                           style={{flex:1, height: 40, borderColor: 'gray', borderWidth: 1}}
                           onChangeText={(text) => this.setState({text:text})}
                           value={this.state.text}
                    />

                <TouchableHighlight onPress={(event)=>{this.addItem()}}
                                    style={{borderRadius:5, width:100,backgroundColor:"red",alignItems:"center",justifyContent:"center"}}>
                    <Text>Add</Text>
                </TouchableHighlight>
            </View>
        );
    }
    render() {
        var {data, editing} = this.state;
        if (!data) {
            data = {};
        }

        var self = this;
        var items = Object.keys(data).map((key,index)=>self.renderItem(data[key], key, index));

        return (
            <View style={{flex:1, marginTop:0}}>

                <NavBar {...this.getNavProps()}/>

                {!editing && this.getAddItemRow()}

                <TableView editing={editing} style={{flex:1}} reactModuleForCell={this.reactCellModule}
                           tableViewCellStyle={'default'}
                           onChange={this.onChange.bind(this)}
                    >
                    <Section canMove={editing} canEdit={editing} arrow={!editing}>
                        {items}
                    </Section>
                </TableView>
            </View>
        );
    }
}


module.exports = CustomEditableExample;
