import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryFull } from '@fortawesome/free-solid-svg-icons';

function RegisterData() {
  const [selectedSpike, setSelectedSpike] = useState({
    register: false,
    id: false,
    serial_number: false,
    channel: false,
    device_type: false,
    battery_percentage: false,
    active: false,
    accelerationSensorUsed: false,
  });
  const [registerData, setRegisterData] = useState(null);
  const [webSocketConnected, setWebSocketConnected] = useState(false);

  useEffect(() => {
    const registerWebSocket = new WebSocket('ws://172.18.101.47:5677');

    registerWebSocket.onopen = () => {
      console.log('WebSocket connected');
    };

    registerWebSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRegisterData(data);
    };

    return () => {
      registerWebSocket.close();
    };
  }, []);

  const handleCheckboxChange = (property) => {
    if (property === 'active') {
      setSelectedSpike((prevState) => {
        const newState = { ...prevState, active: !prevState.active };
        if (newState.active) {
          newState.register = true;
          newState.id = true;
          newState.serial_number = true;
          newState.channel = true;
          newState.device_type = true;
          newState.battery_percentage = true;
          newState.accelerationSensorUsed = true;
        } else {
          newState.register = false;
          newState.id = false;
          newState.serial_number = false;
          newState.channel = false;
          newState.device_type = false;
          newState.battery_percentage = false;
          newState.accelerationSensorUsed = false;
        }
        return newState;
      });
    } else {
      setSelectedSpike((prevState) => ({
        ...prevState,
        [property]: !prevState[property],
      }));
    }
  };

  return (
    <div className="container mx-auto flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-4">Select a spike</h1>
      <h2 className="text-lg text-gray-500 mb-4">With spike_netlist, you can see all spikes in the area. Select your spikes and click Next.</h2>
      {registerData ? (
        <div className="bg-gray-100 rounded-md shadow-md p-4 flex flex-col justify-between h-full">
          <div>
            <h1 className="text-2xl font-bold mb-4">Register Data</h1>
            <ul className="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap">
              <li className="mr-6 mb-2">
                <strong>Active:</strong>
                <input
                  type="checkbox"
                  checked={selectedSpike.active}
                  onChange={() => handleCheckboxChange('active')}
                />
              </li>
              <li className="mr-6 mb-2">
                <strong>Register:</strong> {registerData.register}
              </li>
              <li className="mr-6 mb-2">
                <strong>ID:</strong> {registerData.id}
              </li>
              <li className="mr-6 mb-2">
                <strong>Serial Number:</strong> {registerData.serial_number}
              </li>
              <li className="mr-6 mb-2">
                <strong>Channel:</strong> {registerData.channel}
              </li>
              <li className="mr-6 mb-2">
                <strong>Device Type:</strong> {registerData.device_type}
              </li>
              <li className="mr-6 mb-2">
                <strong>
                  Battery Percentage:{' '}
                  <FontAwesomeIcon icon={faBatteryFull} className="mr-1" />
                  {registerData.battery_percentage}%
                </strong>
              </li>
              <li className="mr-6 mb-2">
                <strong>Acceleration Sensor Used:</strong>
                <input
                  type="checkbox"
                  checked={selectedSpike.accelerationSensorUsed}
                  onChange={() => handleCheckboxChange('accelerationSensorUsed')}
                />
              </li>
            </ul>
          </div>
          
        </div>
      ) : (
        <p>Connecting...</p>
      )}
      
    
  
    <Link to="/MetaSetting-spike_measurement">
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-end"
      // disabled={!registerData}
    >
      Next
    </button>
  </Link>

  </div>
  );
}

export default RegisterData;
