import constants from '../utils/constants';

export const getRootId = () => {
  if (window.__ROOT_ID__) {
    return window.__ROOT_ID__
  }
  
  const orgName = process.env.VITE_ORG_NAME || 'redext-micro';
  const microName = process.env.VITE_MICRO_NAME || 'app';
  
  return `${orgName}/${microName}`
}

export const getAppName = (rootId) => {
  if (!rootId) {
    rootId = getRootId();
  }
  
  return `@${rootId}`
}

export const getContainerElement = (container) => {
  return typeof container === 'string' ? document.querySelector(container) : container
};

export const getDocumentTarget = (appName) => {
  const containerElement = document.querySelector(`[data-name="${appName}:container"]`);
  
  return containerElement && containerElement.shadowRoot || document;
};

export const getQueryFromUrl = (name, url) => {
  if (!url) {
    url = window.location.search
  }
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export const isMountApp = () => {
  return getQueryFromUrl('isMountApp') === 'true'
}

export const isMicro = (params = {}) => {
  const { rootId } = params;
  let { buildMode } = params;
  
  if (!buildMode) {
    buildMode = process.env.BUILD_MODE
  }
  const appName = getAppName(rootId);
  
  return buildMode === constants.BUILD_MODE.MICRO && getContainerElement(`[data-name="${appName}:container"]`)
}
