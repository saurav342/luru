const express = require('express');
const Gupshup = require('../../models/gupshup.model'); // Import the Gupshup model
const router = express.Router();

router.post("/gupshup-webhook", async (req, res) => {
    console.log("Incoming Message:", JSON.stringify(req.body, null, 2));

    const { type, sender, message } = req.body;

    if (type === "message") {
        console.log(`📩 Message from ${sender.phone}: ${message.text}`);

        // Create a new Gupshup message
        const gupshupMessage = new Gupshup({
            profileName: sender.profile.name, // Assuming sender.profile.name exists
            waId: sender.phone,
            text: message.text,
            timestamp: new Date() // Set the current date as the timestamp
        });

        try {
            await gupshupMessage.save(); // Save the message to the database
            res.status(201).json(gupshupMessage); // Respond with the saved message
        } catch (error) {
            console.error("Error saving Gupshup message:", error);
            res.status(500).json({ message: error.message });
        }
    } else {
        console.log("🔔 Other Event:", req.body);
        res.sendStatus(200); // Send 200 OK response for non-message events
    }
});

// Route to get all Gupshup messages
router.get('/', async (req, res) => {
    try {
        const gupshupMessages = await Gupshup.find(); // Fetch all Gupshup messages
        res.status(200).json(gupshupMessages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Optionally, you can add a route to get a specific Gupshup message by ID
router.get('/:id', async (req, res) => {
    try {
        const gupshupMessage = await Gupshup.findById(req.params.id); // Fetch Gupshup message by ID
        if (!gupshupMessage) {
            return res.status(404).json({ message: 'Gupshup message not found' });
        }
        res.status(200).json(gupshupMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 