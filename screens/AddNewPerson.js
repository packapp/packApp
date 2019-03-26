import React, { Component } from 'react';
import firebase from '../server/config';
import * as firebase2 from 'firebase';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { fetchUsers } from '../store/allUsers';
import { connect } from 'react-redux';

class AddNewPerson extends Component {
  static navigationOptions = {
    title: 'Add an item',
  };

  constructor(props) {
    super(props);
    this.state = {
      newUser: '',
    };
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  addPersonToPack = async () => {
    let newUserId = '';
    this.props.allUsers.forEach(user => {
      const fullName = `${user.firstName} ${user.lastName}`;
      if (this.state.newUser === fullName) {
        newUserId = user.id;
      }
    });
    try {
      const db = firebase.firestore();
      const tripRef = db
        .collection('trips')
        .doc(this.props.navigation.state.params.location);
      await tripRef.update({
        attendees: firebase2.firestore.FieldValue.arrayUnion(newUserId),
      });
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const USERS = this.props.allUsers
      ? this.props.allUsers.map(user => {
          return { value: `${user.firstName} ${user.lastName}` };
        })
      : '';

    if (this.props.allUsers) console.log(this.props.allUsers);
    return (
      <ScrollView style={{ marginTop: 40 }}>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Dropdown
            dropdownOffset={{ top: 15, bottom: 0 }}
            containerStyle={{ width: 390 }}
            label="New User"
            data={USERS}
            value={this.state.newUserId}
            onChangeText={value => {
              this.setState({ newUserId: value });
            }}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
    fontFamily: 'Verdana',
  },
  header: {
    fontSize: 20,
    padding: 10,
    fontWeight: 'bold',
    color: '#ff9933',
  },
  textInput: {
    height: 40,
    flex: 1,
    maxWidth: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
  },
  dateInput: {
    paddingLeft: 10,
    color: '#C8C8C8',
    fontSize: 18,
  },
  button: {
    padding: 10,
    flex: 3,
    color: 'white',
    backgroundColor: '#aaaaaa',
  },
  dateButton: {
    padding: 10,
    flex: 3,
    margin: 10,
    color: 'white',
    backgroundColor: '#aaaaaa',
  },
  label: {
    alignSelf: 'center',
    marginLeft: 10,
    fontFamily: 'Verdana',
    fontSize: 15,
  },
});

const mapStateToProps = state => {
  return {
    allUsers: state.allUsers,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUsers: () => dispatch(fetchUsers()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddNewPerson);
