import React, {Component} from 'react';
import { SafeAreaView, TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Dimensions, KeyboardAvoidingView } from 'react-native';
import firebase from '../server/config';
import { fetchMessages } from '../store/messages';
import { fetchUsers } from '../store/usersPerTrips';
import { connect } from 'react-redux';

class HowlGroup extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.state.params.item.location
    };
  }

  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('messages').doc(this.props.navigation.state.params.user.email).collection('messagesWith').doc(this.props.navigation.state.params.item.location).collection('allMessages').orderBy('time');
    this.unsubscribe = null;
    this.usersRef = firebase.firestore().collection('users');
    this.state = {
      message: '',
      messages: [],
      users: []
    };
  }

  async componentDidMount() {
    const userEmail = this.props.navigation.state.params.user.email;
    const trip = this.props.navigation.state.params.item.location;
    const messages = await this.props.fetchMessages(userEmail, trip);
    this.setState({
      messages
    });

    let userIds = [];
    if (this.props.navigation.state.params.item.attendees) {
      userIds = [...this.props.navigation.state.params.item.attendees];
      userIds.push(this.props.navigation.state.params.item.host);
    }
    this.props.fetchUsers(userIds);

    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    this.unsubscribeUsers = this.usersRef.onSnapshot(this.onUsersCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.unsubscribeUsers();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach(doc => {
      messages.push(doc.data());
    });
    this.setState({
      messages
    });
  }

  onUsersCollectionUpdate = (querySnapshot) => {
    const users = [];
    querySnapshot.forEach(doc => {
      users.push(doc.data());
    });
    this.setState({
      users
    });
  }

  handleChange = key => val => {
    this.setState({
      [key]: val
    });
  }

  async sendMessage(userEmail, trip) {
    let message = {
      message: this.state.message,
      time: new Date(),
      from: userEmail
    };
    const db = firebase.firestore();
    const messagesRef = db.collection('messages');
    if (this.state.message.length > 0) {
      this.props.usersPerTrip.forEach((user) =>
        (
          messagesRef.doc(user.email).collection('messagesWith').doc(trip).collection('allMessages').add(message)
        )
      );

      this.setState({
        message: ''
      });

      await this.props.fetchMessages(userEmail, trip);
    }
  }

  getName = (email) => {
    let userName;
    this.state.users.map(user => {
      if (email === user.email)
      userName = user.firstName;
    });
    return userName;
  }

  renderRow = ({item}) => {
    const user = this.props.navigation.state.params.user;
    const fromName = this.getName(item.from);
    return(
      <View style={{
        flexDirection: 'column',
        width: '60%',
        alignSelf: item.from === user.email ? 'flex-end' : 'flex-start',
        backgroundColor: item.from === user.email ? '#66cc66' : '#E8E8E8',
        borderRadius: 7,
        marginBottom: 10,
      }}>
        <View style={{flexDirection: 'row', paddingLeft: 7, paddingRight: 7, paddingTop: 7, alignItems: 'center'}}>
          <Text style={{color: item.from === user.email ? '#eee' : 'black', fontSize: 16, fontWeight: 'bold', paddingRight: 5}}>{fromName}</Text>
          <Text style={{color: item.from === user.email ? '#eee' : 'black', fontSize: 12}}>{this.convertTime(item.time.seconds)}</Text>
        </View>
        <Text style={{color: item.from === user.email ? '#fff' : 'black', padding: 7, fontSize: 16}}>{item.message}</Text>
      </View>
    );
  }

  convertTime = (time) => {
    let date = new Date(null);
    date.setSeconds(time);
    return date.toString().slice(16, 24);
  }

  render(){
    let { height, width } = Dimensions.get('window');
    const userEmail = this.props.navigation.state.params.user.email;
    const trip = this.props.navigation.state.params.item.location;
    return(
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={styles.keyboardContainer} behavior="padding">
        {
          this.props.messages ?
          <FlatList
            style={{padding: 10, height: height * .8, marginBottom: 10, flex: 1}}
            data={this.state.messages}
            renderItem={this.renderRow}
            keyExtractor={(item, index) => index.toString()}
          />
          : null
        }
          <View style={{flexDirection: 'row', alignItems: 'center', marginHorizonal: 5, justifySelf: 'flex-end'}}>
            <TextInput
              style={styles.input}
              value={this.state.message}
              placeholder="Type message..."
              onChangeText={this.handleChange('message')}
            />
            <TouchableOpacity onPress={() => this.sendMessage(userEmail, trip)} style={{paddingBottom: 10, marginLeft: 5}}>
              <Text style={styles.button}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages.messages,
    usersPerTrip: state.users
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMessages: (userEmail, trip) => dispatch(fetchMessages(userEmail, trip)),
    fetchUsers: (userIds) => dispatch(fetchUsers(userIds))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HowlGroup);

const styles = StyleSheet.create({
  container: {
   marginLeft: 10,
   flex: 1
  },
  keyboardContainer: {
   flex: 1,
  },
  input: {
    height: 40,
    borderWidth: .5,
    borderRadius: 5,
    borderColor: '#aaaaaa',
    width: '80%',
    padding: 10,
    marginBottom: 10,
  },
  button: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingRight: 10,
    paddingLeft: 5,
    color: '#ff9933'
  }
});
