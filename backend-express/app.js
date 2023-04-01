const express = require("express");
require("dotenv").config();
const routes = require("./routes/routes");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use("/", routes);

try {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
} catch (error) {
  console.error("Error starting the server:", error);
}
