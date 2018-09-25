import React from 'react';
import {hot} from 'react-hot-loader';

const App = () => (
  <div>
    <p />
    <div
      style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{display: 'flex'}}>
        <div style={{maxWidth: 800}}>
          <h1 className="">Yo, My react experiments</h1>
        </div>
      </div>
    </div>
  </div>
);

// Do not delete this line
export default hot(module)(App);
