import React, {Component} from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import Timeline from 'react-native-timeline-listview';
import firebase from '../server/config';

export default class Itinerary extends Component {
  static navigationOptions = {
    title: 'Itinerary',
  };

  constructor(props){
    super(props);
    this.state = {
      itinerary: []
    };
  }

  componentDidMount() {
    const trip = this.props.navigation.state.params.trip;
    const itinerary = trip.itinerary;
    let approvedItems = [];
    itinerary.map(item => {
      let date = new Date(null);
      date.setSeconds(item.time.seconds);
      if (item.approved) approvedItems.push({...item, time: `${date}`.slice(0, 24)});
    });
    this.setState({
      itinerary: approvedItems
    });
  }

  render(){
    const trip = this.props.navigation.state.params.trip;
    return(
      <View style={styles.container}>
        <Timeline
          style={styles.list}
          data={this.state.itinerary}
          circleSize={20}
          circleColor='#66cc66'
          lineColor='#66cc66'
          timeContainerStyle={{width:125, marginTop: -5}}
          timeStyle={{textAlign: 'left', padding:5, fontFamily: 'Verdana', fontSize: 13}}
          descriptionStyle={{color:'gray', fontFamily: 'Verdana'}}
          titleStyle={{fontFamily: 'Verdana'}}
          options={{
            style:{paddingTop:5},
            removeClippedSubviews: false
          }}
        />
        <View style={styles.divider}>
          <Button
            buttonStyle={{backgroundColor:'#ff9933', borderRadius: 20, alignSelf: 'center', padding: 10}}
            onPress={() => this.props.navigation.navigate('PendingItinerary', trip)}
            title="Pending items"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
		paddingTop: 10,
    backgroundColor:'white'
  },
  list: {
    flex: 1,
  },
  divider: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'flex-end',
  }
});
