const List = require("../models/list");

// Create a new list
const createList = (req, res) => {
  const name = req.body.name;
  const user_id = req.user_id;

  List.createList(name, user_id, (error, results) => {
    if (error) {
      console.error("Error creating list:", error);
      res.status(400).send(error);
    } else {
      const listId = results.insertId;
      const defaultItems = ["Item 1", "Item 2", "Item 3"];
      const insertPromises = defaultItems.map((itemName) => {
        return new Promise((resolve, reject) => {
          connection.query(
            "INSERT INTO items (name, list_id) VALUES (?, ?)",
            [itemName, listId],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        });
      });
      Promise.all(insertPromises)
        .then(() => {
          res.status(201).send({ id: listId, name, user_id });
        })
        .catch((error) => {
          console.error("Error creating default items:", error);
          res.status(500).send("Error creating default items: " + error);
        });
    }
  });
};

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
      connection.query(deleteListQuery, [listId], (error, results) => {
        if (error) {
          console.error("Error deleting list:", error);
          res.status(500).send("Error deleting list");
        } else {
          res.status(200).json({ message: "List deleted" });
        }
      });
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
  createList,
  getAllLists,
  getListById,
  deleteListById,
  updateList,
};
