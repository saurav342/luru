const express = require('express');
const router = express.Router();

router.post("/gupshup-webhook", (req, res) => {
    console.log("Incoming Message:", JSON.stringify(req.body, null, 2));

    const { type, payload, sender, message } = req.body;

    if (type === "message") {
        console.log(`📩 Message from ${sender.phone}: ${message.text}`);
    } else {
        console.log("🔔 Other Event:", req.body);
    }

    res.sendStatus(200); // Send 200 OK response
});

module.exports = router; 