import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';

const ScatterGraph = ({ selectedFile, isStreaming }) => {
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
  
  const batchSize = 100;
  const streamingIntervalRef = React.useRef(null);

  useEffect(() => {
    const processData = (fileContent) => {
      const rows = fileContent.split('\n');
      const receivedData = [];

      for (let i = 1; i < rows.length; i++) {
        const columns = rows[i].split(';');
        const bendingMomentX = parseFloat(columns[3]);
        const bendingMomentY = parseFloat(columns[4]);

        if (!isNaN(bendingMomentX) && !isNaN(bendingMomentY)) {
          receivedData.push({
            x: bendingMomentX,
            y: bendingMomentY,
          });
        }
      }

      const allValues = receivedData.reduce((acc, item) => {
        acc.push(Math.abs(item.x), Math.abs(item.y));
        return acc;
      }, []);

      const maxAbsoluteValue = Math.max(...allValues);

      setStepSizeX(maxAbsoluteValue);
      setStepSizeY(maxAbsoluteValue);

      setData({
        datasets: [
          {
            label: 'Bending Moment',
            data: receivedData,
          },
        ],
      });
    };

    const streamData = () => {
      if (!selectedFile) return;
    
      const reader = new FileReader();
    
      reader.onload = (event) => {
        const fileContent = event.target.result;
        const rows = fileContent.split('\n');
        const receivedData = [];
    
        let currentIndex = 1; // Start from the second row
        const totalPoints = rows.length - 1;
    
        streamingIntervalRef.current = setInterval(() => {
          const endIndex = Math.min(currentIndex + batchSize, totalPoints);
          const batchRows = rows.slice(currentIndex, endIndex);
    
          receivedData.length = 0; // Clear existing data before adding new batch
    
          batchRows.forEach((row) => {
            const columns = row.split(';');
            const bendingMomentX = parseFloat(columns[3]);
            const bendingMomentY = parseFloat(columns[4]);
    
            if (!isNaN(bendingMomentX) && !isNaN(bendingMomentY)) {
              receivedData.push({
                x: bendingMomentX,
                y: bendingMomentY,
              });
            }
          });
    
          // Update step sizes based on new data
          const allValues = receivedData.reduce((acc, item) => {
            acc.push(Math.abs(item.x), Math.abs(item.y));
            return acc;
          }, []);
    
          const maxAbsoluteValue = Math.max(...allValues);
    
          setStepSizeX(maxAbsoluteValue);
          setStepSizeY(maxAbsoluteValue);
    
          setData({
            datasets: [
              {
                label: 'Bending Moment',
                data: receivedData,
              },
            ],
          });
    
          currentIndex += batchSize;
    
          if (currentIndex >= totalPoints) {
            clearInterval(streamingIntervalRef.current);
            console.log('Streaming completed.');
    
            // After streaming is completed, plot all points
            const allPoints = rows.slice(1).map((row) => {
              const columns = row.split(';');
              const bendingMomentX = parseFloat(columns[3]);
              const bendingMomentY = parseFloat(columns[4]);
    
              if (!isNaN(bendingMomentX) && !isNaN(bendingMomentY)) {
                return {
                  x: bendingMomentX,
                  y: bendingMomentY,
                };
              }
              return null;
            }).filter(Boolean);
    
            // Update step sizes based on all data
            const allValuesAllPoints = allPoints.reduce((acc, item) => {
              acc.push(Math.abs(item.x), Math.abs(item.y));
              return acc;
            }, []);
    
            const maxAbsoluteValueAllPoints = Math.max(...allValuesAllPoints);
    
            setStepSizeX(maxAbsoluteValueAllPoints);
            setStepSizeY(maxAbsoluteValueAllPoints);
    
            setData({
              datasets: [
                {
                  label: 'Bending Moment',
                  data: allPoints,
                },
              ],
            });
          }
        }, 1000); // 1-second delay
      };
    
      reader.readAsText(selectedFile);
    };
    
    

    if (selectedFile && isStreaming) {
      // Clear existing streaming interval if any
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }

      // Start streaming
      streamData();
    } else {
      // If not streaming, process the file content once
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileContent = event.target.result;
        processData(fileContent);
      };

      reader.readAsText(selectedFile);
    }

    return () => {
      // Cleanup: Clear streaming interval on component unmount
      clearInterval(streamingIntervalRef.current);
    };
  }, [selectedFile, isStreaming]);

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
    <div className='mt-10' >
      <h2 style={{textAlign: 'center', marginBottom:'20px'}}>Spike Polar</h2>
      <div style={{ position: 'relative', width: '600px', height: '500px' }}>
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
                  stepSize: stepSizeX / 4,
                  maxTicksLimit: 5,
                  callback: function (value) {
                    return value.toFixed(2);
                  },
                },
                grid: {
                  display: true,
                },
                title: {
                  display: true,
                  text: '[NM]',
                },
                min: -stepSizeX,
                max: stepSizeX,
              },
              y: {
                type: 'linear',
                ticks: {
                  stepSize: stepSizeY / 4,
                  maxTicksLimit: 5,
                  callback: function (value) {
                    return value.toFixed(2);
                  },
                },
                grid: {
                  display: true,
                },
                min: -stepSizeY,
                max: stepSizeY,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ScatterGraph;
