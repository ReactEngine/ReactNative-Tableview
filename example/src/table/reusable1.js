'use strict';

import React from 'react';
import TableView from 'react-native-rich-tableview';
let Item = TableView.Item;

//Similar to example 2 but use "TableViewExampleCell" reusable cells
export default class ReusableCellExample1 extends React.Component {
    // list spanish provinces and add 'All states' item at the beginning
    render() {
        var country = "ES";
        return (
            <TableView selectedValue=""
                       reactModuleForCell="TableViewExampleCell"
                       style={{flex:1}}
                       json="states"
                       filter={`country=='${country}'`}
                       tableViewCellStyle={'subtitle'}
                       onPress={(event) => alert(JSON.stringify(event))}>
                <Item value="">All states</Item>
            </TableView>
        );
    }
}
