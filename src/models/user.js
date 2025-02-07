const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address:", value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password:", value);
        }
      },
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    photoUrl: {
      type: String,
    },
    bio: {
      type: String,
      default: "This a default bio",
      maxLength: 200,
    },
    keySkills: {
      type: [String],
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Invalid Gender");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.getJWT = async function () {
  const userInfo = this;
  const token = await jwt.sign({ id: `${userInfo._id}` }, "AccManas@321", {
    expiresIn: "1h",
  });
  return token;
};

userSchema.methods.validatePassword = async function (inputPassword) {
  const userInfo = this;
  const hashedPassword = userInfo?.password;
  return await bcrypt.compare(inputPassword, hashedPassword);
};

module.exports = mongoose.model("User", userSchema);
