'use strict';

var React = require('react-native');
var { Text } = React;
var TableView = require('react-native-rich-tableview');
var Section = TableView.Section;
var Cell = TableView.Cell;

class CustomCellsExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {sectionLabel: 'Section', cellLabel: 'Cell 1', cells:[<Cell><Text>Cell 3</Text></Cell>]};
    }

    componentDidMount(){
        setTimeout(()=>this.setState({sectionLabel: 'Section #1', cellLabel: 'Cell #1', cells:[<Cell><Text>Cell #3</Text></Cell>,<Cell><Text>Cell #4</Text></Cell>]}));
    }
    render() {
        return (
            <TableView style={{flex:1}}
                       onPress={(event) => alert(JSON.stringify(event))}>
                <Section label={this.state.sectionLabel}>
                    <Cell style={{backgroundColor:'gray'}} value="">
                        <Text style={{color:'white', textAlign:'right'}}>Cell 1</Text>
                        <Text style={{color:'white', textAlign:'left'}}>Cell 1</Text>
                    </Cell>
                    <Cell style={{height:200, backgroundColor:'red'}}><Text>{this.state.cellLabel}</Text></Cell>
                    <Cell style={{height:100}}><Text>Cell 4</Text></Cell>
                    <Cell><Text>Cell 5</Text></Cell>
                </Section>
                <Section label="section 2">
                    <Cell style={{backgroundColor:'gray'}} value="1">
                        <Text style={{color:'white', textAlign:'right'}}>Cell 1.1</Text>
                        <Text style={{color:'white', textAlign:'left'}}>Cell 1.1</Text>
                    </Cell>
                    <Cell style={{height:200, backgroundColor:'red'}}><Text>Cell 1.2</Text></Cell>
                    <Cell><Text>Cell 3</Text></Cell>
                    <Cell style={{height:100}}><Text>Cell 4</Text></Cell>
                    <Cell><Text>Cell 5</Text></Cell>
                </Section>
                <Section label="section 3">
                    {this.state.cells}
                </Section>
            </TableView>
        );
    }
}

module.exports = CustomCellsExample;
