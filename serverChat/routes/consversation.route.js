const { Router } = require("express");

const { validateJWT } = require("../middlewares/validateJWT");
const router = Router();

// Controllers
const {
  newConversation,
  getConversationFromUser,
  findConversationBetweenTwoMembers,
} = require("../controllers/conversation.controller");

router.post("/new", validateJWT, newConversation);
router.get("/:userId", validateJWT, getConversationFromUser);
router.get(
  "/find/:userA/:userB",
  validateJWT,
  findConversationBetweenTwoMembers
);

module.exports = router;
