const fs = require('fs');
const path = require('path');

// New function to read and display raw CSV content
function readAndDisplayRawCSV() {
  console.log('Reading bookings.csv raw content:');
  const bookingsPath = path.join(__dirname, 'bookings.csv');
  
  if (fs.existsSync(bookingsPath)) {
    try {
      const csvData = fs.readFileSync(bookingsPath, 'utf8');
      console.log('\n--- BOOKINGS.CSV RAW CONTENT ---');
      console.log(csvData);
      console.log('--- END OF RAW CONTENT ---\n');
      console.log(`Total characters: ${csvData.length}`);
      console.log(`Total lines: ${csvData.split('\n').length}`);
      console.log('First 10 lines:');
      csvData.split('\n').slice(0, 10).forEach((line, index) => {
        console.log(`${index + 1}: ${line}`);
      });
      
      // Count columns in the first line
      const firstLine = csvData.split('\n')[0];
      if (firstLine) {
        // Count by splitting, but handle quoted values correctly
        let commaCount = 0;
        let inQuotes = false;
        
        for (let i = 0; i < firstLine.length; i++) {
          if (firstLine[i] === '"') {
            inQuotes = !inQuotes;
          } else if (firstLine[i] === ',' && !inQuotes) {
            commaCount++;
          }
        }
        
        console.log(`Number of columns: ${commaCount + 1}`);
      }
      
      return csvData;
    } catch (error) {
      console.error('Error reading bookings.csv:', error);
      return null;
    }
  } else {
    console.log('bookings.csv file does not exist');
    return null;
  }
}

// Function to parse CSV data into JSON
function parseCSVToJSON(csvData) {
  const lines = csvData.split('\n').filter(line => line.trim());
  const bookings = [];

  lines.forEach(line => {
    // Split by commas, but handle quoted values correctly
    const values = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    values.push(currentValue.trim());
    
    // Create booking object with correct data types
    if (values.length >= 14) { // Ensure we have enough values
      const rideId = values[0] ? `BLR${values[0]}` : "BLRunknown";
      
      const booking = {
        rideId: rideId,
        fromLocation: values[1] || "",
        toLocation: values[2] || "",
        date: values[3] ? convertDateFormat(values[3]) : "",
        time: values[4] || "",
        status: values[5] || "",
        customerName: values[6] || "",
        mobile: values[7] || "",
        notes: values[8] || "",
        driverName: values[10] || "", // Changed from 9 to 10 based on CSV structure
        vehicleStatus: values[11] || "", // Changed from 10 to 11
        cost: values[12] ? parseFloat(values[12]) : null, // Changed from 11 to 12
        paymentStatus: values[13] || "" // Changed from 12 to 13
      };
      
      bookings.push(booking);
    }
  });

  return bookings;
}

// Convert date format from "DD MMM YYYY" to "YYYY-MM-DD"
function convertDateFormat(dateStr) {
  try {
    // Handle variations in date format
    dateStr = dateStr.trim();
    
    // If it already has year format like "2025-02-01", return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    const months = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
      'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };

    // Handle format "DD MMM YYYY" (e.g., "01 Feb 2025")
    const match = dateStr.match(/(\d+)\s+([A-Za-z]+)\s+(\d{4})/);
    if (match) {
      const day = match[1].padStart(2, '0');
      const month = months[match[2].slice(0, 3)];
      const year = match[3];
      return `${year}-${month}-${day}`;
    }
    
    // Handle format "D MMM YYYY" (e.g., "3 Feb 2025")
    const altMatch = dateStr.match(/(\d)\s+([A-Za-z]+)\s+(\d{4})/);
    if (altMatch) {
      const day = altMatch[1].padStart(2, '0');
      const month = months[altMatch[2].slice(0, 3)];
      const year = altMatch[3];
      return `${year}-${month}-${day}`;
    }
    
    return dateStr; // Return as is if no conversion is possible
  } catch (error) {
    console.error(`Error converting date: ${dateStr}`, error);
    return dateStr;
  }
}

// Process both data.csv and bookings.csv
function processFiles() {
  try {
    // Process data.csv first
    console.log('Processing data.csv...');
    const dataPath = path.join(__dirname, 'data.csv');
    if (fs.existsSync(dataPath)) {
      const csvData = fs.readFileSync(dataPath, 'utf8');
      console.log(`data.csv size: ${csvData.length} bytes`);
      const dataBookings = parseCSVToJSON(csvData);
      console.log(`Parsed ${dataBookings.length} bookings from data.csv`);
      
      // Save to a temporary file
      const tempJsonPath = path.join(__dirname, 'data_bookings.json');
      fs.writeFileSync(tempJsonPath, JSON.stringify(dataBookings, null, 2), 'utf8');
      console.log(`Saved to ${tempJsonPath}`);
    } else {
      console.log('data.csv not found, skipping');
    }
    
    // Then process bookings.csv
    console.log('\nProcessing bookings.csv...');
    const bookingsPath = path.join(__dirname, 'bookings.csv');
    if (fs.existsSync(bookingsPath)) {
      const csvData = fs.readFileSync(bookingsPath, 'utf8');
      console.log(`bookings.csv size: ${csvData.length} bytes`);
      const newBookings = parseCSVToJSON(csvData);
      console.log(`Parsed ${newBookings.length} bookings from bookings.csv`);
      
      // Save to bookings.json (the one used by insertBookings.js)
      const jsonPath = path.join(__dirname, 'bookings.json');
      fs.writeFileSync(jsonPath, JSON.stringify(newBookings, null, 2), 'utf8');
      console.log(`Saved to ${jsonPath}`);
    } else {
      console.log('bookings.csv not found, skipping');
    }
    
    // Optionally merge both datasets
    const dataJsonPath = path.join(__dirname, 'data_bookings.json');
    const bookingsJsonPath = path.join(__dirname, 'bookings.json');
    
    if (fs.existsSync(dataJsonPath) && fs.existsSync(bookingsJsonPath)) {
      console.log('\nMerging datasets...');
      const dataBookings = JSON.parse(fs.readFileSync(dataJsonPath, 'utf8'));
      const newBookings = JSON.parse(fs.readFileSync(bookingsJsonPath, 'utf8'));
      
      // Create a map of existing rideIds to avoid duplicates
      const rideIdMap = {};
      dataBookings.forEach(booking => {
        rideIdMap[booking.rideId] = true;
      });
      
      // Only add bookings that don't already exist
      const uniqueNewBookings = newBookings.filter(booking => !rideIdMap[booking.rideId]);
      
      // Merge the arrays
      const mergedBookings = [...dataBookings, ...uniqueNewBookings];
      console.log(`Combined ${dataBookings.length} from data.csv and ${uniqueNewBookings.length} new bookings from bookings.csv`);
      console.log(`Total: ${mergedBookings.length} unique bookings`);
      
      // Save the merged dataset
      const mergedJsonPath = path.join(__dirname, 'bookings.json');
      fs.writeFileSync(mergedJsonPath, JSON.stringify(mergedBookings, null, 2), 'utf8');
      console.log(`Saved merged dataset to ${mergedJsonPath}`);
    }
    
    console.log('\nProcessing complete!');
  } catch (error) {
    console.error('Error processing CSV files:', error);
  }
}

// Read CSV content first before processing
console.log('\n=== READING RAW CSV DATA ===\n');
const rawData = readAndDisplayRawCSV();

// Only process if we have data
if (rawData) {
  console.log('\n=== STARTING CSV PROCESSING ===\n');
  processFiles();
} else {
  console.log('Cannot proceed with processing due to missing CSV file');
} 