import firebase from '../server/config';
// ACTION TYPES
export const SET_AIRPORT = 'SET_AIRPORT';

// ACTION CREATORS
export const gotAirport = airport => ({
  type: SET_AIRPORT,
  airport,
});

// THUNK CREATORS
export const fetchAirport = cityName => async dispatch => {
  try {
    const db = firebase.firestore();
    const airportsRef = db.collection('airports');
    const query = await airportsRef.where('city', '==', cityName.trim()).get();
    const airport = query.docs.map(doc => doc.data().code);
    dispatch(gotAirport(airport));
  } catch (err) {
    console.error(err);
  }
};

// REDUCER
export default (state = [], action) => {
  switch (action.type) {
    case SET_AIRPORT:
      return action.airport;
    default:
      return state;
  }
};
