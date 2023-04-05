const Item = require("../models/item");

// Get all items in a list
const getAllItems = (req, res) => {
  const listId = req.params.listId;
  Item.getAllItemsByListId(listId, (error, results) => {
    if (error) {
      console.error("Error fetching items:", error);
      res.status(400).send(error);
    } else {
      res.send(results);
    }
  });
};

// Create a new item in a list
// const createItem = (req, res) => {
//   const listId = req.params.listId;
//   console.log("THE LIST ID" + listId);
//   const itemName = req.body.name;
//   Item.createItemInList(listId, itemName, (error, results) => {
//     if (error) {
//       console.error("Error creating item:", error);
//       res.status(400).send(error);
//     } else {
//       res.status(201).send({ id: results.insertId, name: itemName });
//     }
//   });
// };
const createItem = (req, res) => {
  const listId = parseInt(req.params.listId, 10);
  console.log("THE LIST ID" + listId);
  const itemName = req.body.name;
  Item.createItemInList(listId, itemName, (error, results) => {
    if (error) {
      console.error("Error creating item:", error);
      res.status(400).send(error);
    } else {
      res.status(201).send({ id: results.insertId, name: itemName });
      console.log("createItem req.params:", req.params);
      console.log("createItem req.body:", req.body);
    }
  });
};

// Delete an item from a list
const deleteItem = (req, res) => {
  const listId = req.params.listId;
  const itemId = req.params.itemId;
  Item.deleteItemFromList(listId, itemId, (error, results) => {
    if (error) {
      console.error("Error deleting item:", error);
      res.status(400).send(error);
    } else {
      res.status(204).send();
    }
  });
};

const updateItem = (req, res) => {
  const itemId = req.params.itemId;
  const name = req.body.name;
  Item.updateItem(itemId, name, (error, results) => {
    if (error) {
      console.error("Error updating item:", error);
      res.status(400).send(error);
    } else {
      res.status(200).send({ message: "Item updated successfully" });
    }
  });
};

module.exports = {
  getAllItems,
  createItem,
  deleteItem,
  updateItem,
};
