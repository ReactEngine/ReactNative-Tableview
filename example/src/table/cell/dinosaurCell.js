'use strict';

import React, { Component } from 'react';
import ReactNative, { Text, View } from 'react-native';

//Should be pure... setState on top-level component doesn't seem to work
export default class DinosaurCell extends Component {
  yearsAgoInMil(num) {
    return ((-1 * num)/1000000)+" million years ago";
  }
  render(){
    var style = {};
    //cell height is passed from <Item> child of tableview and native code passes it back up to javascript in "app params" for the cell.
    //This way our component will fill the full native table cell height.
    if (this.props.data.height !== undefined) {
      style.height = this.props.data.height;
    }
    if (this.props.data.backgroundColor !== undefined) {
      style.backgroundColor = this.props.data.backgroundColor;
    }
    style.borderColor = "grey";
    style.borderRadius = 0.02;

    var appeared = this.yearsAgoInMil(this.props.data.dinosaurappeared);
    var vanished = this.yearsAgoInMil(this.props.data.dinosaurvanished);
    return (<View style={style}>
      <Text style={{backgroundColor:"#4fa2c3"}}>Name: {this.props.data.dinosaurkey}</Text>
      <Text>Order:{this.props.data.dinosaurorder}</Text>
      <Text>Appeared: {appeared}</Text>
      <Text style={{backgroundColor:"lightgrey"}}>Vanished: {vanished}</Text>
      <Text>Height: {this.props.data.dinosaurheight}</Text>
      <Text>Length: {this.props.data.dinosaurlength}</Text>
      <Text>Weight: {this.props.data.dinosaurweight}</Text>
    </View>);
  }
}
