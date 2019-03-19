import firebase from '../server/config';
// ACTION TYPES

// ACTION CREATORS
export const SET_USERS = 'SET_USERS';

export const gotUsers = users => ({
  type: SET_USERS,
  users,
});

export const fetchUsers = () => async dispatch => {
  try {
    const db = firebase.firestore();
    const query = await db.collection('users').get();
    const users = query.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });
    dispatch(gotUsers(users));
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
