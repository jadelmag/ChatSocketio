const { Schema, model } = require("mongoose");

const ConversationSchema = Schema(
  {
    members: {
      type: Array,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Conversation", ConversationSchema);
