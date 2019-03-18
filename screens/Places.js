import React, {Component} from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
// import { MapView } from 'expo';

export default class Places extends Component {
  render() {
    const places = this.props.navigation.state.params;
    return(
      <ScrollView style={styles.container}>
      <Text style={styles.title}>Places Visited</Text>
      {
        places ?
          places.map((item, i) => {
            return (
            <ListItem
            key={i}
            title={item.location}
            style={styles.place}
            rightIcon={item.expert ? <Icon name="ios-ribbon" color="#ff9933" size={25} /> : null}
            />
            );
          })
        : null
      }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    flex: 1
  },
  title: {
    padding: 10,
    fontSize: 20,
    fontFamily: 'Verdana',
    fontWeight: 'bold'
  },
  place: {
    padding: 10,
    fontFamily: 'Verdana'
  }
});
