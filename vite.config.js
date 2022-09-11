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
          react: './src/react'
        },
        output: {
          format: 'cjs',
          entryFileNames: (params) => {
            // console.log('params', params);
            const { facadeModuleId, name } = params;

            if (facadeModuleId) {
              const paths = facadeModuleId.match(/(.*)\/src\/(.*)\/(.*)\.jsx$/);

              if (paths) {
                const folder = paths[2];

                return `${folder}/index.js`
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
          // 'single-spa-react'
        ]
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        keepNames: true
      }
    },
    define: {
      'process.env': process.env
    }
  }
};
