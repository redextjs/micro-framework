import React from 'react';
import { BrowserRouter, HashRouter, StaticRouter } from 'react-router-dom';

import getMicroState from '../getMicroState';

export const MicroRouter = ({ appName, children }) => {
  const microState = getMicroState(appName);

  const { isHash, activePath: basename = '/', staticPath } = microState;

  const routerProps = {
    basename
  };

  let Router;

  if (staticPath) {
    Router = StaticRouter;

    routerProps.location = {
      pathname: staticPath
    }
  } else {
    Router = isHash ? HashRouter : BrowserRouter;
  }

  return (
    <Router {...routerProps}>
      {children}
    </Router>
  )
}

export default MicroRouter
