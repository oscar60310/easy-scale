import React from 'react';
import { getScale } from '@libs/config';
import { Device } from './device';
export const Measure = () => {
  const [scale] = React.useState(getScale());

  return (
    <div>
      <Device scale={scale} />
    </div>
  );
};