import React from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import getMicroState from '../getMicroState';

const MicroRedirect = ({ appName }) => {
  const microState = getMicroState(appName);

  const location = useLocation();

  const { pathname } = location;

  const { isKeepQuery = true } = microState;
  let { redirectTo } = microState;

  console.info('microState', microState);
  console.info('pathname', pathname);

  if (redirectTo && pathname === '/') {
    if (isKeepQuery) {
      redirectTo += location.search
    }

    return (
      <Redirect
        to={redirectTo}
      />
    )
  }

  return ''
}

export default MicroRedirect