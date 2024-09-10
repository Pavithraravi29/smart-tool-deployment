import React, { useState, useEffect } from 'react';

const Alarms = () => {
  const [alarms, setAlarms] = useState([]);

  const logPageStatus = (status) => {
    const now = new Date();
    const timestamp = now.toISOString();
    setAlarms((prevAlarms) => [
      ...prevAlarms,
      {
        timestamp,
        status,
        message: `Status Update App Server: ${status}`,
      },
    ]);
  };

  const clearLog = () => {
    setAlarms([]);
  };

  useEffect(() => {
    // Assume you have a function to fetch page status
    const fetchPageStatus = () => {
      // Placeholder for demonstration, replace with actual logic
      return Math.random() < 0.5 ? 'success' : 'failure';
    };

    // Log the initial status when the component mounts
    const initialStatus = fetchPageStatus();
    logPageStatus(initialStatus);

    // Set up an interval to check and log the status periodically
    const intervalId = setInterval(() => {
      const newStatus = fetchPageStatus();
      logPageStatus(newStatus);
    }, 5000); // Change this interval according to your needs

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-blue-100 p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Page Status Log</h2>
        <button onClick={clearLog} className="flex items-center bg-gray-200 px-4 py-2 rounded-md">
          <span className="text-red-500">❌</span>
          <span className="ml-2">Clear</span>
        </button>
      </div>
      <ul className="space-y-4">
        {alarms.map((alarm) => (
          <li key={alarm.timestamp} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{alarm.timestamp}</span>
              <span className={`text-${alarm.status === 'success' ? 'green' : 'red'} font-medium`}>
                {alarm.status ? alarm.status.toUpperCase() : 'UNKNOWN'}
              </span>
            </div>
            <span className="text-gray-700">{alarm.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alarms;
