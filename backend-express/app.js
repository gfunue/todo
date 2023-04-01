const express = require("express");
require("dotenv").config();
const routes = require("./routes/routes");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const router = express.Router();
const port = process.env.PORT;

routes(router);
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

try {
  app.listen(port, () => {
    console.log("Server listening on port 3000");
  });
} catch (error) {
  console.error("Error starting the server:", error);
}
