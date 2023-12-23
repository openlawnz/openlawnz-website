exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  if (page.path.match(/^\/search/)) {
    deletePage(page);
    createPage({
      ...page,
      context: {},
      defer: true, // This page will be built on-demand
    });
  }

  if (page.path.match(/^\/case/)) {
    page.matchPath = "/case/*";
    createPage(page);
  }
};

exports.onCreateWebpackConfig = helper => {
  const { stage, actions, getConfig } = helper;
  if (stage === "develop" || stage === 'build-javascript') {
    const config = getConfig();
    const miniCssExtractPlugin = config.plugins.find(
      plugin => plugin.constructor.name === "MiniCssExtractPlugin"
    );
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true;
    }
    actions.replaceWebpackConfig(config);
  }
};

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: '@babel/plugin-transform-react-jsx',
    options: {
      runtime: 'automatic',
    },
  });
};