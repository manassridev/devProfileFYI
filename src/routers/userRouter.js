const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const userRouter = express.Router();
const userConnectionModel = require("../models/user-connection");
const user = require("../models/user");

const PROFILE_INFO = "firstName lastName bio keySkills age";

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
    const receivedConnection = await userConnectionModel.find({
      toUserId: loggedInUser._id,
      requestStatus: "interested",
    });
    res.json({ receivedConnection });
  } catch (err) {
    res.status(400).send("Unable to find the requests");
  }
});

/**
 * GET all the feed of the user.
 */
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await userConnectionModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit > 50 ? 50 : limit;
    const hiddenUsersFromFeed = new Set();
    connectionRequests.forEach((connection) => {
      hiddenUsersFromFeed.add(connection.fromUserId);
      hiddenUsersFromFeed.add(connection.toUserId);
    });
    const userFeed = await user
      .find({
        $and: [
          { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      .populate(PROFILE_INFO)
      .skip(skip)
      .limit(limit);
    res.status(200).send(userFeed);
  } catch (err) {
    res.status(400).send("Unable to load the feed");
  }
});

module.exports = userRouter;
