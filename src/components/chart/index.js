import React, { useState, useCallback, useEffect } from 'react';
import { PieChart, Pie, Sector, Cell } from 'recharts';
import styles from './style.module.css';

// 참고 코드 : https://codesandbox.io/s/pie-chart-with-customized-label-forked-jhk4o?file=/src/App.tsx:101-105
// 참고 코드 : https://codesandbox.io/s/pie-chart-with-customized-active-shape-y93si?file=/src/App.tsx:86-107

const RADIAN = Math.PI / 180;

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    name,
    value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 11;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fontSize={14}
        fill="#333"
      >{`${name}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={12}
        textAnchor={textAnchor}
        fontSize={12}
        fill="#999"
      >
        {`(${value}/${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

// data: { name: '', value: 0 }
const Chart = ({ name = "", data = [], colors = [], size = [420, 240] }) => {
  const [width, height] = size;
  
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [data])

  return (
    <div className={styles.wrapper}>
      <span>{name}</span>
      <PieChart width={width} height={height}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx={width / 2}
          cy={height / 2}
          innerRadius={65}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
};

export default Chart;