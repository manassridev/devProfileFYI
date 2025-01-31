const mongoose = require("mongoose");
const user = require("./user");

const userConnection = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    requestStatus: {
      type: String,
      enum: ["ignored", "interested", "accepted", "rejected"],
      required: true,
      validate(value) {
        if (
          !["ignored", "interested", "accepted", "rejected"].includes(value)
        ) {
          throw new Error(`${value} is invalid status`);
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User-Connection", userConnection);
