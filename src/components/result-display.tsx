import React from 'react';
import { Result } from '@libs/scales/scale';
import 'src/styles/result-display.scss';
import { loadConfig } from '@libs/config';
import { addRecord } from '@libs/record';

export const ResultDisplay = (props: { data: Result }) => {
  const { data } = props;
  const config = loadConfig();
  React.useEffect(() => {
    addRecord(props.data);
  }, []);
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
        <div className="measure">
          <div>
            {data.weight
              ? (
                  data.weight /
                  (config.height / 100) /
                  (config.height / 100)
                ).toFixed(2)
              : '-'}
          </div>
          <div>BMI</div>
        </div>
      </div>
    </div>
  );
};
