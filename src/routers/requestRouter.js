const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const requestRouter = express.Router();
const userConnectionModel = require("../models/user-connection");
const user = require("../models/user");
const { isValidRequestStatus } = require("../utils/validation");

/**
 * Send a connection request to the user.
 */
requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const requestStatus = req?.params?.status;
      const requestToUserID = req?.params?.userId;
      const fromUser = req?.user;
      const requestToUserData = await user.findById(requestToUserID);
      if (!requestToUserData) {
        throw new Error(
          `Request can't send as ${toUserData.firstName} doesn't exist !!`
        );
      }
      if (!isValidRequestStatus(requestStatus, "send")) {
        throw new Error(`Request ${requestStatus} is not valid !!`);
      }
      const isConnectionAlreadyExist = await userConnectionModel.findOne({
        $or: [
          { fromUserId: fromUser?._id, toUserId: requestToUserID },
          { fromUserId: requestToUserID, toUserId: fromUser?._id },
        ],
      });
      if (isConnectionAlreadyExist) {
        throw new Error("Already interacted");
      }
      const connection = await new userConnectionModel({
        fromUserId: fromUser?._id,
        toUserId: requestToUserData?._id,
        requestStatus: requestStatus,
      });
      const data = connection.save();
      res
        .status(200)
        .send(
          `${fromUser?.firstName} Send a Conenction Request to ${requestToUserData?.firstName}`
        );
    } catch (err) {
      res.status(400).send(`Error: ${err}`);
    }
  }
);

/**
 * Accept or reject the connection request.
 */
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req?.user;
      const status = req?.params?.status;
      const requestId = req?.params?.requestId;
      if (!isValidRequestStatus(status, "review")) {
        throw new Error("You can either Accept or reject the request !!");
      }
      const user = await userConnectionModel.findOne({
        _id: requestId,
        toUserId: loggedInUser?._id,
        requestStatus: "interested",
      });
      if (!user) {
        throw new Error("Request not found");
      }
      user.requestStatus = status;
      const userData = await user.save();
      res.status(200).send(`You accepted the invitation, ${userData}`);
    } catch (err) {
      res.status(400).send(`Error: ${err}`);
    }
  }
);

module.exports = requestRouter;
