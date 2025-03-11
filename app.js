import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import passport from 'passport';

// model
import User from './models/user.js';

// controllers
import habitsController from './controllers/habits.js';
import usersController from './controllers/users.js';

// create new express application object
const app = express();

// app config
app.use(bodyParser.json());

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
    methods: 'GET,POST,PUT,DELETE,HEAD,OPTIONS'
}));

// passport config
app.use(passport.initialize());
passport.use(User.createStrategy());

// allow passport to read / write user data from / to json
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// map urls to controllers
app.use('/api/v1/habits', habitsController);
app.use('/api/v1/users', usersController);

// start express server
app.listen(3000, () => { console.log('API running on port 3000') });