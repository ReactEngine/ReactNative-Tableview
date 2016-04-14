'use strict';

var React = require('react-native');
var TableView = require('react-native-tableview');
var Item = TableView.Item;

//Similar to example 2 but use "TableViewExampleCell" reusable cells
class ReusableCellExample1 extends React.Component {
    // list spanish provinces and add 'All states' item at the beginning
    render() {
        var country = "ES";
        return (
            <TableView selectedValue=""
                       reactModuleForCell="TableViewExampleCell"
                       style={{flex:1}}
                       json="states"
                       filter={`country=='${country}'`}
                       tableViewCellStyle={TableView.Consts.CellStyle.Subtitle}
                       onPress={(event) => alert(JSON.stringify(event))}>
                <Item value="">All states</Item>
            </TableView>
        );
    }
}

module.exports = ReusableCellExample1;
