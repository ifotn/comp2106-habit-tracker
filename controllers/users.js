import express from 'express';
import passport from 'passport';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// private method to create jwt, called by login success
const generateToken = (user) => {
    // set up content to store user data in token
    const payload = {
        id: user._id,
        username: user.username
    };

    const jwtOptions = {
        expiresIn: '1hr'
    };

    // create token from above options
    return jwt.sign(payload, process.env.PASSPORT_SECRET, jwtOptions);
};

// store jwt in HttpOnly cookie so client app can access but not modify it
const setTokenCookie = (res, token) => {
    res.cookie('authToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });
};

// try to create new user account from username & password (passport hashes password)
router.post('/register', async (req, res) => {
    try {
        const user = new User({ username: req.body.username });
        await user.setPassword(req.body.password);
        await user.save();
        return res.status(201).json(user);
     }
    catch (err) {
         console.log(err);
         return res.status(400).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        // verify user credentials
        const { user } = await User.authenticate()(req.body.username, req.body.password);
        if (user) {
            // user found
            // create jwt containing user info
            const authToken = generateToken(user);
            
            // store jwt in http-only cookie
            setTokenCookie(res, authToken);

            // return success response
            return res.status(200).json({ token: authToken });
        }
        else {
            // user not found
            return res.status(401).json({ msg: 'Invalid Login' });
        }     
    }
    catch (err) {
        // something went wrong
        console.log(err);
        return res.status(401).json(err);
    }
});

export default router;