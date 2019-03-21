import React, {Component} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import ProgressCircle from 'react-native-progress-circle';

export default class PendingItinerary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: []
    };
  }

  componentDidMount() {
    const trip = this.props.navigation.state.params;
    const itinerary = trip.itinerary;
    let pendingItems = [];
    itinerary.map(item => {
      let date = new Date(null);
      date.setSeconds(item.time.seconds);
      if (!item.approved) pendingItems.push({...item, time: `${date}`.slice(0, 24)});
    });
    this.setState({
      pending: pendingItems
    });
  }

  calcPercentage = (item) => {
    const denom = item.numForApproval;
    const num = item.numApproved;
    return (num/denom) * 100;
  }

  handleAddApproval = () => {
    console.log('numApproved ++')
  }

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        {
        this.state.pending && !this.state.pending.approved ?
          this.state.pending.map(item => {
            return (
              <View key={item.title} style={styles.row}>
                <View>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.text}>{item.description}</Text>
                  <Text style={styles.text}>{item.time}</Text>
                </View>
                <ProgressCircle
                  percent={this.calcPercentage(item)}
                  radius={35}
                  borderWidth={10}
                  color="#66cc66"
                  shadowColor="#f8f8f8"
                  bgColor="#f8f8f8"
                >
                  <Button
                    buttonStyle={{backgroundColor:'#ff9933', borderRadius: 50, height: 50, width: 50, alignSelf: 'center', padding: 10, marginLeft: 10, marginRight: 10}}
                    onPress={() => this.handleAddApproval()}
                    title={<Icon name='ios-checkmark' size={25}/>}
                  />
                </ProgressCircle>
              </View>
            );
          })
        : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Verdana',
    fontWeight: 'bold',
    fontSize: 15
  },
  text: {
    fontFamily: 'Verdana'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
});
