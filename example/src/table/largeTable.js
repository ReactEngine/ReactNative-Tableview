'use strict';

import React from 'react';
import TableView from 'react-native-rich-tableview';
var Section = TableView.Section;
var Item = TableView.Item;

export default class LargeTableExample extends React.Component {
  render() {
    var numAdditionaItems = 1000;
    var items = [];
    for (var i = 0; i < numAdditionaItems; ++i) {
      items.push(i);
    }
    return (
      <TableView  reactModuleForCell="TableViewExampleCell"
        style={{flex:1}}
        allowsToggle={true}
        tableViewStyle={'grouped'}
        onPress={(event) => alert(JSON.stringify(event))}>
        <Section label={"large section - "+numAdditionaItems+" items"} arrow={true}>
          {items.map((i)=><Item key={i+1}>{(i+1).toString()}</Item>)}
        </Section>
      </TableView>
    );
  }
}
