import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, KeyboardAvoidingView } from 'react-native';
import { Input } from 'react-native-elements';
import firebase from '../server/config';

export default class Login extends React.Component {
  state = { email: '', password: '', errorMessage: null }

  handleLogin = () => {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate('Main'))
      .catch(error => this.setState({ errorMessage: error.message }));
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Text style={styles.header}>pack</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <Input
          style={styles.textInput}
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <Input
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Login" style={styles.button} color="#ff9933" onPress={this.handleLogin} />
        <Text>Don't have an account?</Text>
        <Button
          title="Sign Up"
          color="#ff9933"
          style={styles.button}
          onPress={() => this.props.navigation.navigate('SignUp')}
        />
      </KeyboardAvoidingView>
    )
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
    marginTop: 8
  },
  button: {
    padding: 10,
    backgroundColor: "#ff9933"
  }
});
