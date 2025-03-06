const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const config = require('../config/config');

const Booking = require('../models/booking.model');

// Function to parse date strings from various formats
const parseDateTime = (dateTimeStr) => {
  try {
    // Handle different date formats
    if (dateTimeStr.includes('new Date')) {
      // Extract date string from new Date('2025-01-14 00:00:00T05:00:00')
      const match = dateTimeStr.match(/'([^']+)'/);
      if (match && match[1]) {
        return new Date(match[1]);
      }
    } else if (dateTimeStr.startsWith('Invalid date')) {
      // Return current date for invalid dates
      return new Date();
    } else {
      // Try direct parsing
      return new Date(dateTimeStr);
    }
  } catch (error) {
    console.error(`Error parsing date: ${dateTimeStr}`, error);
    return new Date(); // Default to current date if parsing fails
  }
};

// Function to generate a unique ride ID
const generateRideId = () => {
  return `BLR${Math.floor(Math.random() * 900000) + 100000}`;
};

// Function to process the CSV and transform bookings
const loadBookingsFromCsv = () => {
  return new Promise((resolve, reject) => {
    const results = [];
    const csvPath = path.join(__dirname, 'Bookings.csv');
    
    console.log('Loading bookings from CSV:', csvPath);
    
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => {
        try {
          // Check if this is a minimal valid booking
          if (!data.fromLocation || !data.toLocation) {
            console.warn('Skipping record with missing required fields');
            return;
          }
          
          // Transform the CSV row to match DB schema
          let status = data.status?.toLowerCase() || 'pending';
          
          // Fix status values to match enum
          if (status === 'empty' || status === 'scheduled') {
            status = 'pending';
          }
          
          // Generate a rideId if not present
          const rideId = data.rideId || generateRideId();
          
          const booking = {
            status: status,
            placesId: data.placesId || '',
            specialReq: data.specialReq || '',
            driverName: data.driverName || '',
            cancellationReason: data.cancellationReason || '',
            actualCost: Number(data.actualCost) || 0,
            adminComments: data.adminComments || '',
            isReturnJourney: data.isReturnJourney === 'TRUE',
            isAirportPickup: data.isAirportPickup === 'TRUE',
            _id: data._id || mongoose.Types.ObjectId().toString(),
            fromLocation: data.fromLocation || '',
            toLocation: data.toLocation || '',
            dateTime: parseDateTime(data.dateTime),
            name: data.name || '',
            mobile: data.mobile || '0000000000', // Default to valid mobile format
            notes: data.notes || '',
            tripCost: Number(data.tripCost) || 0,
            email: data.email || '',
            rideId: rideId,
            googleMapLink: data.googleMapLink || ''
          };
          
          results.push(booking);
        } catch (error) {
          console.error('Error processing CSV row:', error, data);
        }
      })
      .on('end', () => {
        console.log(`Processed ${results.length} bookings from CSV`);
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Function to insert bookings in batches
const insertBookings = async (bookings) => {
  console.log(`Preparing to insert ${bookings.length} bookings from CSV...`);
  let inserted = 0;
  let skipped = 0;
  const batchSize = 20; // Insert in batches of 20 to avoid overloading the database
  
  // Break bookings into batches
  for (let i = 0; i < bookings.length; i += batchSize) {
    const batch = bookings.slice(i, i + batchSize);
    const operations = [];
    
    for (const booking of batch) {
      try {
        // Check if booking with this _id already exists
        const existingBooking = await Booking.findById(booking._id);
        
        if (existingBooking) {
          skipped++;
          continue; // Skip this booking as it already exists
        }
        
        // Check if booking with this rideId already exists
        const existingRideId = await Booking.findOne({ rideId: booking.rideId });
        
        if (existingRideId) {
          // Generate a new rideId
          booking.rideId = generateRideId();
        }
        
        // Check if similar booking exists (same client, same date, same locations)
        const similarBooking = await Booking.findOne({
          mobile: booking.mobile,
          fromLocation: booking.fromLocation,
          toLocation: booking.toLocation,
          dateTime: {
            $gte: new Date(booking.dateTime.getTime() - 3600000), // 1 hour before
            $lte: new Date(booking.dateTime.getTime() + 3600000)  // 1 hour after
          }
        });
        
        if (similarBooking) {
          skipped++;
          continue; // Skip this booking as a similar one exists
        }
        
        // Add booking to bulk operations
        operations.push({
          insertOne: {
            document: booking
          }
        });
        
        inserted++;
      } catch (error) {
        console.error(`Error processing booking:`, error.message);
        skipped++;
      }
    }
    
    if (operations.length > 0) {
      try {
        // Execute bulk operations
        await Booking.bulkWrite(operations);
        console.log(`Progress: ${inserted} bookings inserted, ${skipped} skipped`);
      } catch (error) {
        console.error('Bulk write error:', error.message);
        // If bulk write fails, try one by one
        for (const op of operations) {
          try {
            await Booking.create(op.insertOne.document);
          } catch (err) {
            console.error(`Individual insert error: ${err.message}`);
            inserted--;
            skipped++;
          }
        }
      }
    }
  }
  
  return { inserted, skipped };
};

// Main function
const importCsvBookings = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log('Connected to MongoDB successfully!');
    
    // Load and transform bookings from CSV
    const bookings = await loadBookingsFromCsv();
    
    if (bookings.length > 0) {
      // Insert bookings while avoiding duplicates
      const result = await insertBookings(bookings);
      console.log(`CSV Import complete: ${result.inserted} bookings inserted, ${result.skipped} skipped`);
      
      if (result.inserted > 0) {
        console.log('Import completed successfully! New bookings have been added to the database.');
      } else {
        console.log('No new bookings were added. All bookings in the CSV file already exist in the database.');
      }
    } else {
      console.log('No bookings found in CSV file');
    }
  } catch (error) {
    console.error('Error during CSV import:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the import process
importCsvBookings(); 