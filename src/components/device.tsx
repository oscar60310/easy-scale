import React from 'react';
import { Scale, Status } from '@libs/scales/scale';
import { behaviorSubjectHook } from '@libs/rx-hook';
export const Device = (props: { scale: Scale }) => {
  const status = behaviorSubjectHook<Status>(props.scale.status);
  const requestSearch = async () => {
    await props.scale.connect();
    await props.scale.startReceive();
  };
  let content = <div></div>;
  switch (status) {
    case Status.IDLE:
      content = (
        <div>
          <h2>Ready to pair device</h2>
          <button onClick={requestSearch}>Pair</button>
        </div>
      );
      break;
    case Status.CONNECTING:
      content = (
        <div>
          <h2>Connecting</h2>
          <div>Please select your device at popout menu.</div>
        </div>
      );
      break;
    case Status.CONNECTED:
      content = (
        <div>
          <h2>Connected</h2>
          <div>Please stand to the weight scale.</div>
        </div>
      );
      break;
    case Status.RECEIVING:
      content = (
        <div>
          <h2>Receiving</h2>
        </div>
      );
      break;
    case Status.FINISH:
      if (!props.scale.result) {
        content = (
          <div>
            <h2>Finish</h2>
            <div>But no data found...</div>
          </div>
        );
        break;
      }
      const result = props.scale.result;
      content = (
        <div>
          <h2>Finish</h2>
          <div>
            <div>{result.weight}</div>
          </div>
        </div>
      );
      break;
  }
  return <div>{content}</div>;
};
