import React, {Component} from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Dialog from 'react-native-dialog';
import firebase from '../server/config';
import { connect } from 'react-redux';
import { fetchUsers } from '../store/allUsers';
import { Icon as Test} from 'react-native-elements'

class Places extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Places visited',
      headerLeft:(
        <Button
        onPress={() => navigation.goBack()}
        type="clear"
        icon={<Test name='chevron-left' size={30} />}
        />
    ),
    };
  };
  constructor(props){
    super(props);
    this.ref = firebase.firestore().collection('users');
    this.unsubscribe = null;
    this.state = {
      alert: false,
      place: '',
      places: [],
      expertPlace: '',
      expertAddAlert: false,
      expertRemoveAlert: false
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

  handleAddPlace = async () => {
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

  handleAddExpert = (location) => {
    this.setState({
      expertPlace: location,
      expertAddAlert: true
    });
  }

  handleRemoveExpert = (location) => {
    this.setState({
      expertPlace: location,
      expertRemoveAlert: true
    });
  }

  handleUpdate = async (addOrRemove) => {
    let boolean = false;
    if (addOrRemove === 'add') boolean = true;
    const userId = this.props.navigation.state.params.userId;
    const db = firebase.firestore();
    const userRef = await db.collection('users').doc(userId);
    const userRefData = await userRef.get();
    const placesData = userRefData.data().places;
    const updatedPlaces = placesData.map(place => {
      if (place.location !== this.state.expertPlace) return place;
      return {...place, expert: boolean};
    });
    await userRef.update({
      places: updatedPlaces
    });
    this.setState({
      expertAddAlert: false,
      expertRemoveAlert: false
    });
  }

  render() {
    const places = this.state.places;
    return(
      <ScrollView style={styles.container}>
        {
          places ?
            places.map((item, i) => {
              return (
              <ListItem
              key={i}
              title={item.location}
              style={styles.place}
              rightIcon={<Icon name="ios-ribbon" color={item.expert ? '#ff9933' : '#f8f8f8'} size={30} onPress={item.expert ? () => this.handleRemoveExpert(item.location) : () => this.handleAddExpert(item.location)}/>}
              />
              );
            })
          : null
        }
        <View style={{margin: 10, alignItems: 'center'}}>
          <Icon
            name="ios-add-circle"
            size={40}
            color="#66cc66"
            onPress={() => this.setState({ alert: true})}
          />
        </View>
        <View>
          <Dialog.Container visible={this.state.alert}>
            <Dialog.Title>Add new place</Dialog.Title>
            <Dialog.Input onChangeText={(place) => this.setState({place})}/>
            <Dialog.Button label="Cancel" onPress={() => this.setState({alert: false})}/>
            <Dialog.Button label="OK" onPress={() => this.handleAddPlace()}/>
          </Dialog.Container>
        </View>
        <View>
          <Dialog.Container visible={this.state.expertAddAlert}>
            <Dialog.Title>Add expert badge for {this.state.expertPlace}?</Dialog.Title>
            <Dialog.Button label="Cancel" onPress={() => this.setState({expertAddAlert: false})}/>
            <Dialog.Button label="OK" onPress={() => this.handleUpdate('add')}/>
          </Dialog.Container>
        </View>
        <View>
          <Dialog.Container visible={this.state.expertRemoveAlert}>
            <Dialog.Title>Remove expert badge for {this.state.expertPlace}?</Dialog.Title>
            <Dialog.Button label="Cancel" onPress={() => this.setState({expertRemoveAlert: false})}/>
            <Dialog.Button label="OK" onPress={() => this.handleUpdate('remove')}/>
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
