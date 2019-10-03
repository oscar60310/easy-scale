import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { TestComponent } from './test-component';
const AppComponent = () => {
  return (
    <div>
      React TS Pack Work!
      <TestComponent />
    </div>
  );
};
export default hot(AppComponent);
