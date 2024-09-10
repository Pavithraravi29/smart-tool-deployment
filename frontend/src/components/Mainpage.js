import React from 'react';
import imagepath from '../components/tool1.png';



function App() {
    const handleCancel = () => {
        // You can replace '/cancel-page' with the desired URL to navigate to
        window.location.href = '/cancel-page';
      };
    
      const handleConnect = () => {
        // Handle the connect action here
        window.location.href = '/spike_select';
      };
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="welcome-to-spike-connect text-center mt-8 mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to spike®_connect</h1>
          <p className="text-lg mb-2">
            With spike connect you can establish a connection to a spike
          </p>
          <p className="text-lg mb-4">
            Click on Search spike®_connect to start
            </p>
        </div>

        <img src={imagepath}className="mt-4" />

        <div className="absolute bottom-0 right-0 mb-4 mr-4">
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ml-4"
            onClick={handleConnect}
          >
            Connect to spike connect
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
