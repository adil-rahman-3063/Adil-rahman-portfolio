/**
 * Google Apps Script for Portfolio Reviews Backend
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to extensions -> Apps Script in your Google Sheet:
 *    https://docs.google.com/spreadsheets/d/1iDiFdQ1VKj1-Fx6QjUKgKB3-qAie4pSKFWHfrPhiaGA/edit
 * 2. Delete any existing code and paste this script.
 * 3. Click "Deploy" -> "New Deployment".
 * 4. Choose "Web App" as the type.
 * 5. Configure:
 *    - Execute as: Me (your-email)
 *    - Who has access: Anyone
 * 6. Click Deploy, authorize permissions, and copy the new "Web app URL" (ends in /exec).
 * 7. Ensure your AppScript URL matches this new URL in your portfolio code settings.
 */

const SPREADSHEET_ID = "1iDiFdQ1VKj1-Fx6QjUKgKB3-qAie4pSKFWHfrPhiaGA";
const SHEET_NAME = "Reviews";

function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Check if we are requesting projects
    if (e.parameter && e.parameter.action === 'getProjects') {
      let sheet = ss.getSheetByName("Projects");
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify([]))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      const data = sheet.getDataRange().getValues();
      const projects = [];
      
      // Skip header row
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[0] && row[1]) { // Require ID and Title
          projects.push({
            id: String(row[0]),
            title: String(row[1]),
            subtitle: String(row[2] || ''),
            status: String(row[3] || ''),
            tagline: String(row[4] || ''),
            description: String(row[5] || ''),
            features: String(row[6] || ''),
            tech: String(row[7] || ''),
            link_texts: String(row[8] || ''),
            link_urls: String(row[9] || ''),
            categories: String(row[10] || '')
          });
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify(projects))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Default: Get reviews
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    const reviews = [];
    
    // Skip header row
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      // Column F (index 5) is "Approved"
      const approved = String(row[5]).toUpperCase() === 'TRUE';
      
      if (approved) {
        reviews.push({
          name: row[1] || '',
          role: row[2] || '',
          rating: Number(row[3]) || 5,
          review: row[4] || '',
          timestamp: row[0] ? new Date(row[0]).toISOString() : ''
        });
      }
    }
    
    // Return newest reviews first
    return ContentService.createTextOutput(JSON.stringify(reviews.reverse()))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    let postData;
    
    // Parse incoming POST body
    if (e.postData && e.postData.contents) {
      postData = JSON.parse(e.postData.contents);
    } else {
      postData = e.parameter;
    }
    
    // Check if this is a Project Requirement submission
    if (postData.type === 'requirement' || (postData.phone && postData.requirement)) {
      const name = postData.name || '';
      const phone = postData.phone || '';
      const requirement = postData.requirement || '';
      
      if (!name || !phone || !requirement) {
        return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Name, phone, and requirements are required.' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      let sheet = ss.getSheetByName("Requirements");
      if (!sheet) {
        sheet = ss.insertSheet("Requirements");
        sheet.appendRow(['Timestamp', 'Name', 'Phone/WhatsApp', 'Requirement Details']);
        sheet.setFrozenRows(1);
      }
      
      sheet.appendRow([new Date(), name, phone, requirement]);
      
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Requirement submitted successfully.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Review submission flow
    const name = postData.name || '';
    const role = postData.role || '';
    const rating = Number(postData.rating) || 5;
    const review = postData.review || '';
    
    if (!name || !review) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Name and review text are required.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Name', 'Company/Role', 'Rating', 'Review', 'Approved']);
      sheet.setFrozenRows(1);
    }
    
    // Append row: Timestamp, Name, Company/Role, Rating, Review, Approved (default to true so they appear instantly!)
    sheet.appendRow([new Date(), name, role, rating, review, true]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Review submitted successfully.' }))
        .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
