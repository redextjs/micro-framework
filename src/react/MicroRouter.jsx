import React from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';

import getMicroState from '../getMicroState';

export const MicroRouter = ({ appName, children }) => {
  const microState = getMicroState(appName);

  const { isHash, activePath: basename = '/' } = microState;

  const Router = isHash ? HashRouter : BrowserRouter;

  return (
    <Router basename={basename}>
      {children}
    </Router>
  )
}

export default MicroRouter
