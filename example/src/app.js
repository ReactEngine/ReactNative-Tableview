'use strict';

import React, {Component} from 'react';
import ReactNative, {
  AppRegistry,
  RefreshControl,
  View
} from 'react-native';

let TableView = require('react-native-rich-tableview');

const {
  Header,
  Footer,
  Section,
  Item
} = TableView;

import {Actions, Scene, Router} from 'react-native-router-flux';

import NavBar   from './NavBar'

import Launch   from './launch'

import Example1 from './table/custom'
import Example2 from './table/jsonData'
import Example3 from './table/multipleSections'
import ReusableCellExample1 from './table/reusable1'
import ReusableCellExample2 from './table/reusable2'
import FirebaseExample from './table/firebase'
import ListViewExample from './table/largeList'
import LargeTableExample from './table/largeTable'
import CustomEditableExample from './table/customEditable'

import TableViewExampleCell from './table/cell/cell1'
import TableViewExampleCell2 from './table/cell/cell2'
import DinosaurCellExample from './table/cell/dinosaurCell'

class TableViewExample extends Component {
  render(){
    return (
      <Router>
        <Scene key='root'>
          <Scene key="launch" component={Launch} title="TableView Demo" />
          <Scene key="example1" component={Example1} title="Example 1"/>
          <Scene key="example2" component={Example2} title="Example 2"/>
          <Scene key="example3" component={Example3} title="Example 3"/>
          <Scene key="example4" component={ReusableCellExample1} title="Reusable Cell Example 1"/>
          <Scene key="example5" component={ReusableCellExample2} title="Reusable Custom Cells"/>
          <Scene key="example6" component={FirebaseExample} title="Firebase Example"/>
          <Scene key="example7" component={ListViewExample} title="Large ListView Example"/>
          <Scene key="example8" component={LargeTableExample} title="Reusable Large TableView Example"/>
          <Scene key="example9" component={CustomEditableExample} hideNavBar={true} title="Custom Editing Example"/>
        </Scene>
      </Router>
    );
  }
}

function main(platform) {
  AppRegistry.registerComponent('TableViewExampleCell', () => TableViewExampleCell);
  AppRegistry.registerComponent('TableViewExampleCell2', () => TableViewExampleCell2);
  AppRegistry.registerComponent('DinosaurCellExample', () => DinosaurCellExample);
  AppRegistry.registerComponent('TableViewExample', () => TableViewExample);
}

export default main
