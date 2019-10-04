import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { YunmaiISM2 } from '@libs/scales/yunmai-ism2';
import { ConfigForm } from './config-form';

const AppComponent = () => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
      }}
    >
      <ConfigForm />
    </div>
  );
};
export default hot(AppComponent);
