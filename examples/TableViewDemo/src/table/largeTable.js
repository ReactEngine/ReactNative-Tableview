'use strict';

var React = require('react-native');
var TableView = require('react-native-tableview');
var Section = TableView.Section;
var Item = TableView.Item;

class LargeTableExample extends React.Component {
    render() {
        var numAdditionaItems = 1000;
        var items = [];
        for (var i = 0; i < numAdditionaItems; ++i) {
            items.push(i);
        }
        return (
            <TableView reactModuleForCell="TableViewExampleCell" style={{flex:1}}
                           allowsToggle={true}
                           allowsMultipleSelection={true}
                           tableViewStyle={TableView.Consts.Style.Grouped}
                           onPress={(event) => alert(JSON.stringify(event))}>
                <Section label={"large section - "+numAdditionaItems+" items"} arrow={true}>
                    {items.map((i)=><Item key={i+1}>{i+1}</Item>)}
                </Section>
            </TableView>
        );
    }
}

module.exports = LargeTableExample;
