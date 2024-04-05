import React, { useEffect, isValidElement } from 'react';
import { registerMicroApp } from '@redext/micro';
import { ReplaySubject } from 'rxjs';

export const MicroComponent = (props) => {
  const {
    redirectTo,
    name,
    activePath = '',
    microId = 'micro-component',
    staticPath,
    Container,
    containerProps = {},
    microSubjectRef,
    formMethodsRef,
    props: microProps = {},
    ...registerProps
  } = props;

  if (microSubjectRef) {
    if (!microSubjectRef.current) {
      microSubjectRef.current = new ReplaySubject();
    }

    microProps.microSubject = microSubjectRef.current;
  }

  if (formMethodsRef) {
    microProps.formMethodsRef = formMethodsRef;
  }

  useEffect(() => {
    registerMicroApp({
      name,
      activePath,
      staticPath,
      redirectTo,
      container: `#${microId}`,
      isHash: true,
      isShadowRoot: false,
      props: microProps,
      ...registerProps
    })
  }, [redirectTo])

  const element = (
    <div id={microId} className="micro-component"/>
  )

  if (Container && isValidElement(Container)) {
    return (
      <Container
        {...containerProps}
      >
        {element}
      </Container>
    )
  }

  return element
}

export default MicroComponent
