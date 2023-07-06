// notificationReducer.js
const initialState = {
    messages: [],
  };
  
  const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_NOTIFICATION':
        return {
          ...state,
          messages: [...state.messages, action.payload],
        };
      default:
        return state;
    }
  };
  
  export default notificationReducer;
  