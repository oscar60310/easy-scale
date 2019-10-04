import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { Device } from './device';
import { YunmaiISM2 } from '@libs/scales/yunmai-ism2';

const AppComponent = () => {
  const yun = new YunmaiISM2();
  return (
    <div>
      React TS Pack Work!
      <Device scale={yun} />
    </div>
  );
};
export default hot(AppComponent);
