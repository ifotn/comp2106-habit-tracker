import mongoose from "mongoose";

// create schema defining properties of a Habit
const habitSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

// this model inherits all the CRUD methods from Mongoose
const Habit = mongoose.model('Habit', habitSchema);
export default Habit;