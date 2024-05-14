const express = require("express");
const cors = require("cors");
const client = require("./db/client");
const dotenv = require("dotenv");
const server = express();
const morgan = require("morgan");
const PORT = process.env.PORT || 3000;


client.connect();
dotenv.config();

// app.use(cors());
// app.use(express.json());
// app.use("/api", require("./api"));

server.use(cors({
          origin: "https://6642b56bb6e8721ac618194e--sprightly-sorbet-8f6ed8.netlify.app/"
      }
  ));
// server.use(cors({
//         origin: "https://6642b56bb6e8721ac618194e--sprightly-sorbet-8f6ed8.netlify.app/"
//     }
// ))
// server.options('*', cors())

// logging middleware
server.use(morgan("dev"));
// parsing middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Router: /api
server.use('/api', require('./api'));

// // 404 handler
server.get("*", (req, res) => {
  res.status(404).send({
    error: "404 - Not Found",
    message: "No route found for the requested URL"
  });
});

// error handling middleware
server.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});


