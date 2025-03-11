import express from 'express';
import passport from 'passport';
import User from '../models/user.js';

const router = express.Router();

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
            return res.json(200).json(user);
        }
        else {
            // user not found
            return res.status(401).json({ msg: 'Invalid Login' });
        }     
    }
    catch (err) {
        // something went wrong
        console.log(err);
        return res.json(401).json(err);
    }
});

export default router;