import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

// controllers
import habitsController from './controllers/habits.js';

// create new express application object
const app = express();

// app config
app.use(bodyParser.json());

// db connection
mongoose.connect(process.env.DB, {})
.then((res) => console.log('Connected to MongoDB'))
.catch((err) => console.log(`Connection Failure: ${err}`));

// map urls to controllers
app.use('/api/v1/habits', habitsController);

// start express server
app.listen(3000, () => { console.log('API running on port 3000') });