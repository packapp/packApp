import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import user from './user';
import trip from './trip';
import todos from './todos';
import itinerary from './itinerary';
import flight from './flight';
import users from './usersPerTrips';

const reducer = combineReducers({
  user,
  trip,
  todos,
  itinerary,
  flight,
  users,
});
const middleWare = applyMiddleware(
  thunkMiddleware,
  createLogger({ collapsed: true })
);
const store = createStore(reducer, middleWare);

export default store;
export * from './user';
export * from './trip';
export * from './todos';
export * from './itinerary';
export * from './flight';
export * from './usersPerTrips';
