const client = require("./client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

// // database functions

// // user functions
async function createUser({ email, username, password, isAdmin = false }) {
  
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {
      rows: [user]
    } = await client.query(
      `
      INSERT INTO users(email, username, password, isAdmin) VALUES ($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING 
      RETURNING id, username, email, isAdmin
    `,
      [email, username, hashedPassword, isAdmin]
    );
    return user;
  } catch (error) {
    throw error;
  }
}
async function getUser(username, password) {
  if (!username || !password) {
    return;
  }
  console.log(username , password);

  try {
    const user = await getUserByUsername(username);
    console.log("inside getUser()" ,user);

    if (!user) return;
    const hashedPassword = user.password;
    console.log(hashedPassword);
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordsMatch) return;
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  // first get the user
  try {
    const {
      rows: [user]
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE id = $1;
    `,
      [userId]
    );
    // if it doesn't exist, return null
    if (!user) return null;
    // if it does:
    // delete the 'password' key from the returned object
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}
async function getUserByUsername(userName) {
  // first get the user
  try {
    
    const { rows } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username = $1;
    `,
      [userName]
    );
    
    // if it doesn't exist, return null
    if (!rows || !rows.length) return null;
    // if it does:
    // delete the 'password' key from the returned object
    const [user] = rows;
   
    // delete user.password;
    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getAllUsers() {
  try {
    const { rows } = await client.query(`
        SELECT *
        FROM users;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername, 
  getAllUsers

};
