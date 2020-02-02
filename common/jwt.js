const jwt = require('jsonwebtoken');
const {secret} = require('../config/secret')

module.exports = {

    getToken: (data) => {
        const token = jwt.sign(data, secret)
        return token;
    },

    verifyToken: (req, res, next) => {
        const token = req.headers['x-token'];
        const url = req.url;
        if(url === '/login' || url === '/register' || url === '/') {
            console.log(req.url)
            next();
        } else {
            jwt.verify(token, secret, (err, decoded) => {
                if(!decoded) {
                    return res.status(401).json({
                        success: false,
                        error: 'invalid token'
                    })
                }
                next()
            })
        }
    },

    getUserFromToken: (token, cb) => {
        jwt.verify(token, secret, (err, user) => {
            if(err) throw err;
            if(!user) {
                cb(null)
                return
            }
            cb(user);
        })
    }

}