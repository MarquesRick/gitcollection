import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Dashboard } from '../pages/Dashboard';
// import { Repo } from '../pages/Repo';

//Suspense e Lazy serve para carregar por demanda os componentes e não tudo de uma vez..

//Magic comments - comentários para identificar ou manipular o webpackage (chunk)
const Dashboard = lazy(
  () =>
    import(
      /* webpackPrefetch: true */
      /* webpackChunkName: "dashboard" */ '../pages/Dashboard'
    ),
);
const Repo = lazy(
  () =>
    import(
      /* webpackPrefetch: true */
      /* webpackChunkName: "repo" */ '../pages/Repo'
    ),
);

export const Routes: React.FC = () => {
  return (
    <Suspense fallback={'Loading...'}>
      <Switch>
        <Route component={Dashboard} path="/" exact />
        {/* para que o react entenda que será enviado apenas um parâmetro, é necessário colocar o '+' */}
        <Route component={Repo} path="/repositories/:repository+" />
      </Switch>
    </Suspense>
  );
};
