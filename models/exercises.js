const mongoose = require("mongoose");
const Schema = mongoose.Schema; 
const ExerciseSchema = new Schema ({
    name: {
        type: String, 
        trim: true,
        required: "Please Name Exercise"
    },
    difficulty: {
        type: String,
        trim: true,
        default: "moderate",
    },
    description: {
        type: String,
        trim: true,
        default: "HIIT"
    }
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);
module.exports = Exercise