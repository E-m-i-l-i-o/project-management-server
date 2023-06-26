const router = require("express").Router();
// const mongoose = require("mongoose");

const Task = require("../models/Task.model");
const Project = require("../models/Project.model");

//  POST /api/tasks  -  Creates a new task
router.post("/tasks", (req, res, next) => {
    const { title, description, projectId } = req.body;

    // we create the template of every puece of info
    const newTaskDetails = { 
        title: title,  //first title comes from the model, the second one coems from the variable above which are the body of the request
        description: description, 
        project: projectId
    };

    // we update the project wwiht the new task assigned
    Task.create(newTaskDetails)
        .then(taskFromDB => {
            return Project.findByIdAndUpdate(projectId, { $push: { tasks: taskFromDB._id } }); //we push a new element to that array
        })
        .then(response => res.status(201).json(response))
        .catch(err => {
            console.log("error creating a new task", err);
            res.status(500).json({
                message: "error creating a new task",
                error: err
            });
        })
});

module.exports = router;
