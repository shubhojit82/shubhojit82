/**
 * PORTFOLIO BOOKING — Google Apps Script
 * =========================================
 * SETUP INSTRUCTIONS (one-time, ~5 minutes):
 *
 * 1. Go to https://script.google.com → New project
 * 2. Paste the entire contents of this file into the editor
 *    (replace the default "myFunction" stub).
 * 3. Edit the CONFIG section below:
 *    - SHEET_ID  : Your Google Sheet ID (from the URL)
 *    - NOTIFY_EMAIL: Your Gmail address for notifications
 * 4. Click "Deploy" → "New deployment"
 *    - Type: Web app
 *    - Execute as: Me (your Google account)
 *    - Who has access: Anyone
 * 5. Click Deploy → Authorize → Copy the Web App URL
 * 6. Paste the URL into docs/script.js → APPS_SCRIPT_URL
 *
 * HOW IT WORKS:
 * - Each booking request is appended as a new row in your Google Sheet.
 * - You receive an email notification with the booking details.
 * - The visitor sees a success screen on the site.
 */

/* ── CONFIG ────────────────────────────────────────────────── */
var CONFIG = {
  // Google Sheet ID — from the URL: docs.google.com/spreadsheets/d/SHEET_ID/edit
  SHEET_ID: '1Iv_JlRjU300CjozWPhDBiTqVOz_2Facd8EsCX7dU9Ug',

  // Sheet tab name (default: first sheet)
  SHEET_NAME: 'Bookings',

  // Email address to receive booking notifications (your Gmail)
  NOTIFY_EMAIL: 'shubhojit.chowdhury@gmail.com',

  // Display name shown in notification emails
  YOUR_NAME: 'Shubhojit Chowdhury'
};

/* ── ENTRY POINT ────────────────────────────────────────────── */

/**
 * Handles GET requests (health check / browser test).
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Booking endpoint is live.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handles POST requests from the portfolio booking form.
 */
function doPost(e) {
  try {
    // Receive as form-encoded fields (e.parameter) — works with no-cors from static sites.
    // JSON + no-cors is blocked by CORS preflight and never reaches here.
    var data = {
      name:           e.parameter.name           || '',
      email:          e.parameter.email          || '',
      topic:          e.parameter.topic          || '',
      service:        e.parameter.service        || '',
      timezone:       e.parameter.timezone       || '',
      preferred_time: e.parameter.preferred_time || '',
      timestamp:      e.parameter.timestamp      || new Date().toISOString()
    };
    appendToSheet(data);
    sendNotificationEmail(data);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log('doPost error: ' + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* ── GOOGLE SHEET ────────────────────────────────────────────── */

/**
 * Appends a new booking row to the Google Sheet.
 * Creates headers on the first run automatically.
 */
function appendToSheet(data) {
  var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  // Create the sheet tab if it doesn't exist yet
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }

  // Write header row if the sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Name', 'Email', 'Service',
      'Topic / Goal', 'Timezone', 'Preferred Time', 'Status'
    ]);
    // Style the header
    var headerRange = sheet.getRange(1, 1, 1, 8);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4338ca');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.setColumnWidths(1, 8, 160);
  }

  // Append the booking data
  sheet.appendRow([
    data.timestamp  || new Date().toISOString(),
    data.name       || '',
    data.email      || '',
    data.service    || '',
    data.topic      || '',
    data.timezone   || '',
    data.preferred_time || '',
    'New'           // initial status
  ]);
}

/* ── EMAIL NOTIFICATION ──────────────────────────────────────── */

/**
 * Sends a formatted email notification to the site owner.
 */
function sendNotificationEmail(data) {
  var subject = '📅 New Booking Request — ' + (data.service || 'Session') + ' from ' + (data.name || 'Unknown');

  var htmlBody = [
    '<div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#f8f9fc;padding:24px;border-radius:12px;">',
    '  <div style="background:#4338ca;padding:20px 24px;border-radius:10px 10px 0 0;">',
    '    <h2 style="color:#fff;margin:0;font-size:18px;">New Booking Request</h2>',
    '    <p style="color:rgba(255,255,255,0.75);margin:4px 0 0;font-size:13px;">via your portfolio</p>',
    '  </div>',
    '  <div style="background:#fff;padding:24px;border:1px solid #e2e6ef;border-top:none;border-radius:0 0 10px 10px;">',

    '    <table style="width:100%;border-collapse:collapse;font-size:14px;">',
    row('Session Type', data.service || '—'),
    row('Name',         data.name    || '—'),
    row('Email',        '<a href="mailto:' + (data.email||'') + '" style="color:#4338ca;">' + (data.email||'—') + '</a>'),
    row('Topic',        nl2br(data.topic || '—')),
    row('Timezone',     data.timezone || '—'),
    row('Preferred',    data.preferred_time || '—'),
    row('Submitted',    data.timestamp ? new Date(data.timestamp).toLocaleString('en-IN', {timeZone:'Asia/Kolkata'}) + ' IST' : '—'),
    '    </table>',

    '    <div style="margin-top:20px;padding:14px;background:#eef2ff;border-radius:8px;border:1px solid #c7d2fe;">',
    '      <p style="margin:0;font-size:13px;color:#3730a3;font-weight:600;">Action required:</p>',
    '      <p style="margin:6px 0 0;font-size:13px;color:#4338ca;">',
    '        Reply to <a href="mailto:' + (data.email||'') + '" style="color:#4338ca;">' + (data.email||'') + '</a> ',
    '        within 24 hours to confirm the session time.',
    '      </p>',
    '    </div>',

    '    <p style="margin-top:18px;font-size:12px;color:#94a3b8;text-align:center;">',
    '      Sent from your portfolio booking system &middot; ',
    '      <a href="https://docs.google.com/spreadsheets/d/' + CONFIG.SHEET_ID + '" style="color:#4338ca;">View all bookings</a>',
    '    </p>',
    '  </div>',
    '</div>'
  ].join('\n');

  GmailApp.sendEmail(CONFIG.NOTIFY_EMAIL, subject, stripHtml(htmlBody), {
    htmlBody: htmlBody,
    name: 'Portfolio Booking System'
  });
}

/* ── HELPERS ─────────────────────────────────────────────────── */

function row(label, value) {
  return [
    '<tr>',
    '  <td style="padding:8px 0;color:#475569;font-weight:600;width:130px;vertical-align:top;">' + label + '</td>',
    '  <td style="padding:8px 0;color:#0f172a;">' + value + '</td>',
    '</tr>'
  ].join('');
}

function nl2br(str) {
  return (str || '').replace(/\n/g, '<br />');
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}
