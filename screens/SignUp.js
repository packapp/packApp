import React from 'react';
import { StyleSheet, Text, Button, KeyboardAvoidingView } from 'react-native';
import { Input } from 'react-native-elements';

import firebase from '../server/config';

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: null,
      firstName: '',
      lastName: '',
      imageUrl: '',
    };
  }

  handleSignUp = () => {
    const db = firebase.firestore();
    const usersRef = db.collection('users');
    const { email, firstName, lastName, imageUrl } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        usersRef.doc(user.user.uid).set({
          email,
          firstName,
          lastName,
          imageUrl,
        });
      })
      .then(() => this.props.navigation.navigate('Main'))
      .catch(error => {
        this.setState({ errorMessage: error.message });
        console.log(error);
      });
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
          <Text style={styles.header}>pack</Text>
          {this.state.errorMessage && (
            <Text style={{ color: 'red' }}>{this.state.errorMessage}</Text>
          )}
          <Input
            placeholder="First Name"
            autoCapitalize="none"
            style={styles.textInput}
            errorStyle={{color: 'red'}}
            onChangeText={firstName => this.setState({ firstName })}
            value={this.state.firstName}
          />
          <Input
            placeholder="Last Name"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={lastName => this.setState({ lastName })}
            value={this.state.lastName}
          />
          <Input
            placeholder="Email"
            autoCapitalize="none"
            style={styles.textInput}
            keyboardType="email-address"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
          <Input
            secureTextEntry
            placeholder="Password"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
          <Input
            placeholder="Image"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={imageUrl => this.setState({ imageUrl })}
            value={this.state.imageUrl}
          />
          <Button title="Sign Up" type="outline" color="#ff9933" style={styles.button} onPress={this.handleSignUp} />
          <Text>Already have an account?</Text>
          <Button
            title="Login"
            type="outline"
            color="#ff9933"
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Login')}
          />
      </KeyboardAvoidingView>
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
    fontFamily: 'Verdana'
  },
  header: {
    fontSize: 30,
    padding: 10,
    fontWeight: "bold",
    color: "#ff9933"
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
  },
  button: {
    padding: 10,
  }
});
