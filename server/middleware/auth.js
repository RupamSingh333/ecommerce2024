const jwt = require("jsonwebtoken");
const configFile = require("../config/config");

const verifyToken = async (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers["authorization"];

  if (req.headers.authorization) {
    token = req.headers.authorization.replace("Bearer ", "");
  }

  // Retrieve token from cookies
  if (!token && req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).send({
      success: false,
      message: "A token is required for authentication",
    });
  }

  try {
    const decoded = jwt.verify(token, configFile.secretKey);
    req.user = decoded;
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }

  return next();
};

module.exports = verifyToken;
