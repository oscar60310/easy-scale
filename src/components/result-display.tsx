import React from 'react';
import { Result } from '@libs/scales/scale';
import 'src/styles/result-display.scss';

export const ResultDisplay = (props: { data: Result }) => {
  const { data } = props;

  return (
    <div className="result-display">
      <div className="measure-box">
        <div className="measure">
          <div>{data.weight || '-'}</div>
          <div>Weight (kg)</div>
        </div>
        <div className="measure">
          <div>{data.bodyFat || '-'}</div>
          <div>Body Fat </div>
        </div>
      </div>
    </div>
  );
};
