'use strict';

import React from 'react-native';
const {
  AppRegistry,
  View,
  RefreshControl
} = React;

let TableView = require('react-native-rich-tableview');

const {
  Header,
  Footer,
  Section,
  Item
} = TableView;

import {Actions, Router, Route, Schema, Animations} from 'react-native-router-flux';

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

export default function native(platform) {
  class TableViewExample extends React.Component {
      render(){
          return (
              <Router>
                  <Schema name="default" navBar={NavBar} sceneConfig={Animations.FlatFloatFromRight}/>
                  <Route name="launch" component={Launch} title="TableView Demo"/>
                  <Route name="example1" component={Example1} title="Example 1"/>
                  <Route name="example2" component={Example2} title="Example 2"/>
                  <Route name="example3" component={Example3} title="Example 3"/>
                  <Route name="example4" component={ReusableCellExample1} title="Reusable Cell Example 1"/>
                  <Route name="example5" component={ReusableCellExample2} title="Reusable Custom Cells"/>
                  <Route name="example6" component={FirebaseExample} title="Firebase Example"/>
                  <Route name="example7" component={ListViewExample} title="Large ListView Example"/>
                  <Route name="example8" component={LargeTableExample} title="Reusable Large TableView Example"/>
                  <Route name="example9" component={CustomEditableExample} hideNavBar={true} title="Custom Editing Example"/>
              </Router>
          );
      }
  }

  AppRegistry.registerComponent('TableViewExampleCell', () => TableViewExampleCell);
  AppRegistry.registerComponent('TableViewExampleCell2', () => TableViewExampleCell2);
  AppRegistry.registerComponent('DinosaurCellExample', () => DinosaurCellExample);
  AppRegistry.registerComponent('TableViewExample', () => TableViewExample);
}
