import React, {Component} from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Dialog from 'react-native-dialog';
import firebase from '../server/config';
import { connect } from 'react-redux';
import { fetchUsers } from '../store/allUsers';

class Places extends Component {
  constructor(props){
    super(props);
    this.ref = firebase.firestore().collection('users');
    this.unsubscribe = null;
    this.state = {
      alert: false,
      place: '',
      places: []
    };
  }

  async componentDidMount() {
    const email = this.props.navigation.state.params.email;
    await this.props.fetchUsers();
    const places = this.getPlaces(this.props.allUsers, email);
    this.setState({
      places
    });
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getPlaces = (places, email) => {
    let userPlaces = [];
    places.map(user => {
      if (user.email === email) userPlaces = user.places;
    });
    return userPlaces;
  }

  onCollectionUpdate = async (querySnapshot) => {
    const allUsers = [];
    const email = this.props.navigation.state.params.email;
    await querySnapshot.forEach(doc => {
      allUsers.push(doc.data());
    });
    const places = await this.getPlaces(allUsers, email);
    this.setState({
      places
    });
  }

  handleAdd = async () => {
    const place = this.state.place;
    const places = this.props.navigation.state.params.places;
    const userId = this.props.navigation.state.params.userId;
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      places: [...places, {expert: false, location: place} ]
    });
    this.setState({
      place: '',
      alert: false
    });
  }

  render() {
    const places = this.state.places;
    return(
      <ScrollView style={styles.container}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center'}}>
          <Text style={styles.title}>Places Visited</Text>
          <Icon
            name="ios-add-circle"
            size={40}
            color="#66cc66"
            onPress={() => this.setState({ alert: true})}
          />
        </View>
        {
          places ?
            places.map((item, i) => {
              return (
              <ListItem
              key={i}
              title={item.location}
              style={styles.place}
              rightIcon={item.expert ? <Icon name="ios-ribbon" color="#ff9933" size={30} /> : null}
              />
              );
            })
          : null
        }
        <View>
          <Dialog.Container visible={this.state.alert}>
            <Dialog.Title>Add new place</Dialog.Title>
            <Dialog.Input onChangeText={(place) => this.setState({place})}/>
            <Dialog.Button label="Cancel" onPress={() => this.setState({alert: false})}/>
            <Dialog.Button label="OK" onPress={() => this.handleAdd()}/>
          </Dialog.Container>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    allUsers: state.allUsers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUsers: () => dispatch(fetchUsers())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Places);

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
