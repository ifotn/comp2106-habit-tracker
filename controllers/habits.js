import express from 'express';

// model ref
import Habit from '../models/habit.js';

import query from 'qs';
import jwt from 'jsonwebtoken';

// create express router object to handle http request / response calls
const router = express.Router();

/**
 * @swagger
 * /api/v1/habits:
 *   get:
 *     summary: Find all habits
 *     tags:
 *       - Habit
 *     responses:
 *       200:
 *         description: Returns all habits
 */
router.get('/', async (req, res) => {
    let habits = [];

    if (req.query.keyword) {
        let keyword = req.query.keyword;
        habits = await Habit.find({ $text: { $search: keyword }});
    }
    else {
        // use model to fetch all habit documents from mongodb
        habits = await Habit.find();
    }

    return res.status(200).json(habits);
});

/**
 * @swagger
 * /api/v1/habits/{id}:
 *   get:
 *     summary: Find selected habit by id
 *     tags:
 *       - Habit
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *           required: true
 *     responses:
 *       200:
 *         description: Returns single habit
 *       404:
 *         description: Not found
 */
router.get('/:id', async (req, res) => {
    let habit = await Habit.findById(req.params.id);

    if (!habit) {
        return res.status(404).json({ err: 'Not Found' });
    }

    return res.status(200).json(habit);
});

/**
 * @swagger
 * /api/v1/habits:
 *   post:
 *     summary: Create new habit from request body
 *     tags:
 *       - Habit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 required: true
 *               category:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Resource created
 *       400:
 *         description: Bad Request
 */
router.post('/', async (req, res) => {
    try {
        // auth check w/jwt
        const token = req.cookies.authToken;
        
        if (token) {
            // verify jwt
            const decode = jwt.verify(token, process.env.PASSPORT_SECRET);

            if (decode) {
                // valid jwt, add new doc
                await Habit.create(req.body);
                return res.status(201).json(); // 201: Resource Created
            }
        }
        // no token or invalid jwt in token
        return res.status(401).json({ err: 'Unauthorized' });       
    }
    catch (err) {
        return res.status(400).json({ err: `Bad Request: ${err}` });
    }
});

/**
 * @swagger
 * /api/v1/habits/{id}:
 *   put:
 *     summary: Update selected habit from request body
 *     tags:
 *       - Habit
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string,
 *                 required: true
 *               name:
 *                 type: string
 *                 required: true
 *               category:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *     responses:
 *       204:
 *         description: No content
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 */
router.put('/:id', async (req, res) => {
    try {
        // auth check w/jwt
        const token = req.cookies.authToken;
        
        if (token) {
            // verify jwt
            const decode = jwt.verify(token, process.env.PASSPORT_SECRET);

            if (decode) {
                let habit = await Habit.findById(req.params.id);

                // _id not found
                if (!habit) {
                    return res.status(404).json({ err: 'Not Found' });
                }

                // check _id values match
                if (req.params.id != req.body._id) {
                    return res.status(400).json({ err: `Bad Request: ids do not match` });
                }

                // all good, try to update
                await Habit.findByIdAndUpdate(req.params.id, req.body);
                return res.status(204).json();
            }
        }
        return res.status(401).json({ err: 'Unauthorized' });
    }
    catch (err) {
        return res.status(400).json({ err: `Bad Request: ${err}` });
    }
});

/**
 * @swagger
 * /api/v1/habits/{id}:
 *   delete:
 *     summary: Find and delete selected habit by id
 *     tags:
 *       - Habit
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *           required: true
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: Not found
 */
router.delete('/:id', async (req, res) => {
    // auth check w/jwt
    const token = req.cookies.authToken;
        
    if (token) {
        // verify jwt
        const decode = jwt.verify(token, process.env.PASSPORT_SECRET);

        if (decode) {
            // search for habit in the list 
            let habit = await Habit.findById(req.params.id);

            if (!habit) {
                return res.status(404).json({ err: 'Not Found' });
            }

            // remove
            await Habit.findByIdAndDelete(req.params.id);
            return res.status(204).json(); // 204: No Content
        }
    }
    return res.status(401).json({ err: 'Unauthorized' });
});

// make controller public
export default router;