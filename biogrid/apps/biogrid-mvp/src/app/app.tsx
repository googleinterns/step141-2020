import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { InputPage } from './pages/input-page';
import { SimulatePage } from './pages/simulate-page';

export const App = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact component={InputPage} />
          <Route path="/simulate" component={SimulatePage} />
        </Switch>
      </Router>
    </>
  );
};

export default App;
