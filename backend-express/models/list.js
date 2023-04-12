const mysql = require("mysql");
const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_NAME;

const connection = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
});

function createListsTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS lists (
      id INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      user_id INT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;
  connection.query(sql, (error) => {
    if (error) {
      console.error("Error creating 'lists' table:", error);
    } else {
      console.log("'lists' table created or already exists");
    }
  });
}

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    createListsTable();
  }
});

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

function createNewList(name, user_id, callback) {
  const sql = "INSERT INTO lists (name, user_id) VALUES (?, ?)";
  connection.query(sql, [name, user_id], (error, results) => {
    callback(error, results);
  });
}

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

function getAllLists(callback) {
  const sql = "SELECT * FROM lists";
  connection.query(sql, (error, results) => {
    callback(error, results);
  });
}

function getListById(listId, callback) {
  const sql = "SELECT * FROM lists WHERE id = ? LIMIT 1";
  connection.query(sql, [listId], (error, results) => {
    callback(error, results);
  });
}

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

function updateList(listId, name, callback) {
  const sql = `
    UPDATE lists
    SET name = COALESCE(?, name)
    WHERE id = ?;
  `;
  connection.query(sql, [name, listId], callback);
}

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
