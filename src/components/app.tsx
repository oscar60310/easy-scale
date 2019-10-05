import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { ConfigForm } from './config-form';
import { isSetup } from '@libs/config';
import { Measure } from './measure';

const AppComponent = () => {
  const [configureDone, setConfigureDone] = React.useState(isSetup());
  const update = () => {
    setConfigureDone(isSetup());
  };
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
      {configureDone ? <Measure /> : <ConfigForm update={update} />}
    </div>
  );
};
export default hot(AppComponent);
