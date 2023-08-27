
const { createProxyMiddleware } = require('http-proxy-middleware');
//http://api.theperfecttour.ch/api/TMT/uploadTMTFiles?userId=b5f588df-60ca-4a69-960f-e926dcdb8015
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://api.theperfecttour.ch',
      changeOrigin: true,
    })
  );
};