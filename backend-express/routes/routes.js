const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");
const loginController = require("../controllers/loginController");
const listController = require("../controllers/listController");
const itemController = require("../controllers/itemController");

router.post("/register", registrationController.register);
router.put("/users/:userId", registrationController.updateUser);

// Authentication routes
router.post("/login", loginController.login);

// List routes
router.post("/list", listController.authenticate, listController.createList);
router.get("/lists", listController.getAllLists);
router.get("/user-lists/:userId", listController.getUserLists);
router.delete("/lists/:listId", listController.deleteListById);
//router.put("/lists/:listId", listController.updateList);
// router.post(
//   "/lists/default",
//   listController.authenticate,
//   listController.createListWithDefaultItems
// );

// Item routes
router.get("/items/:listId", itemController.getAllItems);
router.post("/lists/:listId/items", itemController.createItem);
router.delete("/delete-item/:listId/:itemId", itemController.deleteItem);
router.put("/items/:itemId", itemController.updateItem);

module.exports = router;
