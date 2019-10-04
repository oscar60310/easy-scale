import React from 'react';
import { Scale, Status } from '@libs/scales/scale';
import { behaviorSubjectHook } from '@libs/rx-hook';

export const Device = (props: { scale: Scale }) => {
  const status = behaviorSubjectHook<Status>(props.scale.status);
  const requestSearch = async () => {
    if (status === Status.FINISH || status === Status.IDLE) {
      await props.scale.connect();
      await props.scale.startReceive();
    }
  };
  return (
    <div>
      {status}
      {status === Status.FINISH && (
        <h3>{props.scale.result && props.scale.result.weight}</h3>
      )}
      <button onClick={requestSearch}>Search</button>
    </div>
  );
};
