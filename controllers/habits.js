import express from 'express';

// create express router object to handle http request / response calls
const router = express.Router();

// create in-memory data (replace w/db later)
let habits = [
    { id: 1, name: 'Drink Water' },
    { id: 2, name: 'Track Assignment' },
    { id: 3, name: 'Wash Hands' },
    { id: 4, name: 'Daily Workout' },
    { id: 5, name: 'Be Positive' },
    { id: 6, name: 'Eat Balanced Diet' },
    { id: 7, name: 'Wash the Dishes' },
    { id: 8, name: 'Do Duolingo Spanish Lesson' }
];

/** GET: /habits => show all habits */
router.get('/', (req, res) => {
    return res.status(200).json(habits);
});

/** GET: /habits/{id} => show selected habit based on id */
router.get('/:id', (req, res) => {
    // search for id param value in list
    const habit = habits.find(h => h.id == req.params.id);

    if (!habit) {
        return res.status(404).json({ err: 'Not Found' });
    }

    return res.status(200).json(habit);
});

/** POST: /habits => read new habit json from request body & add to list */
router.post('/', (req, res) => {
    if (!req.body.id || !req.body.name) {
        return res.status(400).json({ err: 'Bad Request' });
    }

    habits.push(req.body);
    return res.status(201).json(); // 201: Resource Created
});

/** PUT: /habits/{id} => update selected habit */
router.put('/:id', (req, res) => {
    if (!req.body.id || !req.body.name) {
        return res.status(400).json({ err: 'Bad Request' });
    }

    // search for habit in the list 
    const index = habits.findIndex(h => h.id == req.params.id);

    if (index == -1) {
        return res.status(404).json({ err: 'Not Found' });
    }

    habits[index].name = req.body.name;
    return res.status(204).json(); // 204: No Content
});

/** DELETE: /habits/{id} => remove selected habit */
router.delete('/:id', (req, res) => {
    // search for habit in the list 
    const index = habits.findIndex(h => h.id == req.params.id);

    if (index == -1) {
        return res.status(404).json({ err: 'Not Found' });
    }

    // remove
    habits.splice(index, 1);
    return res.status(204).json(); // 204: No Content
});

// make controller public
export default router;