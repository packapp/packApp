import * as firebase from 'firebase'
require('../secrets')

//Initialize firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "pack-602d7.firebaseapp.com",
  databaseURL: "https://pack-602d7.firebaseio.com",
  projectId: "pack-602d7",
  storageBucket: "pack-602d7.appspot.com",
  messagingSenderId: "262058969678"
};

export const makeRef = path => {
  return firebase.database().ref(path)
}

export default (!firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app());

export const storageRef = firebase.storage().ref()
