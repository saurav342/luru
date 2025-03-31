const mongoose = require('mongoose');
const Booking = require('../models/booking.model');

/**
 * Get earnings aggregated by different criteria
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getEarnings = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'driver' } = req.query;
    
    // Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.createdAt = { $gte: new Date(startDate) };
    }
    if (endDate) {
      dateFilter.createdAt = { ...dateFilter.createdAt, $lte: new Date(endDate) };
    }

    // Only include completed bookings with a valid driver and actualCost
    const baseFilter = {
      ...dateFilter,
      status: 'completed',
      driverName: { $ne: '' },
      actualCost: { $gt: 0 }
    };

    let aggregation;
    let earnings = [];
    let totalEarnings = 0;

    switch (groupBy) {
      case 'day':
        aggregation = await Booking.aggregate([
          { $match: baseFilter },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              totalEarnings: { $sum: '$actualCost' },
              totalTrips: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } },
          {
            $project: {
              _id: 0,
              period: '$_id',
              totalEarnings: 1,
              totalTrips: 1
            }
          }
        ]);
        earnings = aggregation;
        break;

      case 'week':
        aggregation = await Booking.aggregate([
          { $match: baseFilter },
          {
            $group: {
              _id: { 
                year: { $year: '$createdAt' },
                week: { $week: '$createdAt' }
              },
              totalEarnings: { $sum: '$actualCost' },
              totalTrips: { $sum: 1 },
              firstDay: { $min: '$createdAt' }
            }
          },
          { $sort: { '_id.year': 1, '_id.week': 1 } },
          {
            $project: {
              _id: 0,
              period: {
                $concat: [
                  'Week ',
                  { $toString: '$_id.week' },
                  ' of ',
                  { $toString: '$_id.year' }
                ]
              },
              totalEarnings: 1,
              totalTrips: 1
            }
          }
        ]);
        earnings = aggregation;
        break;

      case 'month':
        aggregation = await Booking.aggregate([
          { $match: baseFilter },
          {
            $group: {
              _id: { 
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              totalEarnings: { $sum: '$actualCost' },
              totalTrips: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } },
          {
            $project: {
              _id: 0,
              period: {
                $concat: [
                  { $switch: {
                    branches: [
                      { case: { $eq: ['$_id.month', 1] }, then: 'January' },
                      { case: { $eq: ['$_id.month', 2] }, then: 'February' },
                      { case: { $eq: ['$_id.month', 3] }, then: 'March' },
                      { case: { $eq: ['$_id.month', 4] }, then: 'April' },
                      { case: { $eq: ['$_id.month', 5] }, then: 'May' },
                      { case: { $eq: ['$_id.month', 6] }, then: 'June' },
                      { case: { $eq: ['$_id.month', 7] }, then: 'July' },
                      { case: { $eq: ['$_id.month', 8] }, then: 'August' },
                      { case: { $eq: ['$_id.month', 9] }, then: 'September' },
                      { case: { $eq: ['$_id.month', 10] }, then: 'October' },
                      { case: { $eq: ['$_id.month', 11] }, then: 'November' },
                      { case: { $eq: ['$_id.month', 12] }, then: 'December' }
                    ],
                    default: 'Unknown'
                  }},
                  ' ',
                  { $toString: '$_id.year' }
                ]
              },
              totalEarnings: 1,
              totalTrips: 1
            }
          }
        ]);
        earnings = aggregation;
        break;

      case 'driver':
      default:
        aggregation = await Booking.aggregate([
          { $match: baseFilter },
          {
            $group: {
              _id: '$driverName',
              totalEarnings: { $sum: '$actualCost' },
              totalTrips: { $sum: 1 }
            }
          },
          { $sort: { totalEarnings: -1 } },
          {
            $project: {
              _id: 0,
              driverName: '$_id',
              totalEarnings: 1,
              totalTrips: 1
            }
          }
        ]);
        earnings = aggregation;
        break;
    }

    // Calculate total earnings
    totalEarnings = earnings.reduce((sum, item) => sum + item.totalEarnings, 0);

    res.status(200).json({
      earnings,
      totalEarnings,
      count: earnings.length
    });
  } catch (error) {
    console.error('Error getting earnings:', error);
    res.status(500).json({ message: 'Error retrieving earnings', error: error.message });
  }
};

module.exports = {
  getEarnings
}; 