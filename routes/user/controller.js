const User = require('../../models/user');
const {compareHash, genHash} = require('../../common/bcrypt');
const {getToken, getUserFromToken} = require('../../common/jwt');

module.exports = {


    login: async (req, res, next) => {
        const {email, password} = req.body;
        try {
            const user = await User.getByEmail(email)
            if(!user) {
                return res.status(404).json({
                    success: false,
                    error: 'Email address does not exist'
                })
            }
            const match = compareHash(password, user.password);
            if(!match) {
                return res.status(401).json({
                    success: false,
                    error: 'Incorrect password'
                })
            }
            const userDetails = {
                id: user._id,
                email: user.email,
                username: user.username,
                score: user.score
            }
            const token = getToken(userDetails);
            return res.status(200).json({
                success: true,
                token: token,
                user: userDetails
            })
        } catch (error) {
            throw error
        }
    },

    register: async (req, res, next) => {
        const {username, email, password} = req.body;
        try {
            if(await User.getByEmail(email)) {
                return res.status(400).json({
                    success: false,
                    error: 'Email address already exists'
                })
            }
            if(await User.getByUsername(username)) {
                return res.status(400).json({
                    success: false,
                    error: 'Username already exists'
                })
            }
            let newUser = new User({
                username: username,
                email: email,
                password: password
            });
            const hash = genHash(newUser.password);
            newUser.password = hash;
            const user = await newUser.save();
            return res.status(200).json({
                success: true,
                message: 'Registered successfully'
            })
        } catch (error) {
            throw error
        }
    },

    getMe: async (req, res, next) => {
        const token = req.headers['x-token'];
        getUserFromToken(token, async (userDetails) => {
            if(!userDetails) {
                return res.status(401).json({
                    success: false,
                    error: 'User not logged in'
                })
            }
            try {
                const user = await User.findById(userDetails.id);
                return res.status(200).json({
                    success: true,
                    user
                })
            } catch (error) {
                throw error
            }
        })
    },

    getLeaderBoard: async (req, res, next) => {
        try {
            const results = await User.find({})
                                .sort({score: 'desc'})
                                .limit(10)
                                .select('username score -_id')
            return res.status(200).json({
                success: true,
                results
            })
        } catch (error) {
            throw error
        }
    },

    updateScore: async (req, res, next) => {
        let score = parseInt(req.body.score);
        const token = req.headers['x-token'];
        getUserFromToken(token, async (user) => {
            const userId = user.id;
            try {
                const user = await User.findOneAndUpdate({
                    '_id': userId
                }, {
                    $max: {
                        'score': score
                    }
                }, {new: true})
                return res.status(200).json({
                    success: true,
                    message: `Score updated by ${score}`
                })
            } catch (error) {
                throw error
            }
        })
    }

}