// store.js
import { createStore, combineReducers } from 'redux';
import notificationReducer from './notificationReducer';

const rootReducer = combineReducers({
  notification: notificationReducer,
  // other reducers...
});

const store = createStore(rootReducer);

export default store;
