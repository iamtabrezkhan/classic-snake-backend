const logger = require('../common/logger');
const {verifyToken} = require('../common/jwt')
const userRoute = require('../routes/user');

module.exports = function(app) {
    logger.msg('loading routes...');
    app.use('/api/v1/user', verifyToken, userRoute(app));
}