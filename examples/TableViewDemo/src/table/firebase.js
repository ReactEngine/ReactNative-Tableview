'use strict';

var React = require('react-native');
var TableView = require('react-native-tableview');
var Section = TableView.Section;
var Item = TableView.Item;
var Firebase = require('firebase');

class FirebaseExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:null};
        this.reactCellModule = "DinosaurCellExample";
        this.firebaseLocation = "https://dinosaur-facts.firebaseio.com/dinosaurs";
        this.propPrefix = "dinosaur";
    }
    componentDidMount() {
        var self = this;
        this.ref = new Firebase(this.firebaseLocation);
        this.ref.on('value', function(snapshot) {
            self.setState({data:snapshot.val()});
        });
    }
    componentWillUnmount() {
        this.ref.off();
    }
    renderItem(itemData, key, index) {
        //TODO passing itemData={itemData} doesn't seem to work... so pass all data props with a prefix to make sure they don't clash
        //with other <Item> props
        var item = {};
        Object.keys(itemData||{}).forEach(k => {
           item[this.propPrefix+k] = itemData[k];
        });
        item[this.propPrefix+"key"] = key;

        return (<Item {...item} height={140} backgroundColor={index%2==0?"white":"grey"} key={key} label={key}></Item>);
    }
    render() {
        var data = this.state.data;
        if (!data) {
            return <Text style={{height:580}}>NO DATA</Text>
        }

        var self = this;
        var items = Object.keys(data).map((key,index)=>self.renderItem(data[key], key, index));

        return (
            <View style={{flex:1}}>
                <Text value="">All Items</Text>
                <TableView style={{flex:1}} reactModuleForCell={this.reactCellModule}
                           tableViewCellStyle={TableView.Consts.CellStyle.Default}
                           onPress={(event) => alert(JSON.stringify(event))}>
                    <Section arrow={true}>
                        {items}
                    </Section>
                </TableView>
            </View>
        );
    }
}

module.exports = FirebaseExample;
