import React, { useState, useEffect } from 'react';

const TemperatureGauge = () => {
  const [temperature, setTemperature] = useState(0);

  useEffect(() => {
    const socket = new WebSocket('ws://172.18.101.47:5670');

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.temperature) {
          setTemperature(data.temperature);
          console.log(data.temperature);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="bg-gray-200 p-4 w-72 rounded-lg shadow-lg">
        <p className="text-center text-sm font-semibold mb-1">Temperature</p>
        <div className="flex justify-center font-bold">
          <svg
            width="48"
            height="72"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outline */}
            <path
              d="M8 16C7.44772 16 7 16.4477 7 17C7 17.5523 7.44772 18 8 18C8.55228 18 9 17.5523 9 17C9 16.4477 8.55228 16 8 16ZM8 16V12M8 17V18M20 5C20 6.10457 19.1046 7 18 7C16.8954 7 16 6.10457 16 5C16 3.89543 16.8954 3 18 3C19.1046 3 20 3.89543 20 5ZM12 17C12 19.2091 10.2091 21 8 21C5.79086 21 4 19.2091 4 17C4 15.9854 4.37764 15.0591 5 14.354V6C5 4.34315 6.34315 3 8 3C9.65685 3 11 4.34315 11 6V14.354C11.6224 15.0591 12 15.9854 12 17Z"
              stroke="#000000"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Temperature value */}
            <text x="12" y="30" textAnchor="middle" fontSize="7" fill="#000000" >
              {temperature}°C
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TemperatureGauge;