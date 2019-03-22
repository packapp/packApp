import React, {Component} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button as Btn } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from '../server/config';

export default class Profile extends Component {
  static navigationOptions = {
    title: 'Profile'
  }

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
    const userId = this.props.navigation.state.params.userId;
    const firstName = this.props.navigation.state.params.user.firstName;
    const lastName = this.props.navigation.state.params.user.lastName;
    const email = this.props.navigation.state.params.user.email;
    const places = this.props.navigation.state.params.user.places;
    const imgUrl = this.props.navigation.state.params.user.imgUrl;
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
              <TouchableOpacity style={styles.numPlacesBtn} onPress={() => this.props.navigation.navigate('Places', { places, email, userId })}>
                <Text style={styles.numPlaces}>{places.length}</Text>
              </TouchableOpacity>
              <Text>Places visited</Text>
            </View>
          </View>
          <View style={{ backgroundColor: '#66cc66', borderRadius: 50, margin: 20 }}>
          <Btn
            title="Log out"
            type="outline"
            color="white"
            titleStyle={styles.logOut}
            onPress={this.handleLogOut}
          />
          </View>
        </View>
        <View style={styles.footer}>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-chatbubbles" size={25} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Howl', { user, userId })}/>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-home" size={25} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Dashboard')}/>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-person" size={25} color="black"/>} />
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
  numPlacesBtn: {
    borderWidth:1,
    borderColor:'#ff9933',
    alignItems:'center',
    justifyContent:'center',
    alignSelf: 'center',
    width:30,
    height:30,
    backgroundColor:'#ff9933',
    borderRadius:50,
    marginBottom: 10
  },
  numPlaces: {
    fontWeight: 'bold',
    color: '#f8f8f8'
  },
  logOut: {
    fontFamily: 'Verdana',
    fontWeight: 'bold'
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
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
