import React from 'react';
import { getScale } from '@libs/config';
import { Device } from './device';
import { History } from './history';
export const Measure = () => {
  const [scale] = React.useState(getScale());

  return (
    <div style={{ width: 500, maxWidth: '100%' }}>
      <Device scale={scale} />
      <History />
    </div>
  );
};
