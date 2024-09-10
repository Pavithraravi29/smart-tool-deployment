import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import axios from 'axios';

const ScatterGraph = () => {
  const batchSize = 400; // Number of points to display at a time
  const [data, setData] = useState({
    datasets: [
      {
        label: 'Bending Moment',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointStyle: 'circle',
      },
    ],
  });

  useEffect(() => {
    const ws = new WebSocket('ws://172.18.101.47:1234/ws_all_graph_data');
  
    ws.onopen = () => {
      console.log('WebSocket connected');
    };
  
    ws.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
  
        if (newData && Array.isArray(newData)) {
          const updatedData = newData.reduce((acc, curr) => {
            if (
              curr &&
              curr.bending_moment_x !== undefined &&
              curr.bending_moment_y !== undefined
            ) {
              acc.push({
                x: curr.bending_moment_x,
                y: curr.bending_moment_y,
              });
            }
            return acc;
          }, []);
  
          // Clear the previous data and plot the new response
          setData({
            datasets: [
              {
                label: 'Bending Moment',
                data: updatedData,
              },
            ],
          });
        }
      } catch (error) {
        console.error('Error parsing message data:', error);
      }
    };
  
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };
  
    return () => {
      ws.close();
    };
  }, []);
  
  
  
  
  // Custom Chart.js plugin to draw dashed lines
  const dashedLinePlugin = {
    id: 'dashedLinePlugin',
    beforeDraw: function (chart, args, options) {
      const { ctx, chartArea: { left, top, right, bottom } } = chart;
      ctx.save();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(left, bottom / 2);
      ctx.lineTo(right, bottom / 2);
      ctx.moveTo(right / 2, top);
      ctx.lineTo(right / 2, bottom);
      ctx.stroke();
      ctx.restore();
    },
  };

  return (
    <div className='mt-10'>
      <h2>Polar Plot</h2>
      <div style={{ position: 'relative', width: '60%', margin: 'auto' }}>
        <Scatter
          data={data}
          plugins={[dashedLinePlugin]} // Add the custom plugin
          options={{
            scales: {
              x: {
                type: 'linear',
                position: 'bottom',
                ticks: {
                  stepSize: 0.5,
                },
                grid: {
                  display: false, 
                },
              },
              y: {
                type: 'linear',
                ticks: {
                  stepSize: 0.5,
                },
                grid: {
                  display: false, 
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ScatterGraph;