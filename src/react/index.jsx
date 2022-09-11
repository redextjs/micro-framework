import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact, { SingleSpaContext as MicroAppContext } from 'single-spa-react';

export const createMicroAppReact = (config = {}) => {
  const { rootId, styles, ...spaConfig } = config;

  const {
    renderType = 'render',
    domElementGetter = () => {
      return document.getElementById(rootId)
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

  const { bootstrap, mount, unmount } = singleSpaReact({
    React,
    ReactDOM,
    ...spaConfig,
    rootComponent,
    renderType,
    domElementGetter,
    errorBoundary
  });

  return { bootstrap, mount, unmount }
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
