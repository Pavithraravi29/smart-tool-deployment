import React, { useState, useEffect } from 'react';

const BatteryIcon = () => {
  const [batteryPercentage, setBatteryPercentage] = useState(0);

  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket('ws://172.18.101.47:5670');

    // Handle messages from the WebSocket
    ws.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        const newBatteryPercentage = data.battery_percentage;
        setBatteryPercentage(newBatteryPercentage);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    // Clean up the WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="flex justify-center items-center mt-3">
      <div className="bg-gray-200 p-4 w-72 h-28 rounded-lg shadow-lg">
        <p className="text-center text-sm font-semibold mb-1">Battery</p>
        <div className="flex justify-center">
          <svg width="50" height="30" viewBox="0 0 50 30" xmlns="http://www.w3.org/2000/svg">
            {/* Battery Body */}
            <rect x="5" y="5" width="40" height="20" rx="5" ry="5" fill="#000" />
            <rect x="45" y="10" width="5" height="10" rx="1" ry="1" fill="#000" />
            {/* Battery Level */}
            <rect
              x="7"
              y="7"
              width={(batteryPercentage * 36) / 100}
              height="16"
              rx="3"
              ry="3"
              fill="#4CAF50"
            />
            {/* Text */}
            <text x="25" y="20" textAnchor="middle" fill="#fff">
              {batteryPercentage}%
            </text>
          </svg>
        </div>
        {/* Display battery percentage */}
        <p className="text-center text-xs mt-1 font-semibold">{batteryPercentage}%</p>
      </div>
    </div>
  );
};

export default BatteryIcon;
