const { addMessage, getMessages, deleteMessages } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/delmsgs", deleteMessages);
router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);

module.exports = router;
