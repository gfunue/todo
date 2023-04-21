const mysql = require("mysql");
const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_NAME;

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
});

// Function to create the items table if it doesn't exist
function createItemsTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS items (
      id INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      list_id INT,
      FOREIGN KEY (list_id) REFERENCES lists(id)
    );
  `;
  connection.query(sql, (error) => {
    if (error) {
      console.error("Error creating 'items' table:", error);
    } else {
      console.log("'items' table created or already exists");
    }
  });
}

// Connect to the MySQL database and create the items table if it doesn't exist
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    createItemsTable();
  }
});

// Function to get all items by list ID
function getAllItemsByListId(listId, callback) {
  connection.query(
    "SELECT items.* FROM items JOIN lists ON items.list_id = lists.id WHERE lists.id = ?",
    [listId],
    callback
  );
}

// Function to create an item in a list
function createItemInList(listId, itemName, callback) {
  connection.query(
    "INSERT INTO items (name, list_id) VALUES (?, ?)",
    [itemName, listId],
    callback
  );
}

// Function to delete an item from a list by list ID and item ID
function deleteItemFromList(listId, itemId, callback) {
  connection.query(
    "DELETE items FROM items JOIN lists ON items.list_id = lists.id WHERE lists.id = ? AND items.id = ?",
    [listId, itemId],
    callback
  );
}

// Function to update an item by its ID
function updateItem(itemId, name, callback) {
  const sql = `
    UPDATE items
    SET name = COALESCE(?, name)
    WHERE id = ?;
  `;
  connection.query(sql, [name, itemId], callback);
}

// Export the functions and connection object
module.exports = {
  connection,
  createItemsTable,
  getAllItemsByListId,
  createItemInList,
  deleteItemFromList,
  updateItem,
};
