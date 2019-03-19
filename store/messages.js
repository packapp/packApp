import firebase from '../server/config';

// ACTION TYPES
const GET_MESSAGES = 'GET_MESSAGES';

// INITIAL STATE
const initialState = {
  messages: []
};

// ACTION CREATORS
const getMessages = messages => ({
  type: GET_MESSAGES,
  messages
});

// THUNK CREATORS
export const fetchMessages = (userEmail, messageDoc) => async dispatch => {
  try {
    const db = firebase.firestore();
    const messagesRef = db.collection('messages').doc(userEmail).collection('messagesWith').doc(messageDoc).collection('allMessages');
    const query = await messagesRef.orderBy('time').get();
    let messages = [];
    query.forEach(doc => {
      messages.push(doc.data());
    });
    dispatch(getMessages(messages));
  } catch(err) {
    console.error(err);
  }
};

// REDUCER
export default (state= initialState, action) => {
  switch(action.type) {
    case GET_MESSAGES:
      return {...state, messages: action.messages};
    default:
      return state;
  }
};
