const express = require('express');
const router = express.Router();
const { login, register, getMe, getLeaderBoard, updateScore } = require('./controller');

module.exports = function(app) {
    
    router.get('/', (req, res, next) => {
        res.send('User API');
    })

    router.post('/login', login);
    router.post('/register', register);
    router.get('/getme', getMe);
    router.get('/leaderboard', getLeaderBoard);
    router.post('/updatescore', updateScore);

    return router;

}