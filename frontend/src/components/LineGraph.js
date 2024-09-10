import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import axios from 'axios';

const ScatterGraph = () => {
  const bufferSize = 100;
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
    const interval = setInterval(() => {
      fetchData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://172.18.101.47:1234/all_graph_data');
      const graphData = response.data.slice(-bufferSize).map(item => ({
        x: item.bending_moment_x,
        y: item.bending_moment_y,
      }));

      if (graphData.length > 0) {
        // Duplicate the first point at the end to attempt closing the shape
        graphData.push(graphData[0]);
      }

      setData({
        datasets: [
          {
            label: 'Bending Moment',
            data: graphData,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  
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
    <div>
      <h2>Scatter Graph</h2>
      <div style={{ position: 'relative', width: '80%', margin: 'auto' }}>
        <Scatter
          data={data}
          plugins={[dashedLinePlugin]} // Add the custom plugin
          options={{
            scales: {
              x: {
                type: 'linear',
                position: 'bottom',
                ticks: {
                  stepSize: 1,
                },
                grid: {
                  display: false, 
                },
              },
              y: {
                type: 'linear',
                ticks: {
                  stepSize: 1,
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


