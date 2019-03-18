import React, {Component} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Avatar, Badge } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from '../server/config';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.expertNumCount = this.expertNumCount.bind(this);
  }

  handleLogOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate('Loading');
      })
      .catch(err => {
        console.error(err);
      });
  }

  expertNumCount(places) {
    let num = 0;
    places.map(place => {
      if (place.expert) num ++;
    });
    return num;
  }

  render(){
    const user = this.props.navigation.state.params.user;
    const firstName = this.props.navigation.state.params.user.firstName;
    const lastName = this.props.navigation.state.params.user.lastName;
    const email = this.props.navigation.state.params.user.email;
    const places = this.props.navigation.state.params.user.places;
    const imgUrl = this.props.navigation.state.params.user.imgUrl;
    const numExpert = this.expertNumCount(places);
    return(
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          {
            user ?
            <View style={styles.profile}>
              <Avatar
                size="xlarge"
                key={firstName}
                rounded
                source={{uri:`${imgUrl}`}}
                containerStyle={{padding: 15}}
              />
              <Text style={styles.name}>{firstName} {lastName}</Text>
              <Text style={styles.email}>{email}</Text>
            </View>
            : null
          }
          <View style={styles.cards}>
            <View style={styles.card}>
              <Badge value={places.length} status="warning" onPress={() => this.props.navigation.navigate('Places', places)} />
              <Text>Places Visited</Text>
            </View>
          </View>
          <Button title="Log Out" style={styles.logOut} onPress={this.handleLogOut} />
        </View>
        <View style={styles.footer}>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-chatbubbles" size={30} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Howl', { user })}/>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-home" size={30} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Dashboard')}/>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-person" size={30} color="black"/>} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  profile: {
    alignItems: 'center',
    paddingBottom: 10
  },
  name: {
    fontSize: 20,
    padding: 5,
    fontFamily: 'Verdana',
    fontWeight: 'bold'
  },
  email: {
    fontSize: 15,
    fontFamily: 'Verdana'
  },
  cards: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'gray',
    width: 300,
    justifyContent: 'center'
  },
  card: {
    padding: 20,
    alignSelf: 'center',
    fontFamily: 'Verdana'
  },
  logOut: {
    paddingTop: 10,
    justifyContent: 'flex-end',
    fontFamily: 'Verdana'
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  navBtns: {
    paddingLeft: 30,
    paddingRight: 30
  }
});
