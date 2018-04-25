const { clearHash } = require('../services/cache');

module.exports = async (req,res,next) => {
// to run this middleware after the request handler we have
// to implement it in this way.
 await next();
 clearHash(req.user.id);
}