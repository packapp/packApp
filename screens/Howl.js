import React, {Component} from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, SafeAreaView} from 'react-native';
import { Button } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from '../server/config';

export default class Howl extends Component {
  static navigationOptions = {
    title: 'Howls'
  }

  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('users');
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const users = [];
    querySnapshot.forEach(doc => {
      users.push(doc.data());
    });
    this.setState({
      users
    });
  }

  renderRow = ({item}) => {
    const user = this.props.navigation.state.params.user;
    return(
      item.email !== user.email ?
        <TouchableOpacity style={styles.divider} onPress={() => this.props.navigation.navigate('HowlChat', {item, user})}>
          <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
        </TouchableOpacity>
      : null
    );
  }

  render(){
    const user = this.props.navigation.state.params.user;
    return(
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
        {this.state.users ?
        <FlatList
          data={this.state.users}
          renderItem={this.renderRow}
          keyExtractor={(item) => item.firstName}
        />
        : null
        }
        <View style={styles.footer}>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-chatbubbles" size={30} color="black"/>} />
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-home" size={30} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Dashboard')}/>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-person" size={30} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Profile', { user })}/>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 250
  },
  divider: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  name: {
    fontSize: 20
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
