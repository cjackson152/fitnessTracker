const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const WorkoutSchema = new Schema({
    name: {
        type: String, 
        unique: true,
        require: [true, "Name Required."]
    },
    exercise: [
        {
            type: Schema.Types.ObjectId,
            ref: "Exercise"
        }
    ]
});

const Workouts = mongoose.model("Workouts", WorkoutScema);
module.exports = Workouts;