const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path:");
const PORT = process.env.PORT || 3001;
const db = require("./models");
const app = express();

app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/workout_trackerdb',
    { useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection
        .once("open", () => console.log("connected"))
        .on( "error", (error) => {
            console.log("error:", error);
        });

db.Workouts.create({name: "Fitness Tracker"})
    .then(dbWorkouts => {
        console.log("create " + dbWorkouts);
        })
    .catch( ({message}) => {
        console.log("error:" + message);
    });

app.get("/", (req,res) =>{
    console.log("GET root route");
    res.sendFile(path.join(__dirname, "./public/index.html"));

})

app.use(require("./controllers/exercises"));
app.use(require("./controllers/workout"));
app.listen(PORT, () => {
    console.log(`connection to port ${PORT}!`);
});