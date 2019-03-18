import firebase from '../server/config';
// ACTION TYPES

// INITIAL STATE
const initialState = {
  user: {}
};

// ACTION CREATORS
export const SET_USER = 'SET_USER';

export const gotUser = user => ({
  type: SET_USER,
  user,
});

export const fetchUser = userId => dispatch => {
  try {
    const db = firebase.firestore();
    const usersRef = db.collection('users').doc(userId);
    usersRef.get().then(user => {
      dispatch(gotUser(user.data()));
    });
  } catch (err) {
    console.error(err);
  }
};

// REDUCER
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.user };
    default:
      return state;
  }
};
