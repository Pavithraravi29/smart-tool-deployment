import React, { useState, useEffect } from 'react';

const SignalIcon = () => {
  const [signalStrength, setSignalStrength] = useState(0);

  useEffect(() => {
    const ws = new WebSocket('ws://172.18.101.47:5670');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      // Assuming the data received is a JSON string containing the 'RRSI' value
      const data = JSON.parse(event.data);
      const receivedRRSI = data.RSSI;

      // Update signal strength with the received RRSI value
      setSignalStrength(receivedRRSI);
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
    };

    // Cleanup function
    return () => {
      ws.close();
    };
  }, []);

  const renderSignal = (color, index) => (
    <rect
      key={index}
      x={index * 20}
      y={20 - (index + 1) * 5}
      width="15"
      height={(index + 1) * 5}
      fill={color}
    />
  );

  const getSignalColor = (index) => {
    if (signalStrength >= index) {
      return 'green'; // If signal strength is equal to or greater than index, show green
    }
    return 'red'; // Otherwise, show red
  };

  return (
    <div className="flex justify-center items-center mt-3">
      <div className="bg-gray-200 p-4 w-72 h-28 rounded-lg shadow-lg">
        <p className="text-center text-sm font-semibold mb-1">RRSI</p>
        <div className="flex justify-center">
          <svg width="80" height="20">
            {[...Array(4).keys()].map((index) =>
              renderSignal(getSignalColor(index), index)
            )}
          </svg>
        </div>
        <p className="text-center text-xs font-semibold mt-1">{signalStrength}</p>
      </div>
    </div>
  );
};

export default SignalIcon;
