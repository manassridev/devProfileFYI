const express = require("express");
const authRouter = express.Router();
const { validateRequestBody } = require("../utils/validation");
const bcrypt = require("bcrypt");
const userModel = require("../models/user");

/**
 * POST /signup endpoint to save the data in DB.
 */
authRouter.post("/signup", async (req, res) => {
  try {
    // Validate the user.
    const { firstName, lastName, email, password } = req.body;
    validateRequestBody(req);
    // Encrypt the password.
    const encryptedPassword = await bcrypt.hash(password, 10);
    // Creating the user instance and save the password.
    const userObj = new userModel({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
    });
    await userObj.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send({ message: "Error", error: err.message });
  }
});

/**
 * POST /login enpoint
 * 1. Find the user details by email.
 * 2. Check if provided password is same as saved password.
 * 3. Create a JWT token.
 * 4. Create a cookie with the JWT token and then user can succesfully login.
 */
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userInfo = await userModel.findOne({ email: email });
    const isCorrectPassword = await userInfo.validatePassword(password);

    if (userInfo.email === email && isCorrectPassword) {
      //create a token using secret key and expires it in 1hr
      const token = await userInfo.getJWT();
      //Set a cookie and expires it after 1 hour
      res.cookie("token", token, { expires: new Date(Date.now() + 3600000) });
      res.status(200).send(userInfo);
    } else {
      throw new Error("Invalid user credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(0) });
  res.status(200).send("Logged out successful");
});

module.exports = authRouter;
