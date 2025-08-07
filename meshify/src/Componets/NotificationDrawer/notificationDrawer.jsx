import React from 'react';

const NotificationDrawer = ({ messages }) => {
  return (
    <div className="fixed inset-y-0 right-0 w-72 bg-base-200 shadow-xl overflow-y-auto">
      <div className="p-4 border-b border-base-300">
        <h3 className="text-lg font-bold">Notifications</h3>
      </div>
      <div className="p-4">
        {messages.length > 0 ? (
          <ul className="space-y-4">
            {messages.map((message, index) => (
              <li key={index} className="border-b border-base-300 pb-2">
                {message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-base-content/50">No notifications</p>
        )}
      </div>
    </div>
  );
};

export default NotificationDrawer;
