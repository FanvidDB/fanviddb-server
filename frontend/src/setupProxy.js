const { createProxyMiddleware } = require('http-proxy-middleware');

const backendProxy = createProxyMiddleware({
	target: 'http://localhost:8000',
	changeOrigin: true,
	onError: function(err, req, res) {
		res.writeHead(500, {
			'Content-Type': 'application/json'
		});

		res.end(JSON.stringify({
			'error': 'Error connecting to proxy. Perhaps the backend server is not running. See https://docs.fanviddb.com/coding/backend.html for details.'
		}));
	},
});

module.exports = function(app) {
  app.use(['/docs', '/redoc', '/api', '/openapi.json'], backendProxy);
};
