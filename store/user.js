import firebase from '../server/config';
// ACTION TYPES

// INITIAL STATE
const initialState = {
  users: [],
  user: {}
};

// ACTION CREATORS
export const GET_USERS = 'GET_USERS';
export const SET_USER = 'SET_USER';

export const getUsers = users => ({
  type: GET_USERS,
  users
});

export const gotUser = user => ({
  type: SET_USER,
  user,
});

// THUNK CREATORS
// export const fetchUsers = () => async dispatch => {
//   try {
//     const db = firebase.firestore();
//     const usersRef = db.collection('users');
//     const query = await usersRef.get();
//     const users = query.docs.map(doc => doc.data());
//     dispatch(getUsers(users));
//   } catch (err) {
//     console.error(err);
//   }
// };

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
    case GET_USERS:
      return {...state, users: action.users};
    case SET_USER:
      return { ...state, user: action.user };
    default:
      return state;
  }
};
