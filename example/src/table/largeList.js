'use strict';

import React, { Component } from 'react';
import ReactNative, { Text, ListView } from 'react-native';

class ListViewExample extends Component {
    constructor(props){
        super(props);
        this.numAdditionaItems = 1000;
        this.data = {};
        for (var i = 0; i < this.numAdditionaItems; ++i) {
            this.data[i] = i;
        }
        this.state = {dataSource: new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })};
    }
    render() {
        const data = this.data;
        return (
            <ListView
                dataSource={this.state.dataSource.cloneWithRows(Object.keys(data))}
                renderRow={(k) => <Text onPress={(e)=>alert("item:"+k+", "+data[k])}> data: {data[k]}</Text>}
                />
        );
    }
}

module.exports = ListViewExample;
