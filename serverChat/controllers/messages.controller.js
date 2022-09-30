const { response } = require("express");
const Message = require("../models/message.model");

const addMessage = async (req, res = response) => {
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    return res.status(200).json({ ok: true, savedMessage: savedMessage });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      msg: "Please contact with administrator",
    });
  }
};

const getMessages = async (req, res = response) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    return res.status(200).json({ ok: true, messages: messages });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      msg: "Please contact with administrator",
    });
  }
};

module.exports = {
  addMessage,
  getMessages,
};
