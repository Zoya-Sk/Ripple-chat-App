const express = require("express");
const router = express.Router();

const { signup, login, getAllUsers } = require("../controllers/authController");
const { checkAuth } = require("../middlewares/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/get-all-users", checkAuth, getAllUsers);

module.exports = router;