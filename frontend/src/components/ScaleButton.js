// ChartComponent.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartWrapper = ({ id }) => <canvas id={id} width="1200px" height="250"></canvas>;

const ChartComponent = ({ sensorData, customTime }) => {
  const chartRefs = useRef({
    tensionChart: null,
    torsionChart: null,
    bendingMomentChart: null,
  });

  useEffect(() => {
    if (sensorData.length > 0) {
      const timeSeconds = customTime.map(time => time.toFixed(2));

      createOrUpdateChart('tensionChart', timeSeconds, sensorData.map(data => data.tension));
      createOrUpdateChart('torsionChart', timeSeconds, sensorData.map(data => data.torsion));
      createOrUpdateChart('bendingMomentChart', timeSeconds, sensorData.map(data => data.bending_moment_y));
    }
  }, [sensorData, customTime]);

  const createOrUpdateChart = (chartId, labels, data) => {
    const ctx = document.getElementById(chartId);
    if (!ctx) return;

    if (chartRefs.current[chartId]) {
      chartRefs.current[chartId].destroy();
      chartRefs.current[chartId] = null;
    }

    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
          fill: false,
          pointRadius: 0,
        }],
      },
      options: {
        // Customize chart options as needed
      },
    });

    chartRefs.current[chartId] = newChart;
  };

  return (
    <div>
      <ChartWrapper id="tensionChart" />
      <ChartWrapper id="torsionChart" />
      <ChartWrapper id="bendingMomentChart" />
    </div>
  );
};

export default ChartComponent;
