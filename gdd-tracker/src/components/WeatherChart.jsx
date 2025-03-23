import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const WeatherChart = ({ weatherData }) => {
  const chartData = {
    labels: weatherData?.time || [],

    datasets: [
      {
        label: 'Temperature Max',
        data: weatherData.daily.temperature_2m_max,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
      {
        label: 'Temperature Min',
        data: weatherData.daily.temperature_2m_min,
        borderColor: 'rgba(53, 162, 235, 1)',
        backgroundColor: 'rgba(53, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div>
      <h2>Weather Trends</h2>
      <Line data={chartData} />
    </div>
  );
};

export default WeatherChart;
