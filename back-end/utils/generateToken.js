const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },  // ✅ Ensuring `id` is included
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );
};

module.exports = generateToken;
