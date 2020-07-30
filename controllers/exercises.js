const router = require("express").Router()
const db = require("../models");
router.post("/submit", ({body}, res) => {
    console.log(body);
    db.Exercise.create(body)
        .then((newExercise) => {
            console.log(newExercise);
            return db.Workouts.findOneAndUpdate({}, { exercise: newExercise._id}, { new: true})

        })
        .then(dbWorkouts => {
            res.json(newExercise);

        })
        .catch(err => {
            res.json(err);
        });
});

router.get("/exercises", (req,res) => {
    console.log("message from exercise:");
    db.Exercise.find({}).sort({_id: "desc"})
    .then(dbExercise => {
        res.json(dbExercise);
    })
    .catch(err => {
        res.json(err);
    });
});

router.get("/exercises/:id", (req, res) => {
    db.Exercise.findById(req.params.id)
    .then(result => {
        if(!result) {
            return res.status(404).send({
                message: "No Exercise" + req.params.id
            });
        }
        res.send(result);
    }).catch(err => {
        if(err.kind === "ObjectId") {
            return res.status(404).send({
                message: "No Exercise" + req.params.id
            });
        }

    return res.status(500).send({
        message: "No Exercise" + req.params.id
    });

});

router.put("/exercises/:id", (req, res) => {
    if(!req.body.name) {
        return res.status(400).send({
            message: "must have name"
        });
    }
    db.Exercise.findById(req.params.id, {
        name: req.body.name || "Exercise",
        description: req.body.description,
        difficulty: req.body.difficulty
    }, {new: true})
    .then(results => {
        if(!results) {
            return res.status(404).send({
                message: "No Exercise" + req.params.id
            });
        }
        console.log("LocalHost: " + results);
        res.send(results);
    }).catch(err => {
        if(err.kind === "ObjectId") {
            return res.status(404).send({
                message: "No Exercise" + req.params.id
            });
        }
        return res.status(500).send({
            message: "No Exercise" + req.params.id
        });
    });
});

router.delete("/exercises/:id", (req, res) => {
    let exerciseId = req.params.id;
    db.Exercise.findByIdRemove(req.params.id)
    .then(results => {
        if(!results) {
            return res.status(404).send({
                message: "No Exercise" + req.params.id
            });
        }
        res.send({message: "Deleted"});

    }).catch(err => {
        if(err.kind === "ObjectId" || err.name === "Not Found!") {
            return res.status(404).send({
                message: "No Exercise" + req.params.id
            });
        };
    });
});
});
module.exports = router;
