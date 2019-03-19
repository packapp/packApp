import firebase from '../server/config';

// ACTION TYPES
const SET_TODOS = 'SET_TODOS'
// INITIAL STATE
const initialState = {
  todos: []
};

// ACTION CREATORS
export const gotTodos = todos => {
  return {
    type: SET_TODOS,
    todos
  }
}
// THUNK CREATORS
export const fetchTodos = (userId, tripName) => async dispatch => {
  try {
    const db = firebase.firestore()
    const todosRef = db.collection('trips').doc(`${tripName}`)
    const query = await todosRef.where('userId', '==', userId)
    .get()
    const todos = []
    query.forEach(doc => {
      todos.push(doc.data())
    })
    dispatch(gotTodos(todos))
  } catch (error) {
    console.error(error)
  }
}
// REDUCER
export default (state= initialState, action) => {
  switch(action.type) {
    default:
      return state;
  }
};
