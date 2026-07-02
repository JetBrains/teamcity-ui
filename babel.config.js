const {browserslist} = require('./package.json')

module.exports = {
  // Hoisted so both preset-env and babel-plugin-polyfill-corejs3 pick it up.
  targets: browserslist,
  presets: [
    ['@babel/preset-env', {modules: false}],
    '@babel/preset-typescript',
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
  ],
  plugins: [
    // Babel 8 removed preset-env's useBuiltIns/corejs; this is the replacement.
    ['babel-plugin-polyfill-corejs3', {method: 'usage-global', version: '3.46'}],
    // moduleName keeps helpers on plain @babel/runtime; the polyfill plugin above otherwise
    // redirects them to the (unused) @babel/runtime-corejs3.
    ['@babel/plugin-transform-runtime', {moduleName: '@babel/runtime'}],
    '@babel/plugin-proposal-export-default-from',
  ],
  env: {
    test: {
      // Override targets for Node and add an auto-modules preset-env so Jest gets CommonJS.
      targets: {node: 'current'},
      presets: [['@babel/preset-env', {}]],
    },
  },
}
