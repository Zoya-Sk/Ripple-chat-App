const express = require("express");
const router = express.Router();

const {
  createNewMessage,
  createnewMsg,
  getAllMessages,
} = require("../controllers/messageController");
const { checkAuth } = require("../middlewares/authMiddleware");

router.post("/send-message", checkAuth, createnewMsg);
router.get("/get-all-message/:chatUserId", checkAuth, getAllMessages);

module.exports = router;
