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
    this.state = {
      users: [
        {
          email: "grant.sweiss@gmail.com",
          firstName: "Grant",
          imgUrl: "https://www.pngarts.com/files/3/Avatar-Transparent-Image.png",
          lastName: "Wiess",
        },
        {
          email: "toricpope@gmail.com",
          firstName: "Tori",
          imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNngF0RFPjyGl4ybo78-XYxxeap88Nvsyj1_txm6L4eheH8ZBu",
          lastName: "Pope"
        },
        {
          email: "derekveren@gmail.com",
          firstName: "Derek",
          imageUrl: "",
          lastName: "Veren",
        },
        {
          email: "steffveren@gmail.com",
          firstName: "Steffeni",
          imgUrl: "https://cdn.iconscout.com/icon/free/png-256/avatar-369-456321.png",
          lastName: "Veren",
        },
      ]
    };
  }

  async componentDidMount() {
    const db = firebase.firestore();
    const usersRef = db.collection('users');
    const query = await usersRef.get();
    let users = [];
    query.forEach(doc => {
      users.push(doc.data());
    });
    this.setState = ({
      users
    });
  }

  renderRow = ({item}) => {
    const user = this.props.navigation.state.params.user;
    return(
      item.email !== user.email ?
        <TouchableOpacity style={styles.divider} onPress={() => this.props.navigation.navigate('HowlChat', { person: item.firstName })}>
          <Text style={styles.name}>{item.firstName}</Text>
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
