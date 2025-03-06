# Database Import Scripts

This directory contains scripts for managing data in the MongoDB database.

## CSV Booking Import Script

The `importCsvBookings.js` script allows you to import bookings from a CSV file into the MongoDB database without removing existing data.

### Usage

1. Place your CSV file named `Bookings.csv` in the `src/scripts` directory
2. Run the script:
   ```
   node src/scripts/importCsvBookings.js
   ```

### CSV Format

The CSV file should have the following headers:
- status
- placesId
- specialReq
- driverName 
- cancellationReason
- actualCost
- adminComments
- isReturnJourney
- isAirportPickup
- _id
- fromLocation
- toLocation
- dateTime
- name
- mobile
- notes
- tripCost
- createdAt
- __v
- updatedAt
- email
- rideId
- googleMapLink

Required fields in the CSV:
- fromLocation
- toLocation
- mobile

Notes:
- The script will automatically generate missing rideIds
- Duplicate bookings (based on _id or similar attributes) will be skipped
- The script will normalize status values to match allowed values in the schema
- Any missing or invalid dates will default to the current date

### Features

- Batch processing for efficient imports
- Duplicate detection to prevent double bookings
- Validation to ensure data meets the schema requirements
- Detailed logging of import progress and results

### Troubleshooting

If you encounter errors during import:
1. Check your CSV file format and ensure it has the correct column headers
2. Verify that required fields have valid values
3. Check MongoDB connection settings in the config file

For detailed errors, examine the console output during script execution. 