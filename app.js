import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

// model
import User from './models/user.js';

// controllers
import habitsController from './controllers/habits.js';
import usersController from './controllers/users.js';

// create new express application object
const app = express();

// app config
app.use(bodyParser.json());
app.use(cookieParser());

// db connection
mongoose.connect(process.env.DB, {})
.then((res) => console.log('Connected to MongoDB'))
.catch((err) => console.log(`Connection Failure: ${err}`));

// swagger api doc config
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Habit Tracker API',
            version: '1.0.0'
        }
    },
    apis: ['./controllers/*.js']  // location of api methods to document
};

const __dirname = path.resolve();
const __swaggerDistPath = path.join(__dirname, "node_modules", "swagger-ui-dist");
const openapiSpecs = swaggerJSDoc(options);
app.use('/api-docs', express.static(__swaggerDistPath, { index: false }), swaggerUi.serve, swaggerUi.setup(openapiSpecs));

// cors config to allow angular client access to make API calls
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: 'GET,POST,PUT,DELETE,HEAD,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization'
}));

// passport config
app.use(passport.initialize());
passport.use(User.createStrategy());

// allow passport to read / write user data from / to json
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// JWT config
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.PASSPORT_SECRET
};

const strategy = new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
            // if user exists in jwt contents, return the user & no error
            return done(null, user);
        }
        else {
            // user not found from jwt
            return done(null, false);
        }
    }
    catch (err) {
        // error: return the error and an empty user
        return done(err, false);
    }
});

passport.use(strategy);

// map urls to controllers
app.use('/api/v1/habits', habitsController);
app.use('/api/v1/users', usersController);

// set static path to load angular client in public folder
app.use(express.static(`${__dirname}/public`));
app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

// start express server
app.listen(3000, () => { console.log('API running on port 3000') });