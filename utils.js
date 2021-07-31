const jwt = require("jsonwebtoken");

module.exports = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET || "secretkey",
    {
      expiresIn: "2d",
    }
  );
};
