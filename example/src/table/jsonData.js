'use strict';

import React, { Component } from 'react';
import TableView from 'react-native-rich-tableview';
var Item = TableView.Item;

export default class JSONDatasourceExample extends Component {
    // list spanish provinces and add 'All states' item at the beginning
    render() {
        var country = "ES";
        return (
            <TableView selectedValue=""
                       style={{flex:1}}
                       json="states"
                       filter={`country=='${country}'`}
                       tableViewCellStyle={'subtitle'}
                       onPress={(event) => alert(JSON.stringify(event))}
            >
                <Item value="">All states</Item>
            </TableView>
        );
    }
}
