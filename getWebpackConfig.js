const fs = require('fs')
const path = require('path')

const webpack = require('webpack')
const ringUiConfig = require('@jetbrains/ring-ui/webpack.config')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const processPath = process.cwd()
const tsConfigExists = fs.existsSync(path.join(processPath, './tsconfig.json'))
const postcssConfigExists = fs.existsSync(path.join(processPath, './postcss.config.js'))
const babelConfigExists = fs.existsSync(path.join(processPath, './babel.config.js'))

/**
 * This function returns ready-to-use webpack configuration for creating frontend plugins for TeamCity
 * @param {Object} options - options for generating webpack.config.js
 * @param {boolean | undefined} options.useTypeScript - set to true if you want to write code in TypeScript
 * @param {string} options.srcPath - Path to the source directory. For example: path.join(__dirname, 'src')
 * @param {string} options.outputPath - Path to write the compiled files to disk. For example: path.resolve(__dirname, '../demoPlugin-server/src/main/resources/buildServerResources')
 * @param {string} options.entry - The point or points where to start the application bundling process. For example: './src/index.ts'.
 * @param {string | undefined} options.cssPrefix - This prefix will be added to the beginning of every css class to avoid conflicts with other plugins.
 * @returns {Function} webpack configuration
 */
module.exports = function getWebpackConfig(options) {
  const {useTypeScript, useFlow, srcPath, outputPath, entry} = options

  if (useFlow) {
    printWarning('Flow support is deprecated and will be removed soon. Use the TypeScript instead.')
  }

  let packageName
  if (options.cssPrefix == null || options.cssPrefix.length === 0) {
    let packageJSON
    try {
      const file = fs.readFileSync(path.join(processPath, './package.json'), {encoding: 'UTF-8'})
      packageJSON = JSON.parse(file)
    } catch (e) {
      printWarning(
        "The package.json file was not found. Please pass the 'cssPrefix' option to the getWebpackConfig() function.",
      )
    }
    if (packageJSON != null) {
      if (packageJSON.name != null) {
        packageName = packageJSON.name
      } else {
        printWarning(
          "The 'name' property in package.json was not found. " +
            "Please either specify it or pass the 'cssPrefix' option to the getWebpackConfig() function.",
        )
      }
    }
  }

  ringUiConfig.loaders.cssLoader.include = [...ringUiConfig.loaders.cssLoader.include, srcPath]
  ringUiConfig.loaders.cssLoader.use.forEach(item => {
    if (item.loader != null) {
      if (!postcssConfigExists && item.loader.includes('/postcss-loader')) {
        item.options = {
          ...item.options,
          postcssOptions: {
            config: path.join(__dirname, './postcss.config.js'),
          },
        }
      } else if (
        item.loader.includes('/css-loader') &&
        item.options != null &&
        item.options.modules != null
      ) {
        item.options.modules.localIdentName = `${options.cssPrefix != null ? `${options.cssPrefix}_` : ''}[local]_[hash:base64:4]`
        if (packageName != null) {
          item.options.modules.localIdentHashSalt = packageName
        }
      }
    }
  })

  const babelLoader = {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      babelrc: false,
      extends: babelConfigExists ? './babel.config.js' : path.join(__dirname, './babel.config.js'),
    },
  }
  Object.assign(ringUiConfig.loaders.babelLoader, babelLoader)

  return (env = {}) => ({
    mode: env.production ? 'production' : 'development',
    bail: !env.devserver,
    entry,
    output: {
      path: outputPath,
      filename: 'bundle.js',
    },
    resolve: useTypeScript
      ? {
          extensions: ['.ts', '.tsx', '.js', '.css'],
        }
      : undefined,
    module: {
      rules: [
        ...ringUiConfig.config.module.rules,
        {
          test: /.css$/,
          include: /node_modules\/@jetbrains\/(ring-ui-built|teamcity-ui)/,
          use: ['style-loader', 'css-loader'],
        },
        useTypeScript && {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: !tsConfigExists
                ? {
                    configFile: path.join(__dirname, './plugin.tsconfig.json'),
                  }
                : undefined,
            },
          ],
        },
        {
          test: /\.js$/,
          include: [srcPath],
          exclude: [/node_modules/],
          use: [babelLoader],
        },
        {
          test: /\.svg$/,
          include: [/node_modules\/@jetbrains\/(icons|logos)/, srcPath],
          use: [
            babelLoader,
            {
              loader: '@svgr/webpack',
              options: {
                babel: false,
                svgoConfig: {
                  plugins: [
                    {
                      name: 'preset-default',
                      params: {
                        overrides: {removeViewBox: false},
                      },
                    },
                    {name: 'prefixIds', params: {prefixClassNames: false}},
                  ],
                },
                template: ({imports, componentName, props, jsx}, {tpl}) =>
                  tpl`${imports}
export default React.memo(function ${componentName}(${props}) {
  return ${jsx}
})
`,
              },
            },
          ],
        },
      ].filter(Boolean),
    },
    devServer: {
      hot: true,
      port: env.port,
      host: env.host,
    },
    plugins: [
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      env.analyze &&
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: 'bundle-report.html',
          openAnalyzer: false,
        }),
    ].filter(Boolean),
  })
}

function printWarning(message) {
  console.warn(`\x1b[33m${message}\x1b[0m`)
}
