import React, { useEffect, isValidElement, useRef } from 'react';
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

  const containerRef = useRef();

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
    setTimeout(() => {
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
      });
    }, 0)
  }, [redirectTo])

  const element = (
    <div ref={containerRef} id={microId} className="micro-component"/>
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
