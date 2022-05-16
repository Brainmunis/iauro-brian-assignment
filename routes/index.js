const API_PREFIX = "/admin/v1";
const {
	authorize,
	can
} = require('../middleware');

function get(router) {
  router.get("/ping", (req, res) => res.send("success"));
  router.get("/version", (req, res) => res.send("v1.0.0"));

  //Admin users routes
  require('./auths')(router, authorize, can, API_PREFIX);

  // products routes
  require('./products')(router, authorize, can, API_PREFIX);
  
  return router;
}

module.exports = {
  get,
};
