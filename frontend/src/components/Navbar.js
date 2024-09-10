import React, { useState } from 'react';
import { useLocation, Link} from 'react-router-dom';

const Navbar = ({ setShowTestComponent }) => {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/register']; // Routes where Navbar should not be shown
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);
  const handleSpikeMeasurementClick = () => {
    setShowTestComponent(true); // Set showTestComponent to true when "spike_measurement" is clicked
  };
  

  const [showSideNavbar, setShowSideNavbar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdown1, setShowDropdown1] = useState(false);

  const toggleSideNavbar = () => {
    setShowSideNavbar((prevState) => !prevState);
  };

  const closeSideNavbar = () => {
    setShowSideNavbar(false);
  };

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };

  const handleTriggerClick = (e) => {
    e.stopPropagation();
    toggleDropdown();
  };

  const toggleDropdown1 = () => {
    setShowDropdown1((prevState) => !prevState);
  };

  const spike_assistClick = (e) => {
    e.stopPropagation();
    toggleDropdown1();
  };

    // Function to extract nested paths from location pathname
    const getNestedPath = () => {
      const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
      return pathSegments.join(' / ');
    };


    return shouldShowNavbar ? (
      <div>
        {/* Side Navbar */}
        {showSideNavbar && (
          <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-4 z-50" onClick={closeSideNavbar}>
            <h2 className="text-lg font-bold mb-4 text-sky-400 cursor-pointer">Promicron <br></br>Tool control centre</h2>
            <ul className='cursor-pointer'>
            <li onClick={spike_assistClick}>
                spike_assist {showDropdown1 ? '-' : '+'}
                {showDropdown1 && (
                  <ul>
                    <li onClick={closeSideNavbar}>
                    <Link to="/Cockpit">Cockpit</Link> 
                    </li>
                    <li onClick={closeSideNavbar}>
                    <Link to="/History">History</Link> 
                    </li>
                    <li onClick={closeSideNavbar}>
                    <Link to="/Alarm">Alarm</Link> 
                    </li>
                    <li onClick={closeSideNavbar}>
                    <Link to="/Settings">Settings</Link> 
                    </li>
                  </ul>
                )}
              </li>
              <li onClick={handleSpikeMeasurementClick}>
                <Link to="/Spike_measurements">spike_measurement</Link> {/* Use Link to navigate to Test component */}
              </li>
              <li onClick={handleTriggerClick}>
                spike_trigger {showDropdown ? '-' : '+'}
                {showDropdown && (
                  <ul>
                    <li onClick={closeSideNavbar}>
                    <Link to="/force-trigger">Force_trigger</Link> 
                    </li>
                    <li onClick={closeSideNavbar}>
                    <Link to="/MetaSetting">MetaSetting</Link> 
                    </li>
                    <li onClick={closeSideNavbar}>
                    <Link to="/spike_select">spike_select</Link> 
                    </li>
                  </ul>
                )}
              </li>
             
            </ul>
          </div>
        )}

      {/* Navbar */}
      <nav className="bg-gray-800 p-4 flex justify-between items-center text-white">
        <div className="flex items-center">
          <div className="mr-6">
            {/* Left-aligned element 1 */}
            <a href="#" className="hover:text-gray-300" onClick={toggleSideNavbar}>
              Tool Control Center
            </a>
          </div>
          <div>
            {/* Display current path */}
            <p>{getNestedPath()}</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="mr-6">
            {/* Right-aligned element 1 */}
            <a href="#" className="hover:text-gray-300">SPIKE 1.2 (1 0*1115)</a>
          </div>
          <div>
            {/* Right-aligned element 2 */}
            <a href="#" className="hover:text-gray-300">READ 1.2</a>
          </div>
        </div>
      </nav>
    </div>
 ) : null;
};

export default Navbar;
