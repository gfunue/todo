const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");
const loginController = require("../controllers/loginController");
const listController = require("../controllers/listController");
const itemController = require("../controllers/itemController");

// Registration routes
router.post("/register", registrationController.register);

// Authentication routes
router.post("/login", loginController.login);

// List routes
router.post("/list", loginController.authenticate, listController.createList);
router.get("/lists", listController.getAllLists);
router.get("/lists/:listId", listController.getListById);
router.delete("/delete-lists/:listId", listController.deleteListById);

// Item routes
router.get("/items/:listId", itemController.getAllItems);
router.post("/lists/:listId/items", itemController.createItem);
router.delete("/delete-item/:listId/:itemId", itemController.deleteItem);

module.exports = router;
