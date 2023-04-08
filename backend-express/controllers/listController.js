const List = require("../models/list");
const jwt = require("jsonwebtoken");

const createList = (req, res) => {
  const name = req.body.name;
  const user_id = req.user_id;
  List.createNewList(name, user_id, (error, results) => {
    if (error) {
      console.error("Error creating list:", error);
      res.status(400).send(error);
    } else {
      const listId = results.insertId;
      res.status(201).json([{ id: listId, name, user_id: user_id }]);
    }
  });
};

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

// Get all lists
const getAllLists = (req, res) => {
  List.getAllLists((error, results) => {
    if (error) {
      console.error("Error fetching lists:", error);
      res.status(400).send(error);
    } else {
      res.send(results);
    }
  });
};

const getUserLists = (req, res) => {
  const userId = req.params.userId; // assuming that the user_id is stored in the request object
  List.getUserLists(userId, (error, results) => {
    if (error) {
      console.error("Error fetching user lists:", error);
      res.status(400).send(error);
    } else {
      res.send(results);
    }
  });
};

// Get a list by ID
const getListById = (req, res) => {
  const listId = req.params.listId;
  List.getListById(listId, (error, results) => {
    if (error) {
      console.error("Error fetching list:", error);
      res.status(400).send(error);
    } else if (results.length === 0) {
      res.status(404).send("List not found");
    } else {
      res.send(results[0]);
    }
  });
};

//Delete list.
const deleteListById = (req, res) => {
  const listId = req.params.listId;
  List.deleteListById(listId, (error, results) => {
    if (error) {
      console.error("Error deleting items:", error);
      res.status(500).send("Error deleting items");
    } else {
      res.status(200).json({ message: "List deleted" });
    }
  });
};

const updateList = (req, res) => {
  const listId = req.params.listId;
  const name = req.body.name;
  List.updateList(listId, name, (error, results) => {
    if (error) {
      console.error("Error updating list:", error);
      res.status(400).send(error);
    } else {
      res.status(200).send({ message: "List updated successfully" });
    }
  });
};

module.exports = {
  getAllLists,
  getListById,
  deleteListById,
  updateList,
  authenticate,
  getUserLists,
  createList,
};
