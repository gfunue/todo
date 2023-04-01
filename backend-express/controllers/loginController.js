const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/registration");

async function login(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    User.findUserByEmail(email, async (error, results) => {
      if (error) {
        console.error("Error logging in user:", error);
        res.status(400).send(error);
      } else if (results.length === 0) {
        throw new Error("Invalid login credentials");
      } else {
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid login credentials");
        }
        const token = jwt.sign({ id: user.id, email }, "mysecret");
        const { firstName, lastName } = user;
        getUserLists(user.id, (error, lists) => {
          if (error) {
            console.error("Error fetching user lists:", error);
            res.status(500).send(error);
          } else {
            res.send({
              user: { id: user.id, firstName, lastName, email },
              token,
              lists,
            });
          }
        });
      }
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(400).send(error.message);
  }
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("No authorization header found");
    res.status(401).send("No authorization header");
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("No token provided in the authorization header");
    res.status(401).send("No token provided");
    return;
  }
  jwt.verify(token, "mysecret", (error, decoded) => {
    if (error) {
      console.log("Error during token verification:", error.message);
      res.status(401).send("Failed to authenticate token");
    } else {
      req.user_id = decoded.id;
      next();
    }
  });
}

module.exports = {
  login,
  authenticate,
};
