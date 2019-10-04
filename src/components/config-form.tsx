/* eslint-disable react/prop-types */
import React from 'react';
import {
  CardContent,
  Card,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@material-ui/core';
import { allScale } from '@libs/scales';
import { setScaleType } from '@libs/config';

const Welcome = ({ next }) => {
  const choose = (n: string) => {
    setScaleType(n);
    next();
  };
  const list = allScale.map(x => (
    <ListItem button key={x.scaleName} onClick={() => choose(x.scaleName)}>
      <ListItemText primary={x.scaleName} />
    </ListItem>
  ));
  return (
    <React.Fragment>
      <Typography variant="h5">Welcome</Typography>
      <Typography variant="body1">
        Welcome to Easy Scale, this application can connect to your bluetooth
        weight scale and get data. You don&apos;t need to install anything, and
        all data store just in your browser.
      </Typography>
      <Typography variant="body1" style={{ marginTop: 10 }}>
        First, pick your device below:
      </Typography>
      <Typography variant="body1" component="span">
        <List component="nav" aria-label="secondary mailbox folders">
          {list}
        </List>
      </Typography>
      <Button>Not found your device?</Button>
    </React.Fragment>
  );
};
const BodyInformation = ({ next }) => {
  return (
    <React.Fragment>
      <Typography variant="h5">Tell about you</Typography>
      <Typography variant="body1">
        We need some information to calculate body fat data.
      </Typography>
      <FormControl component="fieldset">
        <FormLabel component="legend">Gender</FormLabel>
        <RadioGroup aria-label="gender" name="gender">
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
        </RadioGroup>
      </FormControl>
    </React.Fragment>
  );
};
const Done = () => {
  return <div>DONE</div>;
};
export const ConfigForm = () => {
  const [step, setStep] = React.useState(0);
  const next = () => setStep(step + 1);
  const stepper = [
    <Welcome key="Welcome" next={next} />,
    <BodyInformation key="Body" next={next} />,
    <Done key="Done" />
  ];
  return (
    <Card style={{ width: 500, maxWidth: '80%' }}>
      <CardContent>{stepper[step]}</CardContent>
    </Card>
  );
};
