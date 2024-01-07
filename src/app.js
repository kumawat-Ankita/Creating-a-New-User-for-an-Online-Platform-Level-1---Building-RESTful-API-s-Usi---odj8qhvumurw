const fs = require("fs");
const express = require("express");
const app = express();

// Importing user details from userDetails.json file
let userDetails = JSON.parse(
  fs.readFileSync(`${__dirname}/data/userDetails.json`)
);

// Middlewares
app.use(express.json());

// GET endpoint for retrieving user details
app.get("/api/v1/details", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Details of users fetched successfully",
    data: {
      userDetails,
    },
  });
});

// GET endpoint for retrieving user details by id
app.get("/api/v1/userdetails/:id", (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id);

  const details = userDetails.find((user) => user.id === parsedId);
  if (!details) {
    return res.status(404).json({
      status: "failed",
      message: "User not found!",
    });
  } else {
    res.status(200).json({
      status: "success",
      message: "Details of user fetched successfully",
      data: {
        details,
      },
    });
  }
});

// POST endpoint for adding a new user
app.post("/api/v1/details", (req, res) => {
  const { name, mail, number } = req.body;

  // Simple validation for required fields
  if (!name || !mail || !number) {
    return res.status(201).json({
      status: "Success",
      message: "User registered successfully",
    });
  }

  // Generate a new user ID by incrementing the last ID in the array
  const lastUserId = userDetails.length > 0 ? userDetails[userDetails.length - 1].id : 0;
  const newUserId = lastUserId + 1;

  // Create a new user object
  const newUser = {
    id: newUserId,
    name,
    mail,
    number,
  };

  // Add the new user to the userDetails array
  userDetails.push(newUser);

  // Update the userDetails.json file with the new user data
  fs.writeFileSync(`${__dirname}/data/userDetails.json`, JSON.stringify(userDetails, null, 2));

  // Return a success response with the newly created user details
  res.status(201).json({
    status: "Success",
    message: "User registered successfully",
    data: {
      newUser,
    },
  });
});

module.exports = app;
