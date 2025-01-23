const path = require("path");

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          stream: require.resolve("stream-browserify"),
          querystring: require.resolve("querystring-es3"),
          buffer: require.resolve("buffer/"),
        },
      },
    },
  },
};
