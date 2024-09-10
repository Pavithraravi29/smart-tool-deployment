import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import axios from 'axios';

const ScatterGraph = ({ fetching }) => {
  const batchSize = 1000; // Number of points to display at a time
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
  const [stepSizeX, setStepSizeX] = useState(0.5);
  const [stepSizeY, setStepSizeY] = useState(0.5);

  useEffect(() => {
    
    let receivedData = [];
  
    let ws;
    if (fetching) {
      ws = new WebSocket('ws://172.18.101.47:1234/ws_all_graph_data');

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

  
    ws.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
  
        if (newData && Array.isArray(newData)) {
          receivedData = receivedData.concat(
            newData.filter(
              (item) =>
                item.bending_moment_x !== undefined &&
                item.bending_moment_y !== undefined
            )
          );

          if (receivedData.length >= batchSize) {
            // Plot data after reaching the batchSize
            const batchToPlot = receivedData.slice(0, batchSize);
            receivedData = receivedData.slice(batchSize);

            // Calculate the maximum absolute value from both x and y axes in the batch
            const allValues = batchToPlot.reduce((acc, item) => {
              acc.push(Math.abs(item.bending_moment_x), Math.abs(item.bending_moment_y));
              return acc;
            }, []);

            const maxAbsoluteValue = Math.max(...allValues);

            // Set limits for x and y axes with the maximum absolute value
            const xAxisLimit = maxAbsoluteValue;
            const yAxisLimit = maxAbsoluteValue;

            setData({
              datasets: [
                {
                  label: 'Bending Moment',
                  data: batchToPlot.map((item) => ({
                    x: item.bending_moment_x,
                    y: item.bending_moment_y,
                  })),
                },
              ],
            });

            // Set axis limits for the graph
            setStepSizeX(xAxisLimit);
            setStepSizeY(yAxisLimit);

          }
        }
      } catch (error) {
        console.error('Error parsing message data:', error);
      }
    };
  
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };
  }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [fetching]);

  // Custom Chart.js plugin to draw a single dashed line and fix axes at zero
  const dashedLinePlugin = {
    id: 'dashedLinePlugin',
    beforeDraw: function (chart, args, options) {
      const { ctx, chartArea: { left, top, right, bottom } } = chart;
      ctx.save();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();

      // Draw a single horizontal dashed line (adjust the position as needed)
      const yZero = chart.scales.y.getPixelForValue(0);
      ctx.moveTo(left, yZero);
      ctx.lineTo(right, yZero);
      ctx.stroke();

      // Ensure axes are fixed at zero
      const xZero = chart.scales.x.getPixelForValue(0);
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.moveTo(xZero, top);
      ctx.lineTo(xZero, bottom);
      ctx.stroke();

      ctx.restore();
    },
  };

  return (
    <div className='mt-10'>
      <h2>Spike Polar:</h2>
      <div style={{ position: 'relative', width: '600px', height: '900px' }}>
        <Scatter
          data={data}
          height={450} 
          width={600}
          plugins={[dashedLinePlugin]} // Add the custom plugin
          options={{
            scales: {
              x: {
                type: 'linear',
                position: 'bottom',
                ticks: {
                  stepSize: stepSizeX / 4, // Dividing the axis range by 4 (5 ticks including 0)
                  maxTicksLimit: 5, // Display exactly 5 ticks on the x-axis
                  callback: function (value) {
                    return value.toFixed(2); // Display precise values with 2 decimal places
                  },
                },
                grid: {
                  display: true, 
                },
                title: {
                  display: true,
                  text: '[NM]',
                },
                min: -stepSizeX, // Set negative limit for x-axis
                max: stepSizeX, // Set positive limit for x-axis
              },
              y: {
                type: 'linear',
                ticks: {
                  stepSize: stepSizeY / 4, // Dividing the axis range by 4 (5 ticks including 0)
                  maxTicksLimit: 5, // Display exactly 5 ticks on the y-axis
                  callback: function (value) {
                    return value.toFixed(2); // Display precise values with 2 decimal places
                  },
                },
                grid: {
                  display: true, 
                },
                min: -stepSizeY, // Set negative limit for y-axis
                max: stepSizeY, // Set positive limit for y-axis
              },
            },
            
          }}
        />
      </div>
    </div>
  );
};

export default ScatterGraph;
