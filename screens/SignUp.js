import React from 'react';
import { StyleSheet, Text, Button, KeyboardAvoidingView, View } from 'react-native';
import { Input, Avatar } from 'react-native-elements';
import { ImagePicker, Permissions } from 'expo';
import b64 from 'base64-js';
import firebase from '../server/config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: null,
      firstName: '',
      lastName: '',
      imgUrl: '',
      bytes: null
    };
  }

  handleSignUp = async () => {
    const db = firebase.firestore();
    const usersRef = db.collection('users');
    const { email, firstName, lastName, imgUrl } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        usersRef.doc(user.user.uid).set({
          email,
          firstName,
          lastName,
          imgUrl,
        });
      })
      .then(() => this.props.navigation.navigate('Main'))
      .catch(error => {
        this.setState({ errorMessage: error.message });
        console.log(error);
      });
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(`images/${this.state.email}`);
    await imageRef.put(this.state.bytes).then((snapshot) => {
      console.log('Uploaded image!');
    });
  };

  getSelectedImage = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true
    });
    if (!result.cancelled) {
      const byteArray = b64.toByteArray(result.base64);
      const bytes = new Uint8Array(byteArray);
      this.setState({
        imgUrl: result.uri,
        bytes
      });
    }
  }

  render() {
    let { imgUrl } = this.state;
    return (
      <KeyboardAwareScrollView>
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
          <Text style={styles.header}>pack</Text>
          {this.state.errorMessage && (
            <Text style={{ color: 'red' }}>{this.state.errorMessage}</Text>
          )}
          <View style={{alignItems: 'center'}}>
            <Avatar
              size="xlarge"
              rounded
              source={{uri:`${imgUrl}`}}
              containerStyle={{borderWidth: 1, borderColor: '#aaaaaa'}}
            />
            <Button title="Add profile picture" onPress={this.getSelectedImage} />
          </View>
          <Input
            placeholder="First name"
            style={styles.textInput}
            errorStyle={{color: 'red'}}
            onChangeText={firstName => this.setState({ firstName })}
            value={this.state.firstName}
          />
          <Input
            placeholder="Last name"
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
          <Button title="Sign Up" type="outline" color="#ff9933" style={styles.button}onPress={this.handleSignUp} />
        </KeyboardAvoidingView>
      </KeyboardAwareScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    fontFamily: 'Verdana'
  },
  header: {
    fontSize: 30,
    padding: 10,
    marginBottom: 10,
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
