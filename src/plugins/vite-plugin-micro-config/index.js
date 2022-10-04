function detectScriptRel() {
  // @ts-ignore
  const relList = document.createElement('link').relList
  // @ts-ignore
  return relList && relList.supports && relList.supports('modulepreload') ? 'modulepreload' : 'preload'
}

function preload(
  baseModule = () => {
  },
  deps,
  importerUrl
) {
  // @ts-ignore
  if (!deps || deps.length === 0) {
    return baseModule()
  }

  const containerElement = document.querySelector(`div[data-name="@${rootId}"]`);

  const documentTarget = containerElement && containerElement.shadowRoot || document;

  const links = documentTarget.getElementsByTagName ? documentTarget.getElementsByTagName('link') : documentTarget.querySelectorAll('link');

  const documentHead = documentTarget.head || documentTarget;

  return Promise.all(
    deps.map((dep) => {
      // @ts-ignore
      dep = assetsURL(dep, importerUrl)
      // @ts-ignore
      if (dep in seen) return
      // @ts-ignore
      seen[dep] = true
      const isCss = dep.endsWith('.css')
      const cssSelector = isCss ? '[rel="stylesheet"]' : '';
      const isBaseRelative = !!importerUrl;

      if (isBaseRelative) {
        for (let i = links.length - 1; i >= 0; i--) {
          const link = links[i];

          if (link.href === dep && (!isCss || link.rel === 'stylesheet')) {
            return
          }
        }
      } else if (documentTarget.querySelector(`link[href="${dep}"]` + cssSelector)) {
        return
      }

      // @ts-ignore
      const link = document.createElement('link');
      // @ts-ignore
      link.rel = isCss ? 'stylesheet' : scriptRel;
      if (!isCss) {
        link.as = 'script'
        link.crossOrigin = ''
      }
      link.href = dep;
      // @ts-ignore
      documentHead.appendChild(link)
      if (isCss) {
        return new Promise((res, rej) => {
          link.addEventListener('load', res)
          link.addEventListener('error', () => rej(new Error(`Unable to preload CSS for ${dep}`)))
        })
      }
    })
  ).then(() => baseModule())
}

const preloadMethod = `__vitePreload`;
const preloadHelperId = '\0vite/preload-helper';

const viteMicroConfigPlugin = (options = {}) => {
  const { rootId } = options;

  let config;

  return {
    name: 'vite:micro-config',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    resolveId(id) {
      if (id === preloadHelperId) {
        return id
      }
    },
    load(id) {
      const { build = {} } = config;

      const { modulePreload } = build;

      const resolveModulePreloadDependencies = modulePreload && modulePreload?.resolveDependencies;
      const renderBuiltUrl = config.experimental?.renderBuiltUrl;
      const customModulePreloadPaths = !!(resolveModulePreloadDependencies || renderBuiltUrl);
      const isRelativeBase = config.base === './' || config.base === '';
      const optimizeModulePreloadRelativePaths = isRelativeBase && !customModulePreloadPaths;
      const scriptRel = modulePreload && modulePreload?.polyfill ? `'modulepreload'` : `(${detectScriptRel.toString()})()`;

      const assetsURL = customModulePreloadPaths ? `function(dep, importerUrl) { return dep.startsWith('.') ? new URL(dep, importerUrl).href : dep }` : optimizeModulePreloadRelativePaths
        ? `function(dep, importerUrl) { return new URL(dep, importerUrl).href }` : `function(dep) { return ${JSON.stringify(config.base)}+dep }`;

      const preloadCode = `const scriptRel = ${scriptRel}; const assetsURL = ${assetsURL}; const rootId = ${JSON.stringify(rootId)}; const seen = {}; export const ${preloadMethod} = ${preload.toString()}`;

      if (id === preloadHelperId) {
        return preloadCode
      }
    }
  }
}

export default viteMicroConfigPlugin
