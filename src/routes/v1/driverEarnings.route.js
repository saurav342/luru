const express = require('express');
const router = express.Router();
const Booking = require('../../models/booking.model'); // Adjust the path as necessary

// GET /driver-earnings endpoint
router.get('/', async (req, res) => {
    const { name, fromDate, toDate } = req.query;

    // Validate query parameters
    if (!name || !fromDate || !toDate) {
        return res.status(400).json({ error: 'Missing required query parameters' });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    // Ensure valid date range
    if (isNaN(from) || isNaN(to) || from >= to) {
        return res.status(400).json({ error: 'Invalid date range' });
    }

    try {
        // Fetch earnings data
        const earnings = await Booking.find({
            driverName: name,
            dateTime: { $gte: from, $lte: to }
        });

        console.log('..........earnings', earnings);

        // Calculate total earnings using `tripCost`
        const totalEarnings = earnings.reduce((acc, curr) => acc + (curr.tripCost || 0), 0);

        // Prepare response with proper date formatting
        const response = {
            driverName: name,
            fromDate: from.toISOString().split('T')[0], // Ensure consistent date format
            toDate: to.toISOString().split('T')[0],
            totalEarnings: totalEarnings,
            earnings: earnings.map(earning => ({
                date: new Date(earning.dateTime).toISOString().split('T')[0], // Fix date format
                amount: earning.tripCost || 0
            }))
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching driver earnings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;