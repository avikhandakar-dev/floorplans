const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const projectsRoute = require("./routes/projects");
const floorplansRoute = require("./routes/floorplans");

app.use("/projects", projectsRoute);
app.use("/floorplans", floorplansRoute);

//Routes
app.get("/", (req, res) => {
  res.status(200).json({ name: "John Doe" });
});

//Daatabase
mongoose.connect(
  process.env.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("DB connected!")
);

app.listen(3000);
