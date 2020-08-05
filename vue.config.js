module.exports = {
  publicPath: "./",
  lintOnSave: false,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/styles/_var.scss";'
      }
    }
  },
  transpileDependencies: ["ethereum-bloom-filters"],
  configureWebpack: {
    devtool: "source-map"
  },
  chainWebpack: option =>
    option.plugin("define").tap(options => {
      options[0]["process.env"].IS_LEGACY_BUILD = !process.env.VUE_CLI_MODERN_BUILD;

      return options;
    }),
  devServer: {
    proxy: {
      "/api": {
        target: "http://172.16.6.84:1317",
        pathRewrite: {
          "^/api": ""
        }
      },
      "/node": {
        target: "http://172.16.6.84:26657",
        pathRewrite: {
          "^/node": ""
        }
      }
    }
  }
};
