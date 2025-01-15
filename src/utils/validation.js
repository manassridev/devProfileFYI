const validator = require("validator");

validateRequestBody = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!validator.isEmail(email)) {
    throw new Error("Please enter a valid email address: ", email);
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password: ", password);
  } else if (!firstName || !lastName) {
    throw new Error("Please enter valid name");
  }
};

module.exports = validateRequestBody;
