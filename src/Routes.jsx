import React from 'react';

import {hot} from 'react-hot-loader';

import {HashRouter, Switch, Route} from 'react-router-dom';

import App from './App';

const Routes = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" render={() => <App path="/" />} />
      <Route exact path="/CV" render={() => <App path="/CV" />} />
      <Route exact path="/Collage" render={() => <App path="/Collage" />} />
      <Route
        exact
        path="/RecordCollection"
        render={() => <App path="/RecordCollection" />}
      />
      <Route exact path="/Bookmarks" render={() => <App path="/Bookmarks" />} />
      <Route exact path="/Projects" render={() => <App path="/Projects" />} />
    </Switch>
  </HashRouter>
);

export default hot(module)(Routes);
