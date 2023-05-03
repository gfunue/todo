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

//Function to connect to database and creat user table
function createUsersTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `;
  connection.query(sql, (error) => {
    if (error) {
      console.error("Error creating 'users' table:", error);
    } else {
      console.log("'users' table created or already exists");
    }
  });
}

//Connect to the database and call the create user table function.
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    createUsersTable();
  }
});

//Function to resgister user.
function registerUser(firstName, lastName, email, hashedPassword, callback) {
  const sql = `INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`;
  connection.query(
    sql,
    [firstName, lastName, email, hashedPassword],
    (error, results) => {
      callback(error, results);
    }
  );
}

//Function to update user.
function updateUser(userId, updateData, callback) {
  const sql = `
    UPDATE users
    SET firstName = COALESCE(?, firstName), lastName = COALESCE(?, lastName), email = COALESCE(?, email), password = COALESCE(?, password)
    WHERE id = ?;
  `;
  const { firstName, lastName, email, password } = updateData;
  connection.query(
    sql,
    [firstName, lastName, email, password, userId],
    callback
  );
}

//Function to get user by email address.
function findUserByEmail(email, callback) {
  const sql = `SELECT * FROM users WHERE email = ?`;
  connection.query(sql, [email], callback);
}

//Function to update Userlist.
function getUserLists(userId, callback) {
  const sql = `SELECT * FROM lists WHERE user_id = ?`;
  connection.query(sql, [userId], callback);
}

//Export the functions and connection object
module.exports = {
  connection,
  createUsersTable,
  registerUser,
  updateUser,
  findUserByEmail,
  getUserLists,
};
