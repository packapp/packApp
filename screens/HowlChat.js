import React, {Component} from 'react';
import { SafeAreaView, TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons'
import firebase from '../server/config';
import { fetchMessages } from '../store/messages';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class HowlChat extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.state.params.item.firstName,
      headerRight: (
        <Button
          onPress={() => navigation.navigate('FriendProfile', navigation.state.params.item)}
          type="clear"
          icon={<Icon name="ios-person" size={20} color="#ff9933"/>}
          style={styles.profileBtn}
        />
      )
    };
  }

  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('messages').doc(this.props.navigation.state.params.user.email).collection('messagesWith').doc(this.props.navigation.state.params.item.email).collection('allMessages').orderBy('time');
    this.unsubscribe = null;
    this.state = {
      message: '',
      messages: []
    };
  }

  async componentDidMount() {
    const userEmail = this.props.navigation.state.params.user.email;
    const personEmail = this.props.navigation.state.params.item.email;
    const messages = await this.props.fetchMessages(userEmail, personEmail);
    this.setState({
      messages
    });
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
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

  handleChange = key => val => {
    this.setState({
      [key]: val
    });
  }

  async sendMessage(userEmail, personEmail) {
    let message = {
      message: this.state.message,
      time: new Date(),
      from: userEmail
    };
    const db = firebase.firestore();
    const messagesRef = db.collection('messages');
    if (this.state.message.length > 0) {
      await messagesRef.doc(userEmail).collection('messagesWith').doc(personEmail).collection('allMessages').add(message);

      await messagesRef.doc(personEmail).collection('messagesWith').doc(userEmail).collection('allMessages').add(message);

      this.setState({
        message: ''
      });

      await this.props.fetchMessages(userEmail, personEmail);
    }
  }

  renderRow = ({item}) => {
    const user = this.props.navigation.state.params.user;
    const person = this.props.navigation.state.params.item;
    const fromName = item.from === user.email ? user.firstName : person.firstName;
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
    const personEmail = this.props.navigation.state.params.item.email;
    return(
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView style={styles.keyboardContainer} behavior="padding">
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
          <View style={{flexDirection: 'row', alignItems: 'center', marginHorizonal: 5, justifySelf: 'flex-end', marginLeft: 10, marginRight: 10}}>
            <TextInput
              style={styles.input}
              value={this.state.message}
              placeholder="Type message..."
              onChangeText={this.handleChange('message')}
            />
            <TouchableOpacity onPress={() => this.sendMessage(userEmail, personEmail)} style={{paddingBottom: 10, marginLeft: 5}}>
              <Text style={styles.button}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages.messages
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMessages: (userEmail, personEmail) => dispatch(fetchMessages(userEmail, personEmail))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HowlChat);

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 15,
  },
  button: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingRight: 10,
    paddingLeft: 5,
    color: '#ff9933'
  },
  profileBtn: {
    marginRight: 10
  }
});
