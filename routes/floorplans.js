const express = require("express");
const Floorplan = require("../models/Floorplan");
const Project = require("../models/Project");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

const router = express.Router();

//Get all the floorplans
router.get("/", async (req, res) => {
  try {
    const floorplans = await Floorplan.find();
    res.json(floorplans);
  } catch (err) {
    res.json({ message: err });
  }
});

//Get a floorplan
router.get("/:floorplanName", async (req, res) => {
  try {
    const floorplan = await Floorplan.findOne({
      name: req.params.floorplanName,
    }).exec();
    if (!floorplan) {
      res.sendStatus(404);
    } else {
      res.status(200).json(floorplan);
    }
  } catch (err) {
    res.json({ message: err });
  }
});

//Delete a floorplan
router.delete("/:floorplanName", async (req, res) => {
  try {
    const removeFloorplan = await Floorplan.deleteOne({
      name: req.params.floorplanName,
    }).exec();
    if (removeFloorplan.deletedCount == 0) {
      res.sendStatus(404);
    } else {
      res.status(200).send("Floorplan deleted!");
    }
  } catch (err) {
    res.json({ message: err });
  }
});

//Create a floorplan
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __basedir + "/uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, "original-" + Date.now() + path.extname(file.originalname));
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type! Only jpeg and png are supported."), false);
  }
};
var upload = multer({ storage: storage, fileFilter: fileFilter });
router.post("/", upload.single("image"), async (req, res) => {
  const host = req.get("host");
  const timestamp = Date.now();
  const filename = req.file.originalname;
  const floorplanName = req.body.name || path.parse(filename).name;
  const project = req.body.projectName;
  const original = host + "/" + req.file.path;
  let thumb = null;
  let large = null;

  if (!project) {
    return res.status(400).json({ error: "You must specify a project name!" });
  }
  const existingProject = await Project.findOne({
    name: project,
  }).exec();

  if (!existingProject) {
    return res.status(404).json({ error: "Project not found!" });
  }

  try {
    const createThumb = sharp(req.file.path)
      .resize(100, 100)
      .toFile(
        __basedir +
          "/uploads/" +
          "thumb-" +
          timestamp +
          path.extname(req.file.originalname),
        (err, resizeImage) => {
          if (err) {
            console.log(err);
          } else {
            console.log(resizeImage);
          }
        }
      );

    const createLarge = sharp(req.file.path)
      .resize(2000, 2000)
      .toFile(
        __basedir +
          "/uploads/" +
          "large-" +
          timestamp +
          path.extname(req.file.originalname),
        (err, resizeImage) => {
          if (err) {
            console.log(err);
          } else {
            console.log(resizeImage);
          }
        }
      );
    thumb = host + "/" + createThumb.options.fileOut;
    large = host + "/" + createLarge.options.fileOut;
  } catch (err) {
    console.error(err);
  }

  if (!floorplanName || !project || !original || !thumb || !large) {
    return res.status(500).json({ error: "Server error!" });
  }

  const floorplan = new Floorplan({
    name: floorplanName,
    project: project,
    original: original,
    thumb: thumb,
    large: large,
  });
  try {
    const saveFloorplan = await floorplan.save();
    return res.status(200).json(saveFloorplan);
  } catch (err) {
    return res.json({ error: err });
  }
});

//Update floorplan
router.patch("/:floorplanName", async (req, res) => {
  try {
    const updateFloorplan = await Floorplan.updateOne(
      {
        name: req.params.floorplanName,
      },
      { $set: { name: req.body.name } }
    );
    if (updateFloorplan.nModified == 0) {
      res.sendStatus(404);
    } else {
      res.status(200).send("Project updated!");
    }
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
