import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { InputPage } from './pages/input-page';
import { SimulatePage } from './pages/simulate-page';
import { InfoPage } from './pages/info-page';

export const App = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact component={InputPage} />
          <Route path="/simulate" component={SimulatePage} />
          <Route path="/info" component={InfoPage} />
        </Switch>
      </Router>
    </>
  );
};

export default App;
