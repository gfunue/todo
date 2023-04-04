require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Registration = require("../models/registration");
const SECRETE = process.env.SECRETE;

const register = async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  try {
    const hashedPassword = await bcrypt.hash(password, 8);
    Registration.registerUser(
      firstName,
      lastName,
      email,
      hashedPassword,
      (error, results) => {
        if (error) {
          console.error("Error registering user:", error);
          res.status(400).send(error);
        } else {
          const user = { firstName, lastName, email };
          const token = jwt.sign({ id: results.insertId, email }, SECRETE);
          res.status(201).send({ user, token });
        }
      }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(400).send(error);
  }
};

const updateUser = (req, res) => {
  const userId = req.params.userId;
  const updateData = req.body;
  Registration.updateUser(userId, updateData, (error, results) => {
    if (error) {
      console.error("Error updating user:", error);
      res.status(400).send(error);
    } else {
      res.status(200).send({ message: "User updated successfully" });
    }
  });
};

module.exports = {
  register,
  updateUser,
};
