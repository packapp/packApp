// // ACTION TYPES

// // INITIAL STATE
// const initialState = {
//   itinerary: [],
// };

// // ACTION CREATORS

// // THUNK CREATORS
// export const createNewItinerary = async (itinInfo, trip) => {
//   itinInfo.time =
//     String(itinInfo.date).slice(0, 10) + String(itinInfo.time2).slice(10);

//   try {
//     const numForApproval = this.calcNumForApproval(
//       this.props.navigation.state.params.users
//     );

//     let approved = false;

//     if (numForApproval === 1) {
//       approved = true;
//     }
//     const newItin = {
//       title: itinInfo.title,
//       description: itinInfo.description,
//       time: new Date(itinInfo.time),
//       numForApproval: this.calcNumForApproval(
//         this.props.navigation.state.params.users
//       ),
//       approved: approved,
//       numApproved: 1,
//       approvedBy: [this.props.navigation.state.params.userId],
//     };
//     const db = firebase.firestore();
//     const tripRef = db.collection('trips').doc(trip);
//     await tripRef.update({
//       itinerary: firebase.firestore.FieldValue.arrayUnion(newItin),
//     });
//   } catch (err) {
//     console.error(err);
//   }
// };

// // REDUCER
// export default (state = initialState, action) => {
//   switch (action.type) {
//     default:
//       return state;
//   }
// };
