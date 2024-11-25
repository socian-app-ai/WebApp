const express = require("express");
const User = require("../../models/user/user.model");
const Campus = require("../../models/university/campus.university.model");
const University = require("../../models/university/university.register.model");
const router = express.Router();

router.get("/all-users", async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/all-campuses", async (req, res) => {
  try {
    const campus = await Campus.find().populate("universityOrigin");

    return res.status(200).json(campus);
  } catch (error) {
    console.error("Error in ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/all-universities", async (req, res) => {
  try {
    const univeristy = await University.find();

    return res.status(200).json(univeristy);
  } catch (error) {
    console.error("Error in ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
