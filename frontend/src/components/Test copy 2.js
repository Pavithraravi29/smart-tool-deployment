import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Tiles from '../components/Tiles';
import Navbar from './Navbar';

const WebSocketComponent = () => {
  const [sensorData, setSensorData] = useState([
    { time_seconds: 0, bending_moment_y: 0 },
    // Add more placeholder data if needed
  ]);
  const chartRef = useRef(null);
  const maxDataPoints = 400; // Maximum number of data points to display

  useEffect(() => {
    const socket = new WebSocket('ws://172.18.101.47:1234/ws_all_graph_data1');

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const newSensorData = JSON.parse(event.data);
      setSensorData((prevData) => {
        const updatedData = [...prevData, newSensorData];
        return updatedData.slice(-maxDataPoints); // Keep only the last maxDataPoints
      });
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (sensorData.length > 0) {
      const timeSeconds = sensorData.map((data) => data.time_seconds);

      if (chartRef.current) {
        const chart = chartRef.current;
        chart.data.labels = timeSeconds;
        chart.data.datasets[0].data = sensorData.map((data) => data.bending_moment_y);
        chart.update();
      } else {
        const bendingMomentCtx = document.getElementById('bendingMomentChart').getContext('2d');
        chartRef.current = new Chart(bendingMomentCtx, {
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
      <div className='flex flex-col align-bottom '>
        <div className=' '>
          <Tiles />
        </div>

        <div className='ml-2 w-3/4 '>
          {/* <ScatterGraph /> */}
        </div>
      </div>

      <div className='ml-2 flex flex-col '>
        <div className=''>
          <canvas id="bendingMomentChart" width="1200px" height="250"></canvas>
        </div>
      </div>
    </div>
  );
};

export default WebSocketComponent;
