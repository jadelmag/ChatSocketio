const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/register-user.model");
const { validationResult } = require("express-validator");
const { generateJWT } = require("../utils");

const siginUser = async (req, res = response) => {
  try {
    const errors = validationResult(req);
    const msgErrors = errors.errors.map((e) => {
      return { key: e.param, msg: e.msg };
    });
    if (msgErrors.length > 0) {
      return res.status(400).json({
        ok: false,
        errors: msgErrors,
      });
    }
    const { username, email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(302).json({
        ok: false,
        msg: "User already exist with that email.",
      });
    }
    const dbUser = new User(req.body);
    const salt = bcrypt.genSaltSync(10);
    dbUser.password = bcrypt.hashSync(password, salt);
    const token = await generateJWT(dbUser.id, username);
    await dbUser.save();

    return res.status(201).json({
      ok: true,
      uid: dbUser.id,
      token: token,
      username: dbUser.username,
      email: dbUser.email,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      msg: "Please contact with administrator",
    });
  }
};

const loginUser = async (req, res = response) => {
  try {
    const { email, password } = req.body;
    const dbUser = await User.findOne({ email });

    if (!dbUser) {
      return res.status(400).json({
        ok: false,
        msg: "User not found",
      });
    }

    const validPassword = bcrypt.compareSync(password, dbUser.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password not valid",
      });
    }

    const token = await generateJWT(dbUser.id, dbUser.name);

    return res.status(200).json({
      ok: true,
      token: token,
      uid: dbUser.id,
      username: dbUser.username,
      email: dbUser.email,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      msg: "Please contact with administrator",
    });
  }
};

const allUssers = async (req, res = response) => {
  try {
    const { uid } = req;

    User.find({}).exec(async (err, users) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          msg: "Error listing users",
        });
      }

      const allUsers = [];
      users.forEach((user) => {
        const updated = {
          uid: user._id,
          username: user.username,
          email: user.email,
          image: user.image,
        };
        if (user.id !== uid) {
          allUsers.push(updated);
        }
      });

      const dbUser = await User.findById(uid);
      const token = await generateJWT(dbUser.id, dbUser.username);

      return res.status(200).json({
        ok: true,
        users: allUsers,
        token: token,
      });
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      msg: "Please contact with administrator",
    });
  }
};

const renewToken = async (req, res = response) => {
  try {
    const { uid } = req;

    const dbUser = await User.findById(uid);
    const token = await generateJWT(uid, dbUser.name);

    return res.json({
      ok: true,
      uid: uid,
      name: dbUser.name,
      email: dbUser.email,
      token: token,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      msg: "Please contact with administrator",
    });
  }
};

module.exports = {
  siginUser,
  loginUser,
  renewToken,
  allUssers,
};
