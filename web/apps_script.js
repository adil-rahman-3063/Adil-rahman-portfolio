/**
 * Google Apps Script for Portfolio Reviews Backend
 * 
 * INSTRUCTIONS FOR SETTING UP:
 * 1. Open Google Sheets (https://sheets.google.com).
 * 2. Create a new sheet, rename it (e.g., "Portfolio Reviews").
 * 3. Make sure the first row has these header names in order:
 *    A1: Timestamp  |  B1: Name  |  C1: Company/Role  |  D1: Rating  |  E1: Review  |  F1: Approved
 * 4. Go to Extensions -> Apps Script.
 * 5. Delete any existing code, paste this script.
 * 6. Click Deploy -> New Deployment.
 * 7. Select "Web App" as the type.
 * 8. Set Configuration:
 *    - Description: Portfolio Reviews API
 *    - Execute as: Me (your-email)
 *    - Who has access: Anyone
 * 9. Click Deploy, authorize permissions, and copy the "Web app URL" (ends in /exec).
 * 10. Paste this URL into `lib/sections/reviews_section.dart` in your project.
 */

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    const reviews = [];
    
    // Skip header row (index 0)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      // Column F (index 5) is "Approved"
      const approved = String(row[5]).toUpperCase() === 'TRUE';
      
      if (approved) {
        reviews.push({
          timestamp: row[0],
          name: row[1],
          role: row[2],
          rating: Number(row[3]),
          review: row[4]
        });
      }
    }
    
    // Return approved reviews as JSON with CORS support
    return ContentService.createTextOutput(JSON.stringify(reviews))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    let postData;
    
    // Parse incoming POST body (JSON or Form parameter)
    if (e.postData && e.postData.contents) {
      postData = JSON.parse(e.postData.contents);
    } else {
      postData = e.parameter;
    }
    
    const name = postData.name || '';
    const role = postData.role || '';
    const rating = Number(postData.rating) || 5;
    const review = postData.review || '';
    
    if (!name || !review) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Name and review text are required.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Append row: Timestamp, Name, Company/Role, Rating, Review, Approved (default to false)
    sheet.appendRow([new Date(), name, role, rating, review, false]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Review submitted for approval.' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
