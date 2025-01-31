const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const userRouter = express.Router();
const userConnectionModel = require("../models/user-connection");

PROFILE_INFO = "firstName lastName bio keySkills age";

/**
 * GET all the connections of a current user.
 */
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await userConnectionModel
      .find({
        $or: [
          { fromUserId: loggedInUser._id, requestStatus: "accepted" },
          { toUserId: loggedInUser._id, requestStatus: "accepted" },
        ],
      })
      .populate("fromUserId", PROFILE_INFO)
      .populate("toUserId", PROFILE_INFO);

    //Check if fromUser ID is same as loggedIn user ID.
    const responseData = connections.map((connection) => {
      if (
        connection.fromUserId._id.toString() === loggedInUser._id.toString()
      ) {
        return connection.toUserId;
      } else {
        return connection.fromUserId;
      }
    });
    res.json({ responseData });
  } catch (err) {
    res.status(400).send("Connection not found");
  }
});

/**
 * GET all the connection requests of the user.
 */
userRouter.get("/user/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const receivedConnection = await userConnectionModel
      .find({
        toUserId: loggedInUser._id,
        requestStatus: "interested",
      })
      .populate(PROFILE_INFO);
    res.json({ receivedConnection });
  } catch (err) {
    res.status(400).send("Unable to find the requests");
  }
});

module.exports = userRouter;
