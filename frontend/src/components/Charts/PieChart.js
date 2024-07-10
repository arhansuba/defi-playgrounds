// components/Charts/PieChart.js
import React from 'eact';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'echarts';

const PieChart = ({ data, title }) => {
  return (
    <ResponsiveContainer width={500} height={300}>
      <PieChart>
        <Pie
          data={data}
          cx={200}
          cy={200}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        {title && (
          <text x={250} y={20} fontSize={18} fontWeight={600} textAnchor="middle">
            {title}
          </text>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;