// ACTION TYPES

// INITIAL STATE
const initialState = {
  itinerary: [],
};

// ACTION CREATORS

// THUNK CREATORS
// export const createNewItinerary = async (itinInfo, trip, oldItin) => {
//   try {
//     const newItin = {
//       title: itinInfo.title,
//       description: itinInfo.description,
//       time: itinInfo.time,
//       numForApproval: itinInfo.numForApproval,
//       approved: false,
//       numApproved: 1
//     }
//     const db = firebase.firestore();
//     const tripRef = db.collection('trips').doc(trip);
//    await tripRef.update({
//       itinerary: [...oldItin, newItin ]
//     })
//     const query = tripRef.get();

//   } catch (err) {
//     console.error(err)
//   }
// }

// REDUCER
export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
