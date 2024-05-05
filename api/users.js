
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  createUser,
  getAllUsers,
  getUserByUsername,
  getUser,
  getUserById
} = require("../db");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");

// console.log(JWT_SECRET);
// POST /api/users/register
// IMPLEMENT THE REGISTER ROUTE
router.post("/register", async function (request, response, next) {
  try {
    const { username, password, email } = request.body;

    const newUser = await createUser({ email, username, password });
    console.log({ newUser, JWT_SECRET });

    delete newUser.password;

    const token = jwt.sign(
      {
        id: newUser.id,
        username: newUser.username
      },
      JWT_SECRET,
      { expiresIn: "1w" }
    );

    response.json({
      newUser,
      message: "you're signed up!",
      token
    });
  } catch (error) {
    console.log("error in register endpoint", error);
    next(error);
  }
});

// // POST /api/users/login
// // IMPLEMENT THE LOGIN ROUTE
router.post("/login", async function (request, response, next) {
  try {
    const { username, password } = request.body;

    const user = await getUser(username, password);

    delete user.password;

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username
      },
      JWT_SECRET,
      { expiresIn: "1w" }
    );

    response.json({
      message: "Login success~",
      user,
      token
    });
  } catch (error) {
    console.log("error in login endpoint", error);
    next(error);
  }
});

// GET api/users
// GET /api/users
router.get("/", async (req, res, next) => {
  try {
    const users = await getAllUsers();
    console.log(users);
    res.send(users);
  } catch (error) {
    next(error);
  }
});

// // GET /api/users/me
router.get("/me", requireUser, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

//get user by userId
router.get("/:userId", async (req, res, next) => {
  try {
    const user = await getUserById(req.params.userId);
    res.send(user);
  } catch (error) {
    throw error;
  }
});

module.exports = router;























// const client = require("./client");
// const bcrypt = require("bcrypt");
// const SALT_COUNT = 10;

// // // database functions

// // // user functions
// async function createUser({ email, username, password }) {
  
//   const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
//   try {
//     const {
//       rows: [user]
//     } = await client.query(
//       `
//       INSERT INTO users(email, username, password) VALUES ($1, $2, $3)
//       ON CONFLICT (username) DO NOTHING 
//       RETURNING id, username, email
//     `,
//       [email, username, hashedPassword]
//     );
//     return user;
//   } catch (error) {
//     throw error;
//   }
// }



// // get allUsers
// async function getAllUsers() {
//   try {
//     const { rows } = await client.query(`
//         SELECT *
//         FROM users;
//         `);
//     return rows;
//   } catch (error) {
//     throw error;
//   }
// }

// async function getUser(username, password) {
//   if (!username || !password) {
//     return;
//   }
//   console.log(username , password);

//   try {
//     const user = await getUserByUsername(username);
//     console.log("inside getUser()" ,user);

//     if (!user) return;
//     const hashedPassword = user.password;
//     console.log(hashedPassword);
//     const passwordsMatch = await bcrypt.compare(password, hashedPassword);
//     if (!passwordsMatch) return;
//     delete user.password;
//     return user;
//   } catch (error) {
//     throw error;
//   }
// }

// async function getUserById(userId) {
//   // first get the user
//   try {
//     const {
//       rows: [user]
//     } = await client.query(
//       `
//       SELECT *
//       FROM users
//       WHERE id = $1;
//     `,
//       [userId]
//     );
//     // if it doesn't exist, return null
//     if (!user) return null;
//     // if it does:
//     // delete the 'password' key from the returned object
//     delete user.password;
//     return user;
//   } catch (error) {
//     throw error;
//   }
// }
// async function getUserByUsername(userName) {
//   // first get the user
//   try {
    
//     const { rows } = await client.query(
//       `
//       SELECT *
//       FROM users
//       WHERE username = $1;
//     `,
//       [userName]
//     );
    
//     // if it doesn't exist, return null
//     if (!rows || !rows.length) return null;
//     // if it does:
//     // delete the 'password' key from the returned object
//     const [user] = rows;
   
//     // delete user.password;
//     return user;
//   } catch (error) {
//     console.error(error);
//   }
// }
// module.exports = {
//   createUser,
//   getUser,
//   getUserById,
//   getUserByUsername,
//   getAllUsers
// };
