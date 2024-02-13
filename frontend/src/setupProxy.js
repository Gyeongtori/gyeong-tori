const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/req", {
      target: "https://api.vworld.kr",
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware("/v1", {
      target: "https://i10c107.p.ssafy.io/api",
      changeOrigin: true,
    })
  );
};
