import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/login';
import Register from './components/Register';
import Test from './components/Test';
import Navbar from './components/Navbar'; 
import ForceTrigger from './components/ForceTrigger'; 
import PlotPage from './components/PlotPage';
import Cockpit from './components/Cockpit';
import History from './components/History';
import Alarm from './components/Alarm';
import Settings from './components/Settings';
import MetaSettingsPage from './components/MetaSettingsPage';
import Spike_select from './components/Spike_select';
import Mainpage from './components/Mainpage';

const App = () => {
  const [showTestComponent, setShowTestComponent] = useState(false);

  return (
    <Router>
      <Navbar setShowTestComponent={setShowTestComponent} /> {/* Pass setShowTestComponent as prop */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Pass setShowTestComponent to the Test component */}
        {showTestComponent && <Route path="/Spike_measurements" element={<Mainpage setShowTestComponent={setShowTestComponent} />} />}
        <Route path="/force-trigger" element={<ForceTrigger />} />
        <Route path="/MetaSetting-spike_measurement" element={<MetaSettingsPage />} />
        <Route path="/spike_select" element={<Spike_select />} />
        <Route path="/plot" element={<PlotPage />} />
        <Route path="/Cockpit" element={<Cockpit />} />
        <Route path="/History" element={<History />} />
        <Route path="/Alarm" element={<Alarm />} />
        <Route path="/Settings" element={<Settings />} />

      </Routes>
    </Router>
  );
};

export default App;
