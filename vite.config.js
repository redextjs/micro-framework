const { loadEnv } = require('vite');
const path = require('path');

module.exports = ({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd()));

  return {
    resolve: {
      alias: {
        'src': path.resolve(__dirname, './src')
      }
    },
    base: './',
    build: {
      minify: true,
      rollupOptions: {
        input: {
          index: './src',
          react: './src/react',
          // 'react/hooks': './src/react/hooks',
          'react/MicroComponent': './src/react/MicroComponent',
          // 'react/MicroRedirect': './src/react/MicroRedirect',
          // 'react/MicroRouter': './src/react/MicroRouter',
          // plugins: './src/plugins'
        },
        output: {
          format: 'cjs',
          exports: 'named',
          entryFileNames: (params) => {
            // console.log('params', params);
            const { facadeModuleId, name } = params;

            if (facadeModuleId) {
              const paths = facadeModuleId.match(/(.*)\/src\/(.*)\/(.*)\.(jsx|js)$/);

              if (paths) {
                const folder = paths[2];

                const name = paths[3] || 'index';

                return `${folder}/${name}.js`
              }
            }

            return 'index.js'
          },
          assetFileNames: 'assets/[name].[ext]'
        },
        preserveEntrySignatures: true,
        external: [
          'react',
          'react-dom',
          // 'react-router',
          'react-router-dom',
          '@redext/micro',
          'rxjs',
          // 'single-spa-react'
        ]
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        keepNames: true
      }
    },
    esbuild: {
      pure: ['console.log']
    },
    define: {
      'process.env': process.env
    }
  }
};
