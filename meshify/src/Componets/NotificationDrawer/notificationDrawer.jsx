import React from 'react';

const NotificationDrawer = ({ messages }) => {
  return (
    <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg">
      <div className="py-4 px-6 border-b">
        <h3 className="text-lg font-bold">Notifications</h3>
      </div>
      <div className="px-6 py-4">
        {messages.length > 0 ? (
          <ul className="space-y-4">
            {messages.map((message, index) => (
              <li key={index} className="border-b py-2">
                {message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No notifications</p>
        )}
      </div>
    </div>
  );
};

export default NotificationDrawer;
