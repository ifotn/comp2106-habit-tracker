import mongoose, { Mongoose } from "mongoose";

// class used to set this model for user management
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 8,
        unique: true
    },
    password: {
        type: String,
        //required: true,
        //minLength: 8
    }
});

// inherit from passport-local-mongoose using the plugin() method to extend this model's functionality
// this model is special - used by passport to manage user accounts; has methods like register & login
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
export default User;