import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import axios from 'axios';

const Graph = ({ paused, fetching }) => {
  const batchSize = 5000; // Number of points to display at a time
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
  // const [stepSizeX, setStepSizeX] = useState(50);
  // const [stepSizeY, setStepSizeY] = useState(50);

  useEffect(() => {
    const ws = new WebSocket('ws://172.18.101.47:1234/ws_all_graph_data');
  
    let receivedData = [];
  
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

          // // Calculate dynamic step sizes based on data range
          // const xValues = receivedData.map((item) => item.bending_moment_x);
          // const yValues = receivedData.map((item) => item.bending_moment_y);

          // const maxX = Math.max(...xValues);
          // const minX = Math.min(...xValues);
          // const maxY = Math.max(...yValues);
          // const minY = Math.min(...yValues);

          // const dynamicStepX = (maxX - minX) / 10; // Adjust the divisor for desired precision
          // const dynamicStepY = (maxY - minY) / 10; // Adjust the divisor for desired precision

          // setStepSizeX(dynamicStepX);
          // setStepSizeY(dynamicStepY);
  
          if (receivedData.length >= batchSize) {
            // Plot data after reaching the batchSize
            const batchToPlot = receivedData.slice(0, batchSize);
            receivedData = receivedData.slice(batchSize);
  
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
  
            // Add a delay of 1 second (1000 milliseconds) before plotting the next graph
            setTimeout(() => {
              ws.send('next');
            }, 1000);
          }
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
  },[paused, fetching]);
  
  
// Custom Chart.js plugin to draw a single dashed line and fix axes at zero
const dashedLinePlugin = {
  id: 'dashedLinePlugin',
  beforeDraw: function (chart, args, options) {
    const { ctx, chartArea: { left, top, right, bottom }, scales } = chart;
    const maxScaleValue = scales.y.max; // Assuming y-axis is used for percentage
    
    // Draw a circle at 80% of the maximum scale value
    const circleRadius = 1.2 * maxScaleValue;
    const xZero = chart.scales.x.getPixelForValue(0);
    const yZero = chart.scales.y.getPixelForValue(0);


    

  

    ctx.save();
    ctx.strokeStyle = 'red'; // Adjust color as needed
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(xZero, yZero, circleRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();

    // Draw the dashed lines
    ctx.save();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();

    // Draw a single horizontal dashed line (adjust the position as needed)
    const yZeroPosition = chart.scales.y.getPixelForValue(0);
    ctx.moveTo(left, yZeroPosition);
    ctx.lineTo(right, yZeroPosition);
    ctx.stroke();

    // Ensure axes are fixed at zero
    const xZeroPosition = chart.scales.x.getPixelForValue(0);
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.moveTo(xZeroPosition, top);
    ctx.lineTo(xZeroPosition, bottom);
    ctx.stroke();

    ctx.restore();
  },
};

  return (
    <div className='mt-1'>
      
      <h2>graph:</h2>
      <div>
        <Scatter
        width={150}
        height={150}
          data={data}
          plugins={[dashedLinePlugin]} // Add the custom plugin
          options={{
            scales: {
              x: {
                type: 'linear',
                position: 'bottom',
                ticks: {
                  stepSize: 50,
                  // callback: function (value) {
                  //   return value.toFixed(2); // Display precise values with 2 decimal places
                  // },
                },
                grid: {
                  display: true, 
                },
                title: {
                  display: true,
                  text: '[NM]',
                },
                min: -100, // Set a fixed minimum value for the x-axis
                max: 100,
              },
              y: {
                type: 'linear',
                ticks: {
                  stepSize: 50,
                  // callback: function (value) {
                  //   return value.toFixed(2); // Display precise values with 2 decimal places
                  // },
                },
                grid: {
                  display: true, 
                },
                min: -100, // Set a fixed minimum value for the x-axis
                max: 100,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Graph;