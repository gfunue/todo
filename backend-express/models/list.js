const mysql = require("mysql");
const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_NAME;

// Create a MySQL connection using environment variables
const connection = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
});

function createListsTable() {
  // SQL query to create a 'lists' table if it doesn't exist
  const sql = `
    CREATE TABLE IF NOT EXISTS lists (
      id INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      user_id INT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;
  // Execute the query and log the result
  connection.query(sql, (error) => {
    if (error) {
      console.error("Error creating 'lists' table:", error);
    } else {
      console.log("'lists' table created or already exists");
    }
  });
}

// Connect to the database and create the 'lists' table if it doesn't exist
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    createListsTable();
  }
});

// Function to get a user's lists
function getUserLists(userId, callback) {
  console.log("getUserLists called with userId:", userId);
  connection.query(
    "SELECT * FROM lists WHERE user_id = ?",
    [userId],
    (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results);
      }
    }
  );
}

// Function to create a new list for a user
function createNewList(name, user_id, callback) {
  const sql = "INSERT INTO lists (name, user_id) VALUES (?, ?)";
  connection.query(sql, [name, user_id], (error, results) => {
    callback(error, results);
  });
}

// Function to create a new list only if the list doesn't already exist for the user
function createNewList(name, user_id, callback) {
  const sql = "SELECT * FROM lists WHERE name = ? AND user_id = ?";
  connection.query(sql, [name, user_id], (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      if (results.length > 0) {
        callback("List already exists", null);
      } else {
        const insertSql = "INSERT INTO lists (name, user_id) VALUES (?, ?)";
        connection.query(insertSql, [name, user_id], (error, results) => {
          callback(error, results);
        });
      }
    }
  });
}

// Function to get all lists
function getAllLists(callback) {
  const sql = "SELECT * FROM lists";
  connection.query(sql, (error, results) => {
    callback(error, results);
  });
}

// Function to get a list by its ID
function getListById(listId, callback) {
  const sql = "SELECT * FROM lists WHERE id = ? LIMIT 1";
  connection.query(sql, [listId], (error, results) => {
    callback(error, results);
  });
}

// Function to delete a list by its ID
function deleteListById(listId, callback) {
  const deleteItemsQuery = "DELETE FROM items WHERE list_id = ?";
  const deleteListQuery = "DELETE FROM lists WHERE id = ?";

  connection.query(deleteItemsQuery, [listId], (error, results) => {
    if (error) {
      callback(error);
    } else {
      connection.query(deleteListQuery, [listId], (error, results) => {
        callback(error, results);
      });
    }
  });
}

// Function to update a list by its ID
function updateList(listId, name, callback) {
  const sql = `
    UPDATE lists
    SET name = COALESCE(?, name)
    WHERE id = ?;
  `;
  connection.query(sql, [name, listId], callback);
}

// Export the functions and connection object
module.exports = {
  connection,
  createListsTable,
  createNewList,
  getAllLists,
  getListById,
  deleteListById,
  updateList,
  getUserLists,
};
