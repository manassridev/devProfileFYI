const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const userModel = require("../models/user");
const { isUpdateAllowed } = require("../utils/validation");

/**
 * returns all the users with the specific email.
 */
profileRouter.get("/users", async (req, res) => {
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
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.status(200).send(await userModel.findById(req.user._id));
  } catch (err) {
    throw new Error("Profile not found:" + err.message);
  }
});

/**
 * Delete the data based on provided ID.
 */
profileRouter.delete("/profile", async (req, res) => {
  try {
    const userId = req.body.userId;
    await userModel.findByIdAndDelete(userId);
    res.status(200).send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong!!");
  }
});

/**
 * Update the user based on userId.
 */
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!isUpdateAllowed(req)) {
      throw new Error(
        "You're trying to update invalid field (password or email)."
      );
    } else {
      Object.keys(req.body).forEach(
        (user) => (loggedInUser[user] = req.body[user])
      );
      loggedInUser.save();
      res.json({
        message: `${loggedInUser?.firstName} updated successfully!!`,
        data: loggedInUser,
      });
    }
  } catch (err) {
    res.status(400).send({ message: "Update failed", error: err?.message });
  }
});

module.exports = profileRouter;
