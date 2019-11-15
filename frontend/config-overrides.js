const { override, fixBabelImports } = require('customize-cra');

const config = override(
    fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
    }),
);

module.exports = Object.assign(config, {
    devServer: function(configFunction) {
        return function(proxy, allowedHost) {
          const config = configFunction(proxy, allowedHost);
          const backend_url = 'http://localhost:8080';
          const redirect_backend = ['/api/v1']
          var redirectProxy = redirect_backend.reduce((acc, redirect_backend) => {
            acc[redirect_backend] = backend_url;
            return acc;
          }, {});
          config.proxy = redirectProxy;
          return config;
        };
      }
});

  
