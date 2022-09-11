import JSONParse from './helpers/JSONParse';

const getMicroState = (appName) => {
  if (!appName) {
    appName = __APP_NAME__
  }

  const stateElement = document.querySelector(`#__REDEXT_MICRO_STATE__[data-name="${appName}"]`);

  if (!stateElement) {
    return {}
  }

  return JSONParse(stateElement.innerHTML);
};

export default getMicroState
