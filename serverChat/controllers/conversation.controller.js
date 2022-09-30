const { response } = require("express");
const Conversation = require("../models/conversation.model");

const newConversation = async (req, res = response) => {
  try {
    const { senderId, receiverId } = req.body;

    const conversation = await Conversation.find({
      members: { $all: [senderId, receiverId] },
    });

    if (conversation.length === 0) {
      const dbConversation = new Conversation({
        members: [senderId, receiverId],
      });
      await dbConversation.save();

      return res.status(201).json({
        ok: true,
        conversation: {
          createdAt: dbConversation.createdAt,
          members: dbConversation.members,
          updatedAt: dbConversation.updatedAt,
          __v: dbConversation.__v,
          uid: dbConversation._id,
        },
      });
    } else {
      return res.status(403).json({
        ok: false,
        msg: "Conversation already exist",
      });
    }
  } catch (err) {
    return res.status(500).json({
      ok: false,
      msg: "Please contact with administrator",
    });
  }
};

const getConversationFromUser = async (req, res = response) => {
  try {
    const dbConversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    return res.status(200).json({
      ok: true,
      conversation: {
        createdAt: dbConversation.createdAt,
        members: dbConversation.members,
        updatedAt: dbConversation.updatedAt,
        __v: dbConversation.__v,
        uid: dbConversation._id,
      },
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      msg: "Please contact with administrator",
    });
  }
};

const findConversationBetweenTwoMembers = async (req, res = response) => {
  try {
    const dbConversation = await Conversation.findOne({
      members: { $all: [req.params.userA, req.params.userB] },
    });
    return res.status(200).json({
      ok: true,
      conversation: {
        createdAt: dbConversation.createdAt,
        members: dbConversation.members,
        updatedAt: dbConversation.updatedAt,
        __v: dbConversation.__v,
        uid: dbConversation._id,
      },
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      msg: "Please contact with administrator",
    });
  }
};

module.exports = {
  newConversation,
  getConversationFromUser,
  findConversationBetweenTwoMembers,
};
