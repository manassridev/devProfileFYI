const express = require("express");
const connectToDB = require("./config/database");
const userModel = require("./models/user");
require("./config/database");
const app = express();
const port = 3200;
const validateRequestBody = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/userAuth");
const SECRET_KEY = "AccManas@321";

app.use(express.json());
app.use(cookieParser());

/**
 * POST /signup endpoint to save the data in DB.
 */
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userInfo = await userModel.findOne({ email: email });
    const isCorrectPassword = await bcrypt.compare(password, userInfo.password);
    if (userInfo.email === email && isCorrectPassword) {
      //create a token using secret key and expires it in 1hr
      const token = jwt.sign({ id: `${userInfo._id}` }, SECRET_KEY, {
        expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
      });
      //Set a cookie and expires it after 1 hour
      res.cookie("token", token, { expires: new Date(Date.now() + 3600000) });
      res.status(200).send("Login Successful");
    } else {
      throw new Error("Invalid user credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

/**
 * returns all the users with the specific email.
 */
app.get("/users", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await userModel.find({ email: userEmail });
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong!!");
  }
});

/**
 * GET /profile endpoint to get the authenticated loggen-in user profile details.
 */
app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    throw new Error("Profile not found:" + err.message);
  }
});

/**
 * /feed will give you all the objects from the user document.
 */
app.get("/feed", userAuth, async (req, res) => {
  try {
    const user = await userModel.find({});
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong!!");
  }
});

/**
 * Returns only one user with the provided email.
 */
app.get("/findUser", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await userModel.findOne({ email: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong!!");
  }
});

/**
 * Delete the data based on provided ID.
 */
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    await userModel.findByIdAndDelete(userId);
    res.status(200).send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong!!");
  }
});

app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const allowedFieldsUpdates = [
      "password",
      "phoneNumber",
      "address",
      "bio",
      "keySkills",
      "age",
    ];
    const fields = Object.keys(req.body);
    const isUpdateAllowed = fields.every((field) =>
      allowedFieldsUpdates.includes(field)
    );
    if (!isUpdateAllowed) {
      res.status(406).send("Update not allowed");
    }
    await userModel.findByIdAndUpdate(
      { _id: userId },
      { ...req.body },
      { runValidators: true }
    );
    res.status(200).send("User updated successfully!!");
  } catch (err) {
    res.status(400).send({ message: "Update failed", error: err?.message });
  }
});

connectToDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log(`Server is successfully listening at port ${port}....`);
    });
  })
  .catch((err) => {
    console.error("Database can't connect !!");
  });
