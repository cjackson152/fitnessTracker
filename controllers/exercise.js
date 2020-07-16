const router = require("express").Router()
const db = reqwuire("../models");
const mongoose = require("mongoose");

router.get("/all", (req, res) => {
    db.Workouts.find({}, (error, data) => {
        if( error) {
            res.send(error);

        } else {
            res.json(data);
        }
    });
});

router.get("/find:id", (req,res) => {
    db.Exercises.findOne(
        { _id: mongoose.ObjectId(req.params.id)
        },
        (error, data) => {
            if(error) {
                console.log(error);
                res.send(error);
            } else {
                console.log(data);
                res.send(data);
            }
        }
    )
});

router.post("/update/:id", (req,res) => {
    db.Workouts.update(
        { _id: mongoose.ObjectId(req.params.id)

        },
        {
            $set: {
                title: req.body.title,
                note: req.body.note,
                modified: Date.now()
            }
        },
        (error, data) => {
            if (error) {
                res.send(error);

            } else {
                res.send(data);
            }
        }
    );
});