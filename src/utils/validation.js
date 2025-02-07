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

isUpdateAllowed = (req) => {
  const allowedFieldsUpdates = [
    "phoneNumber",
    "address",
    "bio",
    "keySkills",
    "age",
    "photoUrl",
  ];
  const fields = Object.keys(req.body);
  return fields.every((field) => allowedFieldsUpdates.includes(field));
};

/**
 * Function to check if connection request status is valid or not.
 */
isValidRequestStatus = (status, requestType) => {
  const allowedSendStatuses = ["ignored", "interested"];
  const allowedReviewStatuses = ["accepted", "rejected"];
  return requestType === "send"
    ? allowedSendStatuses.includes(status)
    : allowedReviewStatuses.includes(status);
};

module.exports = {
  validateRequestBody,
  isUpdateAllowed,
  isValidRequestStatus,
};
