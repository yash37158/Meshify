export const addNotification = (message) => {
    return {
      type: 'ADD_NOTIFICATION',
      payload: message,
    };
  };