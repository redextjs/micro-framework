import React, { useEffect, useState } from 'react';

export const MicroPortal = ({ children, microSubject }) => {
  const [state, setState] = useState({});

  useEffect(() => {
    let subscription;
    if (microSubject) {
      subscription = microSubject.subscribe((data = {}) => {
          setState((prevState) => ({
            ...prevState,
            ...data
          }));
        }
      )
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [microSubject])

  if (typeof children === 'function') {
    return children({ microState: state })
  }

  return children
}

export default MicroPortal
