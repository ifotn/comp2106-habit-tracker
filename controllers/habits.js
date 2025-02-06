import express from 'express';

// model ref
import Habit from '../models/habit.js';

// create express router object to handle http request / response calls
const router = express.Router();


/**
 * @swagger
 * /api/v1/cheeses/{id}:
 *   get:
 *     summary: Find cheese by its id
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: integer
 *           required: true
 *     responses:
 *       200:
 *         description: Returns a single cheese
 *       404:
 *         description: Not found
 */
router.get('/', async (req, res) => {
    // use model to fetch all habit documents from mongodb
    let habits = await Habit.find();

    return res.status(200).json(habits);
});

/** GET: /habits/{id} => show selected habit based on id */
router.get('/:id', async (req, res) => {
    let habit = await Habit.findById(req.params.id);

    if (!habit) {
        return res.status(404).json({ err: 'Not Found' });
    }

    return res.status(200).json(habit);
});

/** POST: /habits => read new habit json from request body & add to list */
router.post('/', async (req, res) => {
    try {
        await Habit.create(req.body);
        return res.status(201).json(); // 201: Resource Created
    }
    catch (err) {
        return res.status(400).json({ err: `Bad Request: ${err}` });
    }
});

/** PUT: /habits/{id} => update selected habit */
router.put('/:id', async (req, res) => {
    try {
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
    catch (err) {
        return res.status(400).json({ err: `Bad Request: ${err}` });
    }
});

/** DELETE: /habits/{id} => remove selected habit */
router.delete('/:id', async (req, res) => {
    // search for habit in the list 
    let habit = await Habit.findById(req.params.id);

    if (!habit) {
        return res.status(404).json({ err: 'Not Found' });
    }

    // remove
    await Habit.findByIdAndDelete(req.params.id);
    return res.status(204).json(); // 204: No Content
});

// make controller public
export default router;