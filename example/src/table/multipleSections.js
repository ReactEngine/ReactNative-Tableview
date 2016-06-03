'use strict';

import React from 'react';
import TableView from 'react-native-rich-tableview';
var Section = TableView.Section;
var Item = TableView.Item;

export default class MultipleSectionsExample extends React.Component {
  render(){
    return (
      <TableView style={{flex:1}}
        allowsToggle={true}
        allowsMultipleSelection={true}
        tableViewStyle={'grouped'}
        tableViewCellStyle={'subtitle'}
        onPress={(event) => alert(JSON.stringify(event))}
        >
        <Section label="Section 1" arrow={true}>
          <Item value="1" detail="Detail1" >Item 1</Item>
          <Item value="2">Item 2</Item>
          <Item>Item 3</Item>
          <Item>Item 4</Item>
          <Item>Item 5</Item>
          <Item>Item 6</Item>
          <Item>Item 7</Item>
          <Item>Item 8</Item>
          <Item>Item 9</Item>
          <Item>Item 10</Item>
          <Item>Item 11</Item>
          <Item>Item 12</Item>
          <Item>Item 13</Item>
          <Item>Item 14</Item>
          <Item>Item 15</Item>
          <Item>Item 16</Item>
        </Section>
        <Section label="Section 2" arrow={false}>
          <Item selected={true}>Item 1</Item>
          <Item>Item 2</Item>
          <Item>Item 3</Item>
        </Section>
        <Section label="Section 3" arrow={false}>
          <Item>Item 1</Item>
          <Item selected={true}>Item 2</Item>
          <Item>Item 3</Item>
        </Section>
      </TableView>
    );
  }
}
