import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact, { SingleSpaContext as MicroAppContext } from 'single-spa-react';
import getMicroState from '../getMicroState';
import { getAppName, getContainerElement } from '../helpers';

const getElementApp = (documentTarget, rootId) => {
  return documentTarget.getElementById ? documentTarget.getElementById(rootId) : documentTarget.querySelector(`[id="${rootId}"]`)
}

export const createMicroAppReact = (config = {}) => {
  const { rootId, styles, ...spaConfig } = config;

  const appName = getAppName(rootId);

  const microState = getMicroState(appName);

  const { isShadowRoot, container } = microState;

  const {
    renderType = 'render',
    domElementGetter = () => {
      if (isShadowRoot) {
        const containerElement = getContainerElement(container) || getContainerElement(`[data-name="${appName}:container"]`);

        if (containerElement && containerElement.shadowRoot) {
          const shadowRoot = containerElement.shadowRoot;

          return getElementApp(shadowRoot, rootId)
        }
      }

      return getElementApp(document, rootId)
    },
    errorBoundary = (err, info, props) => {
      console.error('createMicroApp err', err);
      console.info('createMicroApp info', info);
      console.log('createMicroApp props', props);

      return (
        <div>This renders when a catastrophic error occurs</div>
      );
    }
  } = spaConfig;

  let rootComponent = spaConfig.rootComponent;

  if (styles) {
    rootComponent = () => {
      return (
        <>
          <style type="text/css">{styles}</style>
          <spaConfig.rootComponent/>
        </>
      )
    }
  }

  const { bootstrap, mount, unmount, update } = singleSpaReact({
    React,
    ReactDOM,
    ...spaConfig,
    rootComponent,
    renderType,
    domElementGetter,
    errorBoundary
  });

  return { bootstrap, mount, unmount, update }
}

export const useMicroAppReact = () => {
  return useContext(MicroAppContext)
};

export const withMicroStyles = (styles) => {
  return Component => {
    class MicroComponent extends React.PureComponent {
      constructor(props) {
        super(props)
      }

      render() {
        return (
          <>
            <style type="text/css">{styles}</style>
            <Component {...this.props} />
          </>
        )
      }
    }

    return MicroComponent
  }
}

export {
  MicroAppContext
}
