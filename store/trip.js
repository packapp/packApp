import firebase from '../server/config';
// ACTION TYPES
export const SET_ALPHA_TRIPS = 'SET_ALPHA_TRIPS';
export const SET_PACK_TRIPS = 'SET_PACK_TRIPS';
export const SET_SELECTED_TRIP = 'SET_SELECTED_TRIP';
// export const ADD_TRIP = 'ADD_TRIP';

// INITIAL STATE
const initialState = {
  alpha: [],
  pack: [],
  selectedTrip: {},
};

// ACTION CREATORS
export const gotAlphaTrips = trips => ({
  type: SET_ALPHA_TRIPS,
  trips,
});

export const gotPackTrips = trips => ({
  type: SET_PACK_TRIPS,
  trips,
});

export const gotSelectedTrip = trip => ({
  type: SET_SELECTED_TRIP,
  trip,
});

// export const gotNewTrip = trip => ({
//   type: ADD_TRIP,
//   trip,
// });

// THUNK CREATORS
//grabs all trips that the logged in user is hosting
export const fetchAlphaTrips = userId => async dispatch => {
  try {
    const db = firebase.firestore();
    const tripsRef = db.collection('trips');
    const query = await tripsRef.where('host', '==', userId).get();
    const alphaTrips = [];
    query.forEach(doc => {
      alphaTrips.push(doc.data());
    });
    dispatch(gotAlphaTrips(alphaTrips));
  } catch (err) {
    console.error(err);
  }
};

//grabs all the trips that the logged in user is attending
export const fetchPackTrips = userId => async dispatch => {
  try {
    const db = firebase.firestore();
    const tripsRef = db.collection('trips');
    const query = await tripsRef
      .where('attendees', 'array-contains', userId)
      .get();
    const packTrips = [];
    query.forEach(doc => {
      packTrips.push(doc.data());
    });
    dispatch(gotPackTrips(packTrips));
  } catch (err) {
    console.error(err);
  }
};

//grabs a single trip based on the name of the trip/document
export const fetchSingleTrip = tripName => async dispatch => {
  try {
    const db = firebase.firestore();
    const tripRef = db.collection('trips').doc(tripName);
    const query = await tripRef.get();
    const trip = query.data();
    dispatch(gotSelectedTrip(trip));
  } catch (err) {
    console.error(err);
  }
};

export const createNewTrip = tripData => async dispatch => {
  try {
    const db = firebase.firestore();
    const tripRef = db.collection('trips').doc(tripData.destination);
    const query = await tripRef.set({
      attendees: tripData.selectedItems,
      startDate: new Date(tripData.startDate),
      endDate: new Date(tripData.endDate),
      host: tripData.host,
      startAirport: tripData.startAirport,
      endAirport: tripData.endAirport,
      location: tripData.destination,
      todos: {},
      itinerary: {},
      imageUrl: tripData.imageUrl,
    });
    // const newTripQuery = await tripRef.get();
    // const newTrip = newTripQuery.data();
    // dispatch(gotNewTrip(newTrip));
    dispatch(fetchAlphaTrips(tripData.host));
  } catch (err) {
    console.error(err);
  }
};

// REDUCER
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ALPHA_TRIPS:
      return { ...state, alpha: action.trips };
    case SET_PACK_TRIPS:
      return { ...state, pack: action.trips };
    case SET_SELECTED_TRIP:
      return { ...state, selectedTrip: action.trip };
    // case ADD_TRIP:
    //   return { ...state, alpha: [...state.alpha, action.newTrip] };
    default:
      return state;
  }
};
