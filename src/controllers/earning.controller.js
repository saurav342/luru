const mongoose = require('mongoose');
const Booking = require('../models/booking.model');

/**
 * Get earnings aggregated by different criteria
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

const getEarnings = async (req, res) => {
  try {
    // Support both parameter naming conventions
    const { 
      startDate, endDate,  // Original parameter names
      fromDate, toDate,    // New parameter names from URL
      groupBy = 'driver', 
      status = 'completed' 
    } = req.query;

    // Use new parameter names if provided, fallback to original names
    let effectiveStartDate = fromDate || startDate;
    let effectiveEndDate = toDate || endDate;

    // Validate dates - create proper Date objects and check if they're valid
    let startDateObj = null;
    let endDateObj = null;
    
    if (effectiveStartDate) {
      startDateObj = new Date(effectiveStartDate);
      // Check if date is valid
      if (isNaN(startDateObj.getTime())) {
        console.warn(`Invalid start date provided: ${effectiveStartDate}`);
        effectiveStartDate = null;
        startDateObj = null;
      }
    }
    
    if (effectiveEndDate) {
      endDateObj = new Date(effectiveEndDate);
      // Check if date is valid
      if (isNaN(endDateObj.getTime())) {
        console.warn(`Invalid end date provided: ${effectiveEndDate}`);
        effectiveEndDate = null;
        endDateObj = null;
      }
    }

    // Log the actual parameters being used
    console.log(`Using date range: ${effectiveStartDate} to ${effectiveEndDate}`);

    // Build base filter with date filtering
    const baseFilter = {};
    
    // Add status filter if specified
    if (status) {
      baseFilter.status = status;
    }
    
    // Add date filtering to the base filter - now that all dates are in a consistent format
    if (startDateObj || endDateObj) {
      baseFilter.dateTime = {};
      
      if (startDateObj) {
        // Convert to ISO string for proper comparison
        baseFilter.dateTime.$gte = startDateObj.toISOString();
      }
      
      if (endDateObj) {
        // Convert to ISO string for proper comparison
        baseFilter.dateTime.$lte = endDateObj.toISOString();
      }
    }

    // Create pipeline starting with the base filter
    const pipeline = [
      // Initial match to filter documents
      { $match: baseFilter },
      
      // Simply parse dateTime directly since it's now in a consistent format
      {
        $addFields: {
          parsedDateTime: { $dateFromString: { dateString: "$dateTime", onError: "$dateTime" } }
        }
      }
    ];
    
    // For calculating earnings, consider both tripCost and actualCost
    // Simplified to handle numeric values consistently
    const costField = {
      $cond: {
        if: { $gt: [{ $ifNull: ["$actualCost", 0] }, 0] },
        then: { $ifNull: ["$actualCost", 0] },
        else: { $ifNull: ["$tripCost", 0] }
      }
    };

    let aggregation;
    let earnings = [];
    let totalEarnings = 0;

    // Additional pipeline stages based on groupBy
    let groupPipeline = [];
    
    switch (groupBy) {
      case 'day':
        groupPipeline = [
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$parsedDateTime' } },
              totalEarnings: { $sum: costField },
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
        ];
        break;

      case 'driverDatewise':
        groupPipeline = [
          {
            $group: {
              _id: { 
                driverName: { 
                  $cond: { 
                    if: { $eq: ["$driverName", ""] }, 
                    then: "Unassigned", 
                    else: "$driverName" 
                  }
                },
                date: { $dateToString: { format: '%Y-%m-%d', date: '$parsedDateTime' } }
              },
              totalEarnings: { $sum: costField },
              totalTrips: { $sum: 1 }
            }
          },
          { $sort: { '_id.driverName': 1, '_id.date': 1 } },
          {
            $project: {
              _id: 0,
              driverName: '$_id.driverName',
              date: '$_id.date',
              totalEarnings: 1,
              totalTrips: 1
            }
          }
        ];
        break;

      case 'week':
        groupPipeline = [
          {
            $group: {
              _id: {
                year: { $year: '$parsedDateTime' },
                week: { $week: '$parsedDateTime' }
              },
              totalEarnings: { $sum: costField },
              totalTrips: { $sum: 1 },
              firstDay: { $min: '$parsedDateTime' }
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
        ];
        break;

      case 'month':
        groupPipeline = [
          {
            $group: {
              _id: {
                year: { $year: '$parsedDateTime' },
                month: { $month: '$parsedDateTime' }
              },
              totalEarnings: { $sum: costField },
              totalTrips: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } },
          {
            $project: {
              _id: 0,
              period: {
                $concat: [
                  {
                    $switch: {
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
                    }
                  },
                  ' ',
                  { $toString: '$_id.year' }
                ]
              },
              totalEarnings: 1,
              totalTrips: 1
            }
          }
        ];
        break;

      case 'driver':
      default:
        groupPipeline = [
          {
            $group: {
              _id: { 
                $cond: { 
                  if: { $eq: ["$driverName", ""] }, 
                  then: "Unassigned", 
                  else: "$driverName" 
                }
              },
              totalEarnings: { $sum: costField },
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
        ];
        break;
    }
    
    // Combine base pipeline with group-specific pipeline
    const fullPipeline = [...pipeline, ...groupPipeline];
    
    // Print full pipeline for debugging
    console.log('Aggregation pipeline:', JSON.stringify(fullPipeline, null, 2));
    
    // Execute the aggregation
    aggregation = await Booking.aggregate(fullPipeline);
    earnings = aggregation;

    // Calculate total earnings
    totalEarnings = earnings.reduce((sum, item) => sum + (item.totalEarnings || 0), 0);

    // Add debugging info in development
    const response = {
      earnings,
      totalEarnings,
      count: earnings.length,
      dateFilter: {
        fromDate: effectiveStartDate ? effectiveStartDate : null,
        toDate: effectiveEndDate ? effectiveEndDate : null
      }
    };

    // Log query parameters for debugging
    console.log(`Query params: fromDate=${effectiveStartDate}, toDate=${effectiveEndDate}, groupBy=${groupBy}, status=${status}`);
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error getting earnings:', error);
    res.status(500).json({ message: 'Error retrieving earnings', error: error.message });
  }
};

module.exports = {
  getEarnings
};