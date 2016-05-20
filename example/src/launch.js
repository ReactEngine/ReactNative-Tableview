'use strict';

var React = require('react-native');
var {
  AppRegistry,
  View,
  RefreshControl
} = React;

var TableView = require('react-native-rich-tableview');

var {
  Header,
  Footer,
  Section,
  Item
} = TableView;

var { Actions } = require('react-native-router-flux');

class Launch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {sectionLabel: 'Section', width: 200, height: 20};
    }

    componentDidMount(){
        setTimeout(()=>this.setState({sectionLabel: 'Section #1'}));
    }

    render(){
        return (
            <TableView style={{flex:1}}
                       contentInset={{top:64,left:0,bottom:0,right:0}}
                       scrollEventThrottle={0.05}>

                <Header style={{height:30, backgroundColor:'#ff0000'}} />
                <Section label={this.state.sectionLabel}  arrow={true}>
                    <Item onPress={Actions.example1}>Example with custom cells</Item>
                    <Item onPress={Actions.example2}>Example with app bundle JSON data</Item>
                    <Item onPress={Actions.example3}>Example with multiple sections</Item>
                    <Item onPress={Actions.example4}>Reusable Cell Example 1</Item>
                    <Item onPress={Actions.example5}>Reusable Custom Cells</Item>
                    <Item onPress={Actions.example6}>Firebase Example</Item>
                    <Item onPress={Actions.example7}>Large ListView (scroll memory growth)</Item>
                    <Item onPress={Actions.example8}>Reusable Large TableView Example</Item>
                    <Item onPress={Actions.example9}>Custom Editing Example</Item>
                </Section>
                <Footer style={{height:50, backgroundColor:'#00ff22'}} />
            </TableView>
        );
    }
}

module.exports = Launch;
