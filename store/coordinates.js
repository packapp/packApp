import firebase from '../server/config';

export const SET_COORDINATES = 'SET_COORDINATES';

export const gotCoordinates = coordinates => ({
  type: SET_COORDINATES,
  coordinates,
});

// THUNK CREATORS
export const fetchAirportCoordinates = airportCode => async dispatch => {
  try {
    console.log('AIRPORT CODE', airportCode);
    const db = firebase.firestore();
    const airportsRef = db.collection('airports');
    const query = await airportsRef
      .where('code', '==', airportCode.trim())
      .get();
    const coordinates = query.docs.map(doc => {
      return { lon: doc.data().lon, lat: doc.data().lat };
    });
    dispatch(gotCoordinates(coordinates));
  } catch (err) {
    console.error(err);
  }
};

// REDUCER
export default (state = {}, action) => {
  switch (action.type) {
    case SET_COORDINATES:
      return action.coordinates;
    default:
      return state;
  }
};
