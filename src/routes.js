const express = require("express");
const RecommendationController = require("./controllers/recommendation.js");

const router = express.Router();
router.post("/text", RecommendationController.text);
router.get("/", (req, res) => res.json({ message: "Application is running!" }));

module.exports = router;
