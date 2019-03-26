// import React, { Component } from 'react';
// import firebase from '../server/config';
// import * as firebase2 from 'firebase';
// import { StyleSheet, Text, Button, View, ScrollView } from 'react-native';
// import { Dropdown } from 'react-native-material-dropdown';

// export const createNewItinerary = async (itinInfo, trip, users, userId) => {
//   try {
//     const numForApproval = calcNumForApproval(users);

//     let approved = false;

//     if (numForApproval === 1) {
//       approved = true;
//     }
//     const newItin = {
//       title: itinInfo.title,
//       description: itinInfo.description,
//       time: new Date(itinInfo.time),
//       numForApproval: calcNumForApproval(users),
//       approved: approved,
//       numApproved: 1,
//       approvedBy: [userId],
//     };
//     const db = firebase.firestore();
//     const tripRef = db.collection('trips').doc(trip);
//     await tripRef.update({
//       itinerary: firebase2.firestore.FieldValue.arrayUnion(newItin),
//     });
//   } catch (err) {
//     console.error(err);
//   }
// };

// class NewItin extends Component {
//   static navigationOptions = {
//     title: 'Add an item',
//   };

//   constructor(props) {
//     super(props);
//     this.state = {
// newUserId: ''
//     };
//     this.onSelectedItemsChange = this.onSelectedItemsChange.bind(this);
//     this.handleOnPress = this.handleOnPress.bind(this);
//   }

//   handleOnPress() {
//     this.setState({
//       time:
//         String(this.state.date).slice(0, 10) +
//         String(this.state.time2).slice(10),
//     });
//     createNewItinerary(
//       this.state,
//       this.props.navigation.state.params.trip,
//       this.props.navigation.state.params.users,
//       this.props.navigation.state.params.userId
//     );
//     this.props.navigation.navigate('SingleTrip');
//   }

//   render() {
//     return (
//       <ScrollView style={{ marginTop: 40 }}>
//       <View style={{ flex: 1, marginLeft: 10 }}>
//             <Dropdown
//               dropdownOffset={{ top: 15, bottom: 0 }}
//               containerStyle={{ width: 390 }}
//               label=""
//               data={this.state.data}
//               value={this.state.startAirport}
//               onChangeText={value => {
//                 this.setState({ startAirport: value });
//               }}
//             />
//           </View>
//       </ScrollView>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 10,
//     backgroundColor: '#f8f8f8',
//     fontFamily: 'Verdana',
//   },
//   header: {
//     fontSize: 20,
//     padding: 10,
//     fontWeight: 'bold',
//     color: '#ff9933',
//   },
//   textInput: {
//     height: 40,
//     flex: 1,
//     maxWidth: 50,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginTop: 8,
//   },
//   dateInput: {
//     paddingLeft: 10,
//     color: '#C8C8C8',
//     fontSize: 18,
//   },
//   button: {
//     padding: 10,
//     flex: 3,
//     color: 'white',
//     backgroundColor: '#aaaaaa',
//   },
//   dateButton: {
//     padding: 10,
//     flex: 3,
//     margin: 10,
//     color: 'white',
//     backgroundColor: '#aaaaaa',
//   },
//   label: {
//     alignSelf: 'center',
//     marginLeft: 10,
//     fontFamily: 'Verdana',
//     fontSize: 15,
//   },
// });

// export default NewItin;
