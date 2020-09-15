const express = require("express");
const routes = require("./routes");
require("dotenv").config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(port, () => console.log("Aplication running on port", port));
