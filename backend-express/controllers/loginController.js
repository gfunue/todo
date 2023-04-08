const bcrypt = require("bcryptjs");
const SECRETE = process.env.SECRETE;
const jwt = require("jsonwebtoken");
const User = require("../models/registration");
const List = require("../models/list");

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
        const token = jwt.sign({ id: user.id, email }, SECRETE);
        const { firstName, lastName } = user;

        List.getUserLists(user.id, (error, lists) => {
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

module.exports = {
  login,
};
