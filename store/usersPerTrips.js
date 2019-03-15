import firebase from '../server/config';
// ACTION TYPES

// INITIAL STATE
const initialState = {
  users: [],
};

// ACTION CREATORS
export const SET_USERS = 'SET_USERS';

export const gotUsers = users => ({
  type: SET_USERS,
  users,
});

// THUNK CREATORS
export const fetchUsers = userIdArr => dispatch => {
  try {
    const db = firebase.firestore();
    const usersRef = db.collection('users');
    const users = [];
    userIdArr.forEach(async userId => {
      let userRef = usersRef.doc(userId);
      const query = await userRef.get();
      const user = query.data();
      users.push(user);
    });
    dispatch(gotUsers(users));
  } catch (err) {
    console.error(err);
  }
};

// REDUCER
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USERS:
      return { ...state, users: action.users };
    default:
      return state;
  }
};
