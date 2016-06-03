'use strict';

import React, { Component } from 'react';
import ReactNative, { Text } from 'react-native';
var TableView = require('react-native-rich-tableview');
var Section = TableView.Section;
var Cell = TableView.Cell;

export default class CustomCellsExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sectionLabel: 'Section',
      cellLabel: 'Cell 1',
      cells:[
        <Cell key='s2_r0'>
          <Text>Cell 3</Text>
        </Cell>
      ]
    };
  }

  componentDidMount(){
    this.timeout = setTimeout(()=> this.setState({
      sectionLabel: 'Section #1',
      cellLabel: 'Cell #1',
      cells:[
        <Cell key='s2_r0'>
          <Text>Cell #3</Text>
        </Cell>,
        <Cell key='s2_r1'>
          <Text>Cell #4</Text>
        </Cell>
      ]
    }), 3000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  render() {
    return (
      <TableView style={{flex:1}}
        onPress={(event) => alert(JSON.stringify(event))}>
        <Section key='s0' label={this.state.sectionLabel}>
          <Cell key='s0_r0' style={{backgroundColor:'gray'}} value="">
            <Text style={{color:'white', textAlign:'right'}}>Cell 1</Text>
            <Text style={{color:'white', textAlign:'left'}}>Cell 1</Text>
          </Cell>
          <Cell key='s0_r1' style={{height:200, backgroundColor:'red'}}><Text>{this.state.cellLabel}</Text></Cell>
          <Cell key='s0_r2' style={{height:100}}><Text>Cell 4</Text></Cell>
          <Cell key='s0_r3'><Text>Cell 5</Text></Cell>
        </Section>
        <Section key='s1' label="section 2">
          <Cell key='s1_r0' style={{backgroundColor:'gray'}} value="1">
            <Text style={{color:'white', textAlign:'right'}}>Cell 1.1</Text>
            <Text style={{color:'white', textAlign:'left'}}>Cell 1.1</Text>
          </Cell>
          <Cell key='s1_r1' style={{height:200, backgroundColor:'red'}}><Text>Cell 1.2</Text></Cell>
          <Cell key='s1_r2'><Text>Cell 3</Text></Cell>
          <Cell key='s1_r3' style={{height:100}}><Text>Cell 4</Text></Cell>
          <Cell key='s1_r4'><Text>Cell 5</Text></Cell>
        </Section>
        <Section key='s2' label="section 3">
          {this.state.cells}
        </Section>
      </TableView>
    );
  }
}
