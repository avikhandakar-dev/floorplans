const express = require("express");
const Floorplan = require("../models/Floorplan");

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
router.post("/", (req, res) => {
  res.send("test");
});

module.exports = router;
