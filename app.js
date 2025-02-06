import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';

// controllers
import habitsController from './controllers/habits.js';
import swaggerJSDoc from 'swagger-jsdoc';

// create new express application object
const app = express();

// app config
app.use(bodyParser.json());

// db connection
mongoose.connect(process.env.DB, {})
.then((res) => console.log('Connected to MongoDB'))
.catch((err) => console.log(`Connection Failure: ${err}`));

// swagger
const docOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Habit Tracker API',
            version: '1.0.0'
        }
    },
    apis: ['./controllers/*.js']
    //apis: ['./public/swagger.yaml']
};
const __dirname = path.resolve();
const __swaggerDistPath = path.join(__dirname, "node_modules", "swagger-ui-dist");

//const swaggerJsDocs = YAML.load(path.resolve(__dirname, './public/swagger.yaml'));
//app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
const openApiSpecs = swaggerJSDoc(docOptions);

app.use('/api-docs', express.static(__swaggerDistPath, { index: false }), 
    swaggerUI.serve, swaggerUI.setup(openApiSpecs));

// map urls to controllers
app.use('/api/v1/habits', habitsController);

// start express server
app.listen(3000, () => { console.log('API running on port 3000') });