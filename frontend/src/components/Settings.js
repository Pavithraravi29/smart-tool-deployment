import React, { useState, useEffect } from 'react';

const DeviceSection = () => {
  const [isFetchingToken, setIsFetchingToken] = useState(false);
  const [token, setToken] = useState('');
  const [bendingMomentAlarm, setBendingMomentAlarm] = useState({
    enabled: true,
    value: 0,
  });
  const [torsionAlarm, setTorsionAlarm] = useState({
    enabled: true,
    value: 0,
  });
  const [panelInfo, setPanelInfo] = useState({
    id: 'UUID40404544-0040-3410-8044-87C04F504833TCC',
    nameMachine: '',
    location: '',
  });
  const [selectedMenu, setSelectedMenu] = useState('');

  useEffect(() => {
    // Fetch token from server only when "Device" is selected
    if (selectedMenu === 'Device') {
      setIsFetchingToken(true);
      fetch('/api/token')
        .then((response) => response.json())
        .then((data) => {
          setToken(data.token);
        })
        .catch((error) => {
          console.error('Error fetching token:', error);
        })
        .finally(() => {
          setIsFetchingToken(false);
        });
    }
  }, [selectedMenu]);

  return (
    <div>
      {/* Additional Navbar */}
      <nav className="bg-white-800 text-black p-4">
        <ul className="flex space-x-4">
          <li>
            <a href="#" onClick={() => setSelectedMenu('System')} className="hover:text-blue-500 hover:underline">
              System
            </a>
          </li>
          <li>
            <a href="#" onClick={() => setSelectedMenu('Device')} className="hover:text-blue-500 hover:underline">
              Device
            </a>
          </li>
          <li>
            <a href="#" onClick={() => setSelectedMenu('LicenseManager')} className="hover:text-blue-500 hover:underline">
              License Manager
            </a>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      {selectedMenu === 'Device' && (
        <section className="flex flex-col space-y-4 p-4">
          <div className="flex justify-between items-center">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md" onClick={() => setIsFetchingToken(true)}>
              Refresh Token
            </button>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={bendingMomentAlarm.enabled}
                onChange={() => setBendingMomentAlarm((prev) => ({ ...prev, enabled: !prev.enabled }))}
              />
              <span className="ml-2">
                Alarm when Bending moment exceeds{' '}
                <input
                  type="number"
                  value={bendingMomentAlarm.value}
                  onChange={(e) => setBendingMomentAlarm((prev) => ({ ...prev, value: e.target.value }))}
                  min={0}
                  max={100}
                />{'% '}
                <input
                  type="range"
                  value={bendingMomentAlarm.value}
                  onChange={(e) => setBendingMomentAlarm((prev) => ({ ...prev, value: e.target.value }))}
                  min={0}
                  max={100}
                />
                NM: 20000
              </span>
            </label>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={torsionAlarm.enabled}
                onChange={() => setTorsionAlarm((prev) => ({ ...prev, enabled: !prev.enabled }))}
              />
              <span className="ml-2">
                Alarm when torsion exceeds{' '}
                <input
                  type="number"
                  value={torsionAlarm.value}
                  onChange={(e) => setTorsionAlarm((prev) => ({ ...prev, value: e.target.value }))}
                  min={0}
                  max={100}
                />{'% '}
                <input
                  type="range"
                  value={torsionAlarm.value}
                  onChange={(e) => setTorsionAlarm((prev) => ({ ...prev, value: e.target.value }))}
                  min={0}
                  max={100}
                />
                NM: 5000
              </span>
            </label>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <form>
              <div className="mb-4">
                <h2 className='mb-3'>Panel Info</h2>
                <label>ID:</label>
                <input
                  type="text"
                  value={panelInfo.id}
                  onChange={(e) => setPanelInfo((prev) => ({ ...prev, id: e.target.value }))}
                  className="ml-2"
                />
              </div>
              <div className="mb-4">
                <label>Name/Machine:</label>
                <input
                  type="text"
                  value={panelInfo.nameMachine}
                  onChange={(e) => setPanelInfo((prev) => ({ ...prev, nameMachine: e.target.value }))}
                  className="ml-2"
                />
              </div>
              <div className="mb-4">
                <label>Location:</label>
                <input
                  type="text"
                  value={panelInfo.location}
                  onChange={(e) => setPanelInfo((prev) => ({ ...prev, location: e.target.value }))}
                  className="ml-2"
                />
              </div>
            </form>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className='mb-3'>Subscription token</h2>
            {isFetchingToken ? (
              <p>Attempting to get token from the server...</p>
            ) : token ? (
              {/* ... display QR code ... */}
            ) : (
              <p>No token available.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default DeviceSection;
