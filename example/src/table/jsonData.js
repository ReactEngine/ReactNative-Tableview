'use strict';

var React = require('react-native');
var TableView = require('react-native-rich-tableview');
var Item = TableView.Item;

class JSONDatasourceExample extends React.Component {
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

module.exports = JSONDatasourceExample;
