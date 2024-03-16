const express = require("express");
const { chatBot } = require("../controllers/chatbotController");

const router = express.Router();

router.post('/process-message',chatBot)

module.exports = router;