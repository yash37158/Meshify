import { combineReducers } from 'redux';
import notificationReducer from './notificationReducer';

// Combine the reducers
const rootReducer = combineReducers({
  notification: notificationReducer,
});

export default rootReducer;