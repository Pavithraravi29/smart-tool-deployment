import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ScatterGraph from './ScatterGraph';
import Tiles from '../components/Tiles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';


const WebSocketComponent = () => {
  const [paused, setPaused] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [sensorData, setSensorData] = useState([
  { time_seconds: 0, tension: 0, torsion: 0, bending_moment_y: 0 },
  
]);

const [pausedInterval, setPausedInterval] = useState(null); // Store paused data temporarily

  const chartRefs = useRef({
    tensionChart: null,
    torsionChart: null,
    bendingMomentChart: null,
  });
  const maxDataPoints = 400; // Maximum number of data points to display

  const [isRecording, setIsRecording] = useState(false);
  const [recordedData, setRecordedData] = useState('');
  const [recordedLabel, setRecordedLabel] = useState('');

  const recordDataPoint = (newSensorData) => {
    const { tension, torsion, bending_moment_y, bending_moment_x, time_seconds, temperature } = newSensorData;
    const newDataPoint = `${tension};${torsion};${bending_moment_x};${bending_moment_y};${time_seconds};${temperature}\n`;
    setRecordedData((prevData) => prevData + newDataPoint);
  };

  const startRecording = () => {
    setIsRecording(true);
    const initialData = sensorData.map((data) => {
      const { tension, torsion, bending_moment_y, bending_moment_x, time_seconds, temperature } = data;
      return `${tension};${torsion};${bending_moment_x};${bending_moment_y};${time_seconds};${temperature}\n`;
    });
    setRecordedData(initialData.join('')); // Join the array to form a string
    setRecordedLabel('Tension;Torsion;Bending moment X;Bending moment Y;Time;Temperature\n');
  };
  

  const stopRecording = () => {
    setIsRecording(false);
    // Save recorded data as a text file
    const element = document.createElement('a');
    const file = new Blob([recordedLabel + recordedData], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'recorded_data.txt';
    document.body.appendChild(element);
    element.click();
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

 

    const stopFetching = () => {
      setFetching(false);
    };

    const startFetching = () => {
      setFetching(true);
    };


    const togglePause = () => {
      setPaused((prevPaused) => {
        if (!prevPaused) {
          const interval = setInterval(() => {
            setSensorData((prevData) => [
              ...prevData,
              {
                time_seconds: 0,
                tension: 0,
                torsion: 0,
                bending_moment_y: 0,
              },
            ]);
          }, 1000); // Add null values every second (adjust interval as needed)
          setPausedInterval(interval); // Store interval ID for clearing later
        } else {
          clearInterval(pausedInterval); // Clear the interval when resuming
        }
        return !prevPaused;
      });
    };


  useEffect(() => {
      if (fetching && !paused) {
        const socket = new WebSocket('ws://172.18.101.47:1234/ws_all_graph_data1');
    
        socket.onopen = () => {
          console.log('WebSocket connected');
        };
    
        socket.onmessage = (event) => {
          const newSensorData = JSON.parse(event.data);
          setSensorData((prevData) => {
            const updatedData = [...prevData, newSensorData];
            return updatedData.slice(-maxDataPoints);
          });
    
          if (isRecording) {
            recordDataPoint(newSensorData);
          }
      };
    
      return () => {
          socket.close();
      };
    }
  }, [fetching, isRecording, paused]);

  useEffect(() => {
    if (sensorData.length > 0) {
      const timeSeconds = sensorData.map((data) => data.time_seconds);

      // Tension Chart
      if (chartRefs.current.tensionChart) {
        const chart = chartRefs.current.tensionChart;
        chart.data.labels = timeSeconds;
        chart.data.datasets[0].data = sensorData.map((data) => data.tension);
        chart.update();
      } else {
        const tensionCtx = document.getElementById('tensionChart').getContext('2d');
        chartRefs.current.tensionChart = new Chart(tensionCtx, {
          type: 'line',
          data: {
            labels: timeSeconds,
            datasets: [{
              label: 'Tension',
              data: sensorData.map((data) => data.tension),
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 1,
              fill: false,
              pointRadius: 0,
            }],
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Tension vs Time (seconds)',
              },
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: false,
                  text: 'Time (seconds)',
                },
                ticks: {
                  display: true,
                },
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: 'Pull/Push[N]',
                },
                ticks: {
                  display: true,
                },
              },
            },
          },
          
        });
      }

      // Torsion Chart
      if (chartRefs.current.torsionChart) {
        const chart = chartRefs.current.torsionChart;
        chart.data.labels = timeSeconds;
        chart.data.datasets[0].data = sensorData.map((data) => data.torsion);
        chart.update();
      } else {
        const torsionCtx = document.getElementById('torsionChart').getContext('2d');
        chartRefs.current.torsionChart = new Chart(torsionCtx, {
          type: 'line',
          data: {
            labels: timeSeconds,
            datasets: [{
              label: 'Torsion',
              data: sensorData.map((data) => data.torsion),
              borderColor: 'rgb(192, 75, 192)',
              borderWidth: 1,
              fill: false,
              pointRadius: 0,
            }],
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Torsion vs Time (seconds)',
              },
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: false,
                  text: 'Time (seconds)',
                },
                ticks: {
                  display: true,
                },
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: 'Torsion[NM]',
                },
                ticks: {
                  display: true,
                },
              },
            },
          },
          
        });
      }

      // Bending Moment Chart
      if (chartRefs.current.bendingMomentChart) {
        const chart = chartRefs.current.bendingMomentChart;
        chart.data.labels = timeSeconds;
        chart.data.datasets[0].data = sensorData.map((data) => data.bending_moment_y);
        chart.update();
      } else {
        const bendingMomentCtx = document.getElementById('bendingMomentChart').getContext('2d');
        chartRefs.current.bendingMomentChart = new Chart(bendingMomentCtx, {
          type: 'line',
          data: {
            labels: timeSeconds,
            datasets: [{
              label: 'Bending Moment',
              data: sensorData.map((data) => data.bending_moment_y),
              borderColor: 'rgb(192, 192, 75)',
              borderWidth: 1,
              fill: false,
              pointRadius: 0,
            }],
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Bending Moment vs Time (seconds)',
              },
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: false,
                  text: 'Time (seconds)',
                },
                ticks: {
                  display: true,
                },
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: 'Bending Moment[NM]',
                },
                ticks: {
                  display: true,
                },
              },
            },
          },
          
        });
      }
    }
  }, [sensorData]);


  return (

    <div className='flex flex-row'>

      <button
        className={` mt-11 border-2 border-slate-500 px-2 py-1 absolute top-4 left-4 z-10 bg-white text-base 
                    cursor-pointer rounded-lg ${fetching ? 'bg-white' : 'bg-gray-200'} hover:bg-gray-300`}
        onClick={fetching ? stopFetching : startFetching}
      >
        <span className="mr-2">
        <FontAwesomeIcon icon={faPlay} style={{ color: '#32BBFF' }} />
        </span>
        Stop
      </button>

      <button
        onClick={toggleRecording}
        className={`mt-11 ml-4 border-2 border-slate-500 px-2 py-1 absolute top-4 left-20 z-10 bg-white text-base 
                    cursor-pointer rounded-lg ${isRecording ? 'bg-white' : 'bg-gray-200'} hover:bg-gray-300`}
      >
        {isRecording ? (
          <span>
            <FontAwesomeIcon icon={faVideo} style={{ color: 'red' }} /> Stop Recording
          </span>
        ) : (
          <span>
            <FontAwesomeIcon icon={faVideo} style={{ color: '#32BBFF' }} /> Start Recording
          </span>
        )}
      </button>

      {/* Button to pause/resume data */}
      <button
        onClick={togglePause}
        className={`mt-11 ml-36 border-2 border-slate-500 px-2 py-1 absolute top-4 left-28 z-10 bg-white text-base 
                    cursor-pointer rounded-lg hover:bg-gray-300`}
      >
          <span>
          <FontAwesomeIcon icon={faBullseye} style={{color: "#41b4fb",}}/>
          </span>
        {paused ? 'Null' : 'Null'}
       
      </button>

  
      <div className='flex flex-col align-bottom mt-8'>
        <div className=''>
          <Tiles />
        </div>
  
        <div className='ml-2 w-3/4'>
          <ScatterGraph fetching={fetching}/>
        </div>
      </div>
  
      <div className='ml-2 flex flex-col'>
        <div className=''>
          <div>
            <canvas id="tensionChart" width="1200px" height="250"></canvas>
          </div>
          <div>
            <canvas id="torsionChart" width="1200px" height="250"></canvas>
          </div>
          <div>
            <canvas id="bendingMomentChart" width="1200px" height="250"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default WebSocketComponent;
