const express = require("express");
const routes = require("./routes");
const multer = require("multer");
require("dotenv").config();

const port = process.env.PORT || 3000;
const app = express();
const upload = multer({ dest: "uploads/" });

app.use(upload.none());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(port, () => console.log("Aplication running on port", port));
