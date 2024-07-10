// frontend/src/components/Chart.js
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function Chart({ data, title }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data) {
      setChartData(data);
    }
  }, [data]);

  return (
    <div className="chart-container">
      <h2>{title}</h2>
      <LineChart width={500} height={300} data={chartData}>
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Tooltip />
      </LineChart>
    </div>
  );
}

export default Chart;