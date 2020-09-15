const express = require("express");
const multer = require("multer");
const path = require("path");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

const RecommendationController = require("./controllers/recommendation.js");

router.post(
  "/recommendation",
  upload.single("audio"),
  RecommendationController.recommend
);
router.get("/", (req, res) => res.json({ message: "Application is running!" }));

module.exports = router;
