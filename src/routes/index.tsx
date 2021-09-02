import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { Repo } from '../pages/Repo';

export const Routes: React.FC = () => {
  return (
    <Switch>
      <Route component={Dashboard} path="/" exact />
      {/* para que o react entenda que será enviado apenas um parâmetro, é necessário colocar o '+' */}
      <Route component={Repo} path="/repositories/:repository+" />
    </Switch>
  );
};
