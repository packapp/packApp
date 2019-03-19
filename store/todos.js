import firebase from '../server/config';

// ACTION TYPES
const SET_TODOS = 'SET_TODOS'
const NEW_TODO = 'NEW_TODO'
// INITIAL STATE
const initialState = {
  todos: []
};

// ACTION CREATORS
export const newTodo = todo => {
  return {
    type: NEW_TODO,
    todo
  }
}

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

export const createNewTodo = (todo) => async dispatch => {
  try {
    console.log('TODO', todo)
    const db = firebase.firestore()
    const tripRef = db.collection('trips').doc(todo.location)
    const query = await tripRef.update({
      todos: {...todo.todos, [todo.todo]: [{completed: todo.completed, userId: todo.userId}]}
    })
  } catch (err) {
    console.error(err)
  }
}
// REDUCER
export default (state= initialState, action) => {
  switch(action.type) {
    default:
      return state;
  }
};
