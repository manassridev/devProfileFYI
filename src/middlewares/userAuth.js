const jwt = require("jsonwebtoken");
const SECRET_KEY = "AccManas@321";
const User = require("../models/user");

userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    const decodedUserObject = await jwt.verify(token, SECRET_KEY);
    console.log(decodedUserObject);
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
