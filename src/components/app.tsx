import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { PairDevice } from './pair-device';

const AppComponent = () => {
  return (
    <div>
      React TS Pack Work!
      <PairDevice />
    </div>
  );
};
export default hot(AppComponent);
