import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

export default class FriendProfile extends Component {
  render() {
    const firstName = this.props.navigation.state.params.firstName;
    const lastName = this.props.navigation.state.params.lastName;
    const imgUrl = this.props.navigation.state.params.imgUrl;
    const places = this.props.navigation.state.params.places;
    return (
      <ScrollView style={styles.container}>
        <View style={{flexDirection: 'row', padding: 10, alignItems: 'center'}}>
          <Avatar
            size="large"
            key={firstName}
            rounded
            source={{uri:`${imgUrl}`}}
            containerStyle={{padding: 15}}
          />
          <Text style={styles.title}>{firstName}'s Places Visited</Text>
        </View>
        {
          places ?
            places.map((item, i) => {
              return (
              <ListItem
              key={i}
              title={item.location}
              style={styles.place}
              rightIcon={<Icon name="ios-ribbon" color={item.expert ? '#ff9933' : '#f8f8f8'} size={30}/> }
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
    fontSize: 20,
    fontFamily: 'Verdana',
    fontWeight: 'bold',
    color: '#ff9933'
  },
  place: {
    padding: 10,
    fontFamily: 'Verdana',
    fontSize: 20
  }
});
