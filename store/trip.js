import firebase from '../server/config';
// ACTION TYPES
export const SET_ALPHA_TRIPS = 'SET_ALPHA_TRIPS';
export const SET_PACK_TRIPS = 'SET_PACK_TRIPS';

// INITIAL STATE
const initialState = {
  trips: {
    alpha: [],
    pack: [],
    selectedTrip: {},
  },
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

// THUNK CREATORS
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

// REDUCER
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ALPHA_TRIPS:
      return { ...state, alpha: action.trips };
    case SET_PACK_TRIPS:
      return { ...state, pack: action.trips };
    default:
      return state;
  }
};
