const JSONParse = (opts, defaults) => {
  if (opts !== null && typeof opts === 'object') {
    return opts;
  }

  defaults = defaults || {};
  try {
    defaults = JSON.parse(opts);
  } catch (e) {
  }

  return defaults;
};

export default JSONParse
