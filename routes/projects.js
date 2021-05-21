const express = require("express");
const Project = require("../models/Project");

const router = express.Router();

//Get all the projects
router.get("/", async (req, res) => {
  try {
    const project = await Project.find();
    res.json(project);
  } catch (err) {
    res.json({ message: err });
  }
});

//Get a project
router.get("/:projectName", async (req, res) => {
  try {
    const project = await Project.findOne({
      name: req.params.projectName,
    }).exec();
    if (!project) {
      res.sendStatus(404);
    } else {
      res.status(200).json(project);
    }
  } catch (err) {
    res.json({ message: err });
  }
});

//Delete a project
router.delete("/:projectName", async (req, res) => {
  try {
    const removeProject = await Project.deleteOne({
      name: req.params.projectName,
    }).exec();
    if (removeProject.deletedCount == 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json(removeProject);
    }
  } catch (err) {
    res.json({ message: err });
  }
});

//Create a project
router.post("/", (req, res) => {
  const project = new Project({
    name: req.body.name,
  });
  project
    .save()
    .then((data) => {
      res.status(200).json({ success: data });
    })
    .catch((err) => {
      res.json({ error: err });
    });
});

//Update a project
router.patch("/:projectName", async (req, res) => {
  try {
    const updateProject = await Project.updateOne(
      {
        name: req.params.projectName,
      },
      { $set: { name: req.body.name } }
    );
    if (updateProject.nModified == 0) {
      res.sendStatus(404);
    } else {
      res.status(200).send("Project updated!");
    }
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
