import express from 'express';
import bodyParser from 'body-parser';

// controllers
import habitsController from './controllers/habits.js';

// create new express application object
const app = express();

// app config
app.use(bodyParser.json());

// map urls to controllers
app.use('/api/v1/habits', habitsController);

// start express server
app.listen(3000, () => { console.log('API running on port 3000') });