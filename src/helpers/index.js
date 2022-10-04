export const getAppName = (rootId) => {
  return `@${rootId}`
}

export const getContainerElement = (container) => {
  return typeof container === 'string' ? document.querySelector(container) : container
};
