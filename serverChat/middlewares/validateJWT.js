const { response } = require("express");
const jwt = require("jsonwebtoken");

const validateJWT = (req, res = response, next) => {
  const token = req.header("token");
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "unauthorized user",
    });
  }

  try {
    const { uid, username } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    req.uid = uid;
    req.username = username;
  } catch (err) {
    return res.status(401).json({
      ok: false,
      msg: "unauthorized user",
    });
  }
  next();
};

module.exports = {
  validateJWT,
};
