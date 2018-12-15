import React from 'react';
import {hot, setConfig} from 'react-hot-loader';
// import {hot} from 'react-hot-loader';

import {HashRouter, Switch, Route} from 'react-router-dom';

import App from './App';

import {
  INDEX,
  CV,
  COLLAGE,
  RECORDCOLLECTION,
  PROJECTS,
  SCREENSHOTS,
} from './routePaths';

setConfig({pureSFC: true});

const Routes = () => (
  <HashRouter>
    <Switch>
      <Route exact path={INDEX.path} render={() => <App path={INDEX.path} />} />
      <Route exact path={CV.path} render={() => <App path={CV.path} />} />
      <Route
        exact
        path={COLLAGE.path}
        render={() => <App path={COLLAGE.path} />}
      />
      <Route
        exact
        path={COLLAGE.path}
        render={() => <App path={COLLAGE.path} />}
      />
      <Route
        exact
        path={PROJECTS.path}
        render={() => <App path={PROJECTS.path} />}
      />
      <Route
        exact
        path={RECORDCOLLECTION.path}
        render={() => <App path={RECORDCOLLECTION.path} />}
      />
      <Route
        exact
        path={SCREENSHOTS.path}
        render={() => <App path={SCREENSHOTS.path} />}
      />
    </Switch>
  </HashRouter>
);

export default hot(module)(Routes);
