import React from 'react';
import { asyncHook } from '@libs/async-hook';
import { RecordData, getRecord } from '@libs/record';
import { Card, CardContent } from '@material-ui/core';
import Chart from 'chart.js';
export const History = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const data = asyncHook<RecordData[]>(async () => await getRecord());
  React.useEffect(() => {
    if (!canvasRef.current || !data || data instanceof Error) {
      return;
    }
    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    console.log('ddd');
    const chart = new Chart(context, {
      type: 'line',
      data: {
        datasets: [
          {
            data: data.map(x => ({ x: x.time, y: x.weight })),
            label: 'Weight'
          }
        ]
      },
      options: {
        scales: {
          xAxes: [{ type: 'time', time: { unit: 'day' } }]
        }
      }
    });
  }, [canvasRef.current, data]);
  return (
    <Card>
      <CardContent>
        <canvas width="100%" ref={canvasRef} />
      </CardContent>
    </Card>
  );
};
