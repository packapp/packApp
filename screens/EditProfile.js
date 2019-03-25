import React, {Component} from 'react';
import { StyleSheet, Button, ScrollView, View } from 'react-native';
import { Input, Avatar } from 'react-native-elements';
import CameraRollPicker from 'react-native-camera-roll-picker';
import firebase from '../server/config';

export default class EditProfile extends Component {
  static navigationOptions = {
    title: 'Edit profile',
  };

  constructor(props) {
    super(props);
    this.state = {
      firstName: this.props.navigation.state.params.userProps.firstName,
      lastName: this.props.navigation.state.params.userProps.lastName,
      imgUrl: [this.props.navigation.state.params.userProps.imgUrl],
      showCameraRoll: false
    };
  }

  componentDidMount() {
    this.setState({
      firstName: this.props.navigation.state.params.userProps.firstName,
      lastName: this.props.navigation.state.params.userProps.lastName,
      imgUrl: [this.props.navigation.state.params.userProps.imgUrl]
    });
  }

  handleUpdate = async () => {
    const userId = this.props.navigation.state.params.userId;
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;
    const imgUrl = this.state.imgUrl[0];
    // this.convertLocalImage(imgUrl);

    const db = firebase.firestore();
    const userRef = await db.collection('users').doc(userId);
    await userRef.update({
      firstName,
      lastName,
      imgUrl
    });
    this.props.navigation.navigate('Profile');
  }

  getPhotos = () => {
    this.setState({
      showCameraRoll: true
    });
  }

  getSelectedImage = (image) => {
    const imgUrl = [];
    imgUrl.push(image[0].uri);
    this.setState({
      imgUrl,
      showCameraRoll: false
    });
  }

  // convertLocalImage = async (uri) => {
  //   const response = await fetch(uri);
  //   const blob = await response.blob();
  //   const storageRef = firebase.storage().ref();
  //   const pathReference = await storageRef.child(`images/${this.props.navigation.state.params.user.email}`);
  //   pathReference.put(blob).then(snapshot => {
  //     console.log('uploaded');
  //   });
  // }

  render() {
    let { imgUrl } = this.state;
    return (
      <ScrollView style={{ marginTop: 40 }}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Avatar
            size="xlarge"
            rounded
            source={{uri:`${imgUrl[0]}`}}
            containerStyle={{borderWidth: 1, borderColor: '#aaaaaa'}}
          />
          <Button title="Change profile picture" onPress={this.getPhotos} />
            {this.state.showCameraRoll ?
                <CameraRollPicker
                  groupTypes='SavedPhotos'
                  selectSingleItem={true}
                  selected={imgUrl}
                  assetType='Photos'
                  imagesPerRow={3}
                  imageMargin={5}
                  callback={this.getSelectedImage}
                />
              : null
            }
        </View>
          <Input
            placeholder="First Name"
            style={styles.textInput}
            errorStyle={{color: 'red'}}
            onChangeText={firstName => this.setState({ firstName })}
            value={this.state.firstName}
          />
          <Input
            placeholder="Last Name"
            style={styles.textInput}
            onChangeText={lastName => this.setState({ lastName })}
            value={this.state.lastName}
          />
          <View
          style={{ backgroundColor: '#ff9933', borderRadius: 50, margin: 20 }}
          >
            <Button
              title="Update profile"
              type="outline"
              color="white"
              style={styles.button}
              onPress={this.handleUpdate}
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
    flex: 3,
    color: 'white',
    backgroundColor: '#aaaaaa',
  }
});
