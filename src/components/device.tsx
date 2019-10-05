import React from 'react';
import { Scale, Status } from '@libs/scales/scale';
import { behaviorSubjectHook } from '@libs/rx-hook';
import Button from '@material-ui/core/Button';
import { ResultDisplay } from './result-display';
import { Card, CardContent, Typography } from '@material-ui/core';
import { loadConfig } from '@libs/config';
export const Device = (props: { scale: Scale }) => {
  const status = behaviorSubjectHook<Status>(props.scale.status);
  const requestSearch = async () => {
    await props.scale.connect();
    await props.scale.config(loadConfig());
    await props.scale.startReceive();
  };
  let content = <div></div>;
  switch (status) {
    case Status.IDLE:
      content = (
        <React.Fragment>
          <Typography variant="h5">Connect to your weight scale.</Typography>
          <Typography variant="body1">
            We are ready to connect to your scale, after clicking PAIR button,
            please select your device at the pop out menu.
          </Typography>
          <Button
            style={{ width: '100%' }}
            color="primary"
            onClick={requestSearch}
          >
            Pair
          </Button>
        </React.Fragment>
      );
      break;
    case Status.CONNECTING:
      content = (
        <React.Fragment>
          <Typography variant="h5">Connect to your weight scale.</Typography>
          <Typography variant="body1">
            We are trying to connect your device, Please select your device at
            the pop out menu.
          </Typography>
        </React.Fragment>
      );
      break;
    case Status.CONNECTED:
      content = (
        <React.Fragment>
          <Typography variant="h5">Connected.</Typography>
          <Typography variant="body1">
            Nice! Now please stand on the scale.
          </Typography>
        </React.Fragment>
      );
      break;
    case Status.RECEIVING:
      content = (
        <React.Fragment>
          <Typography variant="h5">Receiving ...</Typography>
          <Typography variant="body1">
            Please hold on, we are receiving data.
          </Typography>
        </React.Fragment>
      );
      break;
    case Status.FINISH:
      if (!props.scale.result) {
        content = (
          <React.Fragment>
            <Typography variant="h5">Finish</Typography>
            <Typography variant="body1">
              Something error... We can not get any data.
            </Typography>
          </React.Fragment>
        );
        break;
      }
      const result = props.scale.result;
      content = (
        <React.Fragment>
          <Typography variant="h5">Finish</Typography>
          <Typography variant="body1">All Done! Here is the result:</Typography>
          <ResultDisplay data={result} />
        </React.Fragment>
      );
      break;
  }
  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary" variant="body2">
          New Record
        </Typography>
        {content}
      </CardContent>
    </Card>
  );
};
