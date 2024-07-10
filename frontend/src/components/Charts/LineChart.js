// components/Charts/LineChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const LineChart = ({ data, xAxisDataKey, yAxisDataKey, title }) => {
  return (
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    >
      <Line
        type="monotone"
        dataKey={yAxisDataKey}
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
      <XAxis dataKey={xAxisDataKey} />
      <YAxis />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <Tooltip />
      {title && (
        <text x={250} y={20} fontSize={18} fontWeight={600} textAnchor="middle">
          {title}
        </text>
      )}
    </LineChart>
  );
};

export default LineChart;