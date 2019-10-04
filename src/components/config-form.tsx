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
  Radio,
  makeStyles,
  TextField
} from '@material-ui/core';
import { allScale } from '@libs/scales';
import { setScaleType, setBodyData, getScale, loadConfig } from '@libs/config';

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: theme.spacing(3),
    width: '100%'
  }
}));

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
  const classes = useStyles();
  const [data, setData] = React.useState({
    gender: 'male',
    height: 160,
    age: 25
  });
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBodyData(data.gender, data.height, data.age);
    next();
  };
  return (
    <React.Fragment>
      <Typography variant="h5">Tell about you</Typography>
      <Typography variant="body1">
        We need some information to calculate body fat data.
      </Typography>
      <form onSubmit={submit}>
        <FormControl
          component="fieldset"
          className={classes.formControl}
          required
        >
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            aria-label="gender"
            name="gender"
            value={data.gender}
            onChange={e =>
              setData({
                ...data,
                gender: e.target.value
              })
            }
          >
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female"
            />
          </RadioGroup>
        </FormControl>
        <FormControl
          component="fieldset"
          className={classes.formControl}
          required
        >
          <FormLabel component="legend">Height (cm)</FormLabel>
          <TextField
            id="height"
            type="number"
            margin="normal"
            value={data.height}
            onChange={e =>
              setData({
                ...data,
                height: parseFloat(e.target.value)
              })
            }
            required
          />
        </FormControl>
        <FormControl
          component="fieldset"
          className={classes.formControl}
          required
        >
          <FormLabel component="legend">Age</FormLabel>
          <TextField
            id="age"
            type="number"
            margin="normal"
            value={data.age}
            onChange={e =>
              setData({
                ...data,
                age: parseFloat(e.target.value)
              })
            }
            required
          />
        </FormControl>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          style={{ width: '100%', marginTop: 10 }}
        >
          Submit
        </Button>
      </form>
    </React.Fragment>
  );
};
const SetScale = ({ next }) => {
  const [connecting, setConnecting] = React.useState(false);
  const [error, setError] = React.useState('');
  const connect = async () => {
    setConnecting(true);
    try {
      const scale = getScale();
      await scale.connect();
      await scale.config(loadConfig());
      next();
    } catch (e) {
      setError(e.message);
      setConnecting(false);
    }
  };
  return (
    <React.Fragment>
      <Typography variant="h5">Setting weight scale</Typography>
      <Typography variant="body1" style={{ marginBottom: 10 }}>
        Now we need to connect to your weight scale and send some configuration.
        You will see a pop out menu, please select the device and click match.
      </Typography>
      {error !== '' && (
        <Typography variant="body1" style={{ marginBottom: 10 }}>
          {error}
        </Typography>
      )}
      {connecting ? (
        <div>Connecting ...</div>
      ) : (
        <Button color="primary" variant="contained" onClick={connect}>
          Start
        </Button>
      )}
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
    <SetScale key="Set" next={next} />,
    <Done key="Done" />
  ];
  return (
    <Card style={{ width: 500, maxWidth: '80%' }}>
      <CardContent>{stepper[step]}</CardContent>
    </Card>
  );
};
