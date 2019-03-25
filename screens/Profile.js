import React, {Component} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button as Btn } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from '../server/config';

let userProps = [];
let userId;

export default class Profile extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Profile',
      headerRight: (
        <Button
          onPress={() => navigation.navigate('EditProfile', {userProps, userId})}
          type="clear"
          icon={<Ionicons name="md-create" size={27} color="#ff9933"/>}
          style={styles.editBtn}
        />
      )
    };
  }

  constructor(props) {
    super(props);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.expertNumCount = this.expertNumCount.bind(this);
    this.ref = firebase.firestore().collection('users');
    this.unsubscribe = null;
    this.state = {
      firstName: '',
      lastName: '',
      imgUrl: '',
      places: []
    };
  }

  componentDidMount() {
    userProps = this.props.navigation.state.params.user;
    userId = this.props.navigation.state.params.userId;
    this.setState({
      firstName: this.props.navigation.state.params.user.firstName,
      lastName: this.props.navigation.state.params.user.lastName,
      imgUrl: this.props.navigation.state.params.user.imgUrl
    });
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = async(querySnapshot) => {
    let allUserData = [];
    await querySnapshot.forEach(doc => {
        allUserData.push(doc.data());
    });
    let userData = [];
    let places = [];
    allUserData.map(user => {
      if (user.email === this.props.navigation.state.params.user.email) {
        userData = user;
        places = user.places;
      }
    });
    userProps = {...userProps, firstName: userData.firstName, lastName: userData.lastName, imgUrl: userData.imgUrl};
    const storage = firebase.storage();
    const imgUrl = await storage.ref(`images/${this.props.navigation.state.params.user.email}`).getDownloadURL();
    const db = firebase.firestore();
    const userRef = await db.collection('users').doc(userId);
    await userRef.update({
      imgUrl
    });

    this.setState({
      firstName: userData.firstName,
      lastName: userData.lastName,
      // imgUrl: userData.imgUrl,
      imgUrl,
      places
    });
    console.log('CHANGED STATE', this.state.imgUrl);
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
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;
    const email = this.props.navigation.state.params.user.email;
    const places = this.state.places;
    const imgUrl = this.state.imgUrl;
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
                { places.length ?
                  <Text style={styles.numPlaces}>{places.length}</Text>
                : <Text style={styles.numPlaces}>0</Text>
                }
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
  editBtn: {
    marginRight: 10
  },
  navBtns: {
    paddingLeft: 30,
    paddingRight: 30
  }
});
