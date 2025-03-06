const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const config = require('../config/config'); // Import config from external file

const Booking = require('../models/booking.model');


// Load bookings from JSON file and transform to match DB schema
const loadBookingsFromJson = () => {
    try {
        const jsonPath = path.join(__dirname, 'bookings.json');
        console.log('Loading bookings from:', jsonPath);
        const bookingsData = fs.readFileSync(jsonPath, 'utf8');
        const rawBookings = JSON.parse(bookingsData);
        
        // Transform bookings to match the DB schema
        const transformedBookings = rawBookings.map(booking => {
            // Combine date and time into dateTime
            // Format: "2025-03-05T21:45:00+05:30"
            const dateStr = booking.date; // Already in YYYY-MM-DD format
            const timeStr = booking.time;
            
            // Create proper dateTime with India timezone (+05:30)
            let dateTime = `${dateStr}T`;
            
            // Handle time format conversion (12:30 AM -> 00:30:00)
            if (timeStr) {
                const timeParts = timeStr.match(/(\d+):(\d+)\s*([APap][Mm])?/);
                if (timeParts) {
                    let hours = parseInt(timeParts[1]);
                    const minutes = timeParts[2] || '00';
                    const ampm = timeParts[3] ? timeParts[3].toUpperCase() : null;
                    
                    // Convert 12-hour to 24-hour format if AM/PM is specified
                    if (ampm) {
                        if (ampm === 'PM' && hours < 12) hours += 12;
                        if (ampm === 'AM' && hours === 12) hours = 0;
                    }
                    
                    // Format with leading zeros
                    const formattedHours = hours.toString().padStart(2, '0');
                    dateTime += `${formattedHours}:${minutes}:00+05:30`;
                } else {
                    // Default time if parsing fails
                    dateTime += '00:00:00+05:30';
                }
            } else {
                // Default time if no time provided
                dateTime += '00:00:00+05:30';
            }
            
            // Determine if it's an airport pickup based on fromLocation
            const isAirportPickup = booking.fromLocation.toLowerCase().includes('airport');
            
            // Transform the booking object to match DB schema
            return {
                rideId: booking.rideId,
                status: booking.status.toLowerCase() || 'pending',
                placesId: "", // Default empty
                specialReq: "", // Default empty
                driverName: booking.driverName || "",
                cancellationReason: "", // Default empty
                actualCost: 0, // Default 0
                adminComments: "", // Default empty
                isReturnJourney: false, // Default false
                isAirportPickup: isAirportPickup,
                name: booking.customerName || "",
                mobile: booking.mobile || "",
                email: "", // Default empty
                dateTime: dateTime,
                fromLocation: booking.fromLocation,
                toLocation: booking.toLocation,
                notes: booking.notes || "",
                tripCost: booking.cost || 0,
                // MongoDB will automatically add _id, createdAt, updatedAt, and __v
            };
        });
        
        console.log(`Transformed ${transformedBookings.length} bookings to match DB schema`);
        return transformedBookings;
    } catch (error) {
        console.error('Error loading and transforming bookings from JSON:', error);
        return [];
    }
};

// Connect to MongoDB and insert data
mongoose.connect(config.mongoose.url, config.mongoose.options)
    .then(async () => {
        console.log('Connected to MongoDB successfully!');
        const bookings = loadBookingsFromJson();
        console.log(`Found ${bookings.length} bookings to insert.`);
        
        if (bookings.length > 0) {
            try {
                // Drop existing collection first to avoid duplicates
                await mongoose.connection.collection('bookings').drop().catch(err => {
                    // Ignore if collection doesn't exist
                    if (err.code !== 26) {
                        console.warn('Warning when dropping collection:', err.message);
                    }
                });
                
                console.log('Inserting bookings into database...');
                await Booking.insertMany(bookings);
                console.log('Bookings inserted successfully!');
            } catch (error) {
                console.error('Error inserting bookings:', error);
            }
        } else {
            console.log('No bookings to insert');
        }
        
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    }); 