import firebase from '../server/config';
// ACTION TYPES

// INITIAL STATE

// ACTION CREATORS
export const SET_USERS = 'SET_USERS';

export const gotUsers = users => ({
  type: SET_USERS,
  users,
});

// THUNK CREATORS
export const fetchUsers = userIdArr => async dispatch => {
  dispatch(gotUsers([]));
  try {
    const db = firebase.firestore();
    const usersRef = db.collection('users');
    //const users = [];
    const users = userIdArr.map(async userId => {
      let userRef = usersRef.doc(userId);
      const query = await userRef.get();
      const user = query.data();
      return { userId, ...user };
    });
    const usersArr = await Promise.all(users);
    dispatch(gotUsers(usersArr));
  } catch (err) {
    console.error(err);
  }
};

// REDUCER
export default (state = [], action) => {
  switch (action.type) {
    case SET_USERS:
      return action.users;
    default:
      return state;
  }
};
