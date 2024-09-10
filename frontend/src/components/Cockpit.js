import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Doughnut } from 'react-chartjs-2';
import Graph from './Graph';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faStop, faPlay } from '@fortawesome/free-solid-svg-icons';

const Gauges = () => {
  const [bendingMoment, setBendingMoment] = useState(0);
  const [torsion, setTorsion] = useState(0);
  const [sensorData, setSensorData] = useState([
    { time_seconds: 0, tension: 0, torsion: 0, bending_moment_y: 0 },
  ]);
  const [isWebSocketRunning, setIsWebSocketRunning] = useState(true);
  const [selectedScaleOption, setSelectedScaleOption] = useState(null);
  const [isScaleOptionsVisible, setIsScaleOptionsVisible] = useState(false);
  const [isSpikeOptionsVisible, setIsSpikeOptionsVisible] = useState(false);


  const handleClearMax = () => {
    window.location.reload();
  };

  const toggleWebSocket = () => {
    setIsWebSocketRunning((prev) => !prev);
  };

  const handleNullify = () => {
    setBendingMoment(0);
    setTorsion(0);
  };

  const handleScaleOptionChange = (option) => {
    setSelectedScaleOption(option);
    setIsScaleOptionsVisible(false);
    // You can perform additional actions based on the selected scale option
  };

  const handleSpikeOptionClick = (option) => {
    // Perform actions based on the selected spike option (e.g., "Wakeup" or "Exit")
    if (option === "Wakeup") {
      // Implement the logic for wakeup
    } else if (option === "Exit") {
      // Implement the logic for exit
    }
  };


  useEffect(() => {
    let socket;

    if (isWebSocketRunning) {
      // Establish WebSocket connection only if it's running
      socket = new WebSocket('ws://172.18.101.47:1234/ws_cockpit');

      socket.onopen = () => {
        console.log('WebSocket connection established');
      };

      socket.onmessage = (event) => {
        try {
          const receivedData = JSON.parse(event.data);

          const bendingMoment = parseFloat(receivedData.BendingMoment);
          const torsion = parseFloat(receivedData.Torsion);

          if (!isNaN(bendingMoment) && !isNaN(torsion)) {
            console.log('Bending Moment:', bendingMoment);
            console.log('Torsion:', torsion);

            setBendingMoment(bendingMoment);
            setTorsion(torsion);
          } else {
            console.error('Invalid numeric data received:', receivedData);
          }
        } catch (error) {
          console.error('Error processing WebSocket data:', error);
        }
      };

      socket.onerror = (event) => {
        console.error('WebSocket error:', event);
      };

      socket.onclose = (event) => {
        if (event.wasClean) {
          console.log(`WebSocket connection closed cleanly, code: ${event.code}, reason: ${event.reason}`);
        } else {
          console.error('WebSocket connection abruptly closed');
        }
      };
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [isWebSocketRunning]);

  const getBendingMomentConfig = (value) => {
    const fillColors = value >= 0 ? ['#00FF00'] : ['#FF0000'];
    const gradientColors = value >= 0 ? ['#00FF00', '#00FF00'] : ['#FF0000', '#FF0000'];

    return {
      series: [Math.abs(value)],
      options: {
        chart: {
          height: 250,
          type: 'radialBar',
          offsetY: 0,
        },
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
              background: '#e0e0e0',
              strokeWidth: '97%',
              margin: 5,
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                offsetY: -2,
                fontSize: '22px',
              },
            },
          },
        },
        fill: {
          colors: fillColors,
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: gradientColors,
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        labels: [`${value.toFixed(2)}%`],
      },
    };
  };

  const getTorsionConfig = (value) => {
    const positiveValue = Math.max(0, value);
    const negativeValue = Math.max(0, -value);
    const total = positiveValue + negativeValue;

    const backgroundColors = value >= 0 ? ['#00FF00', 'transparent'] : ['transparent', '#FF0000'];
    const hoverBackgroundColors = value >= 0 ? ['#00FF00', 'transparent'] : ['transparent', '#FF0000'];

    return {
      datasets: [
        {
          data: [total / 2, total / 2],
          backgroundColor: backgroundColors,
          hoverBackgroundColor: hoverBackgroundColors,
          borderWidth: 0,
        },
      ],
      options: {
        cutout: '70%',
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };
  };

  return (
    <>
      <div
        className={`overlay ${isWebSocketRunning ? '' : 'show'}`}
        onClick={() => {
          // You can add any custom action on overlay click
          // For example, alert('The WebSocket is stopped. Click Start to resume.'); 
        }}
      ></div>

      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={handleClearMax}
          className={`mt-11 ml-40 border-2 border-slate-500 px-2 py-1 absolute top-4 left-50 z-10 bg-white text-base 
                    cursor-pointer rounded-lg hover:bg-gray-300`}
        >
          <span>
            <FontAwesomeIcon icon={faTrash} style={{ color: 'red' }} />
          </span>
          Clear Max
        </button>

        <button
          onClick={toggleWebSocket}
          className={`mt-11 ml-20 border-2 border-slate-500 px-2 py-1 absolute top-4 left-50 z-10 bg-white text-base 
                    cursor-pointer rounded-lg hover:bg-gray-300`}
        >
          <span>
            <FontAwesomeIcon icon={isWebSocketRunning ? faStop : faPlay} style={{ color: isWebSocketRunning ? 'red' : 'green' }} />
          </span>
          {isWebSocketRunning ? 'Stop' : 'Start'}
        </button>

        <button
          onClick={handleNullify}
          className={`mt-11 ml-40 border-2 border-slate-500 px-2 py-1 absolute top-4 left-40 z-10 bg-white text-base 
                    cursor-pointer rounded-lg hover:bg-gray-300`}
        >
          Null
        </button>


       
          {/* <button
            onClick={() => setIsScaleOptionsVisible(!isScaleOptionsVisible)}
            type="button"
            className={`mt-11 ml-40 border-2 border-slate-500 px-2 py-1 absolute top-4 right-20 z-10 bg-white text-base 
                        cursor-pointer rounded-lg hover:bg-gray-300`}
            id="scaleButton"
          >
            Scale
          </button>
          {isScaleOptionsVisible && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="scaleButton"
              tabIndex="-1">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <button onClick={() => handleScaleOptionChange('StandardScaling')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1" id="options-menu-0">
                  Standard Scaling
                </button>
               
                <button onClick={() => handleScaleOptionChange('10Sec')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1" id="options-menu-4">
                  10sec
                </button>
                <button onClick={() => handleScaleOptionChange('20Sec')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1" id="options-menu-5">
                  20sec
                </button>
                <button onClick={() => handleScaleOptionChange('1Min')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1" id="options-menu-6">
                   1min
                </button>
              </div>
            </div>
          )}
        
        <button
            onClick={() => setIsSpikeOptionsVisible(!isSpikeOptionsVisible)}
            type="button"
            className={`mt-11 ml-10 border-2 border-slate-500 px-2 py-1 absolute top-4 right-40 z-10 bg-white text-base 
                        cursor-pointer rounded-lg hover:bg-gray-300`}
            id="spikeButton"
          >
            Spike
          </button>
          {isSpikeOptionsVisible && (
            <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="spikeButton"
              tabIndex="-1">
              <button onClick={() => handleSpikeOptionClick('Wakeup')} className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1" id="options-menu-0">
                Wakeup
              </button>
              <button onClick={() => handleSpikeOptionClick('Exit')} className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1" id="options-menu-1">
                Exit
              </button>
              </div>
          )}
         */}

        <div className="bg-gray-200 rounded-lg p-6 flex flex-col items-center mt-14">
          <h2 className="text-lg font-bold mb-4">Bending Moment </h2>
          <div style={{ width: '300px', marginLeft: '10px' }}>
            <Chart
              options={getBendingMomentConfig(bendingMoment).options}
              series={getBendingMomentConfig(bendingMoment).series}
              type="radialBar"
              height={400}
            />
          </div>
          <p>{`${bendingMoment.toFixed(2)}%`}</p>
        </div>

        <div className="bg-gray-200 rounded-lg p-6 flex flex-col items-center mt-14">
          <h2 className="text-lg font-bold mb-4">Spike Polar</h2>
          <div style={{ width: '400px', marginLeft: '10px' }}>
            <Graph />
          </div>
        </div>

        <div className="bg-gray-200 rounded-lg p-6 flex flex-col items-center mt-14">
          <h2 className="text-lg font-bold mb-4">Torsion </h2>
          <div style={{ width: '300px', marginLeft: '10px' }}>
            <Doughnut
              data={getTorsionConfig(torsion)}
              options={getTorsionConfig(torsion).options}
              height={400}
            />
          </div>
          <p>{`${torsion.toFixed(2)}%`}</p>
        </div>
      </div>
    </>
  );
};

export default Gauges;