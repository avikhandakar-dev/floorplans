const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const projectsRoute = require("./routes/projects");
const floorplansRoute = require("./routes/floorplans");

const app = express();

//Middleware
app.use(cors());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/projects", projectsRoute);
app.use("/floorplans", floorplansRoute);

//Routes
app.get("/", (req, res) => {
  res.send("Hello there!");
});

//Daatabase
mongoose.connect(
  process.env.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("DB connected!")
);

app.listen(process.env.PORT || 3000);
