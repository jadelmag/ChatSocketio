const { Router } = require("express");

const { validateJWT } = require("../middlewares/validateJWT");
const router = Router();

// Controllers
const {
  addMessage,
  getMessages,
} = require("../controllers/messages.controller");

router.post("/", validateJWT, addMessage);
router.get("/:conversationId", validateJWT, getMessages);

module.exports = router;
