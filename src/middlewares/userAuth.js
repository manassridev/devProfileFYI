const jwt = require("jsonwebtoken");
const User = require("../models/user");

userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    const decodedUserObject = await jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );
    const userInfo = await User.findById(decodedUserObject.id);
    if (!userInfo) {
      return res.send("User not found");
    } else {
      req.user = userInfo;
      next();
    }
  } catch (err) {
    res.status(401).send("ERR :" + err);
  }
};

module.exports = { userAuth };
