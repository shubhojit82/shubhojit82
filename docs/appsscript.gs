/**
 * PORTFOLIO BOOKING — Google Apps Script  v3
 * ============================================
 *
 * FEATURES:
 *  1. Receives booking form submissions → saves to Google Sheet
 *  2. Sends you (owner) a notification email on each new booking
 *  3. When you change the "Status" column in the sheet to either
 *       "Confirmed"  or  "Proposed New Time"
 *     the script automatically emails the user a professional branded reply.
 *
 * COLUMN MAP (do not reorder):
 *   A  Timestamp
 *   B  Name
 *   C  Email
 *   D  Service
 *   E  Topic
 *   F  Timezone
 *   G  Preferred Time
 *   H  Status          ← change this to trigger user email
 *   I  Confirmed Time  ← fill this in before changing Status
 *   J  Notes           ← optional message to include in reply
 *
 * HOW TO CONFIRM A BOOKING:
 *   1. Open the "Bookings" sheet
 *   2. Fill in column I (Confirmed Time) — e.g. "Mon 28 Jul, 3:00 PM IST"
 *   3. Optionally fill column J (Notes) — e.g. "Zoom link: ..."
 *   4. Change column H (Status) to "Confirmed"
 *      → User receives a confirmation email immediately
 *
 * HOW TO PROPOSE A NEW TIME:
 *   1. Fill in column I with your proposed time
 *   2. Optionally fill column J with context
 *   3. Change column H (Status) to "Proposed New Time"
 *      → User receives a "new time proposal" email
 *
 * SETUP (if starting fresh):
 *   Deploy → Manage Deployments → edit → New Version → Deploy
 *   Then install the onEdit trigger:
 *     Triggers (clock icon) → Add Trigger → onEditTrigger →
 *     Event source: Spreadsheet → Event type: On edit → Save
 */

/* ── CONFIG ─────────────────────────────────────────────────── */
var CONFIG = {
  SHEET_ID:    '1Iv_JlRjU300CjozWPhDBiTqVOz_2Facd8EsCX7dU9Ug',
  SHEET_NAME:  'Bookings',
  OWNER_EMAIL: 'shubhojit.chowdhury@gmail.com',
  OWNER_NAME:  'Shubhojit Chowdhury',
  SITE_URL:    'https://shubhojit82.github.io/shubhojit82/docs/',
  BRAND_COLOR: '#4338ca',
  LOGO_INITIALS: 'SC'
};

/* Column indices (1-based) */
var COL = {
  TIMESTAMP:      1,
  NAME:           2,
  EMAIL:          3,
  SERVICE:        4,
  TOPIC:          5,
  TIMEZONE:       6,
  PREFERRED_TIME: 7,
  STATUS:         8,
  CONFIRMED_TIME: 9,
  NOTES:          10
};

/* ── WEB APP ENDPOINTS ──────────────────────────────────────── */

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Booking endpoint is live.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = {
      name:           (e.parameter.name           || '').trim(),
      email:          (e.parameter.email          || '').trim(),
      topic:          (e.parameter.topic          || '').trim(),
      service:        (e.parameter.service        || '').trim(),
      timezone:       (e.parameter.timezone       || '').trim(),
      preferred_time: (e.parameter.preferred_time || '').trim(),
      timestamp:      e.parameter.timestamp || new Date().toISOString()
    };
    appendToSheet(data);
    sendOwnerNotification(data);
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

/* ── SHEET ──────────────────────────────────────────────────── */

function appendToSheet(data) {
  var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) { sheet = ss.insertSheet(CONFIG.SHEET_NAME); }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Name', 'Email', 'Service',
      'Topic', 'Timezone', 'Preferred Time',
      'Status', 'Confirmed Time', 'Notes'
    ]);
    var h = sheet.getRange(1, 1, 1, 10);
    h.setFontWeight('bold');
    h.setBackground(CONFIG.BRAND_COLOR);
    h.setFontColor('#ffffff');
    h.setFontSize(11);
    sheet.setFrozenRows(1);
    // Column widths
    sheet.setColumnWidth(1, 200);  // Timestamp
    sheet.setColumnWidth(2, 160);  // Name
    sheet.setColumnWidth(3, 220);  // Email
    sheet.setColumnWidth(4, 200);  // Service
    sheet.setColumnWidth(5, 240);  // Topic
    sheet.setColumnWidth(6, 100);  // Timezone
    sheet.setColumnWidth(7, 160);  // Preferred Time
    sheet.setColumnWidth(8, 160);  // Status — add data validation
    sheet.setColumnWidth(9, 200);  // Confirmed Time
    sheet.setColumnWidth(10, 280); // Notes

    // Dropdown validation for Status column
    addStatusValidation(sheet);
  }

  sheet.appendRow([
    data.timestamp,
    data.name,
    data.email,
    data.service,
    data.topic,
    data.timezone,
    data.preferred_time,
    'New',   // Status
    '',      // Confirmed Time — owner fills this in
    ''       // Notes
  ]);

  // Alternate row shading
  var lastRow = sheet.getLastRow();
  if (lastRow % 2 === 0) {
    sheet.getRange(lastRow, 1, 1, 10).setBackground('#f8f9fc');
  }
}

function addStatusValidation(sheet) {
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['New', 'Confirmed', 'Proposed New Time', 'Cancelled'], true)
    .setAllowInvalid(false)
    .build();
  // Apply to entire Status column (rows 2 onwards)
  sheet.getRange(2, COL.STATUS, 1000, 1).setDataValidation(rule);
}

/* ── onEdit TRIGGER ─────────────────────────────────────────── */
/*
 * IMPORTANT: This function must be registered as an installable trigger.
 * In the Apps Script editor:
 *   Left sidebar → Triggers (clock icon) → Add Trigger
 *   Function: onEditTrigger
 *   Event source: From spreadsheet
 *   Event type: On edit
 *   → Save (authorize if prompted)
 */
function onEditTrigger(e) {
  try {
    var sheet = e.range.getSheet();
    if (sheet.getName() !== CONFIG.SHEET_NAME) return;

    var col = e.range.getColumn();
    var row = e.range.getRow();
    if (row === 1) return;                // header row
    if (col !== COL.STATUS) return;       // only watch Status column

    var newStatus = (e.value || '').trim();
    if (newStatus !== 'Confirmed' && newStatus !== 'Proposed New Time') return;

    // Read the full row
    var rowData = sheet.getRange(row, 1, 1, 10).getValues()[0];
    var booking = {
      timestamp:      rowData[COL.TIMESTAMP - 1],
      name:           rowData[COL.NAME - 1],
      email:          rowData[COL.EMAIL - 1],
      service:        rowData[COL.SERVICE - 1],
      topic:          rowData[COL.TOPIC - 1],
      timezone:       rowData[COL.TIMEZONE - 1],
      preferred_time: rowData[COL.PREFERRED_TIME - 1],
      status:         newStatus,
      confirmed_time: rowData[COL.CONFIRMED_TIME - 1],
      notes:          rowData[COL.NOTES - 1]
    };

    if (!booking.email) {
      Logger.log('onEditTrigger: no email found in row ' + row);
      return;
    }

    if (newStatus === 'Confirmed') {
      sendConfirmationToUser(booking);
    } else if (newStatus === 'Proposed New Time') {
      sendNewTimeProposalToUser(booking);
    }

    // Highlight the row to show email was sent
    sheet.getRange(row, 1, 1, 10).setBackground('#f0fdf4'); // light green
    sheet.getRange(row, COL.STATUS, 1, 1).setFontColor('#166534').setFontWeight('bold');

  } catch (err) {
    Logger.log('onEditTrigger error: ' + err.toString());
  }
}

/* ── OWNER NOTIFICATION EMAIL ───────────────────────────────── */

function sendOwnerNotification(data) {
  var subject = '[New Booking] ' + (data.service || 'Session') + ' - ' + (data.name || 'Unknown');

  var html = buildEmailWrapper(
    'New Booking Request',
    'A new session has been requested via your portfolio.',
    [
      detailRow('Session',   data.service || '—', true),
      detailRow('Name',      data.name    || '—'),
      detailRow('Email',     '<a href="mailto:' + esc(data.email) + '" style="color:' + CONFIG.BRAND_COLOR + ';font-weight:600;">' + esc(data.email) + '</a>'),
      detailRow('Topic',     nl2br(esc(data.topic || '—'))),
      detailRow('Timezone',  data.timezone       || '—'),
      detailRow('Preferred', data.preferred_time || '—'),
      detailRow('Received',  formatDate(data.timestamp))
    ],
    /* cta */ {
      label: 'Open Bookings Sheet',
      url:   'https://docs.google.com/spreadsheets/d/' + CONFIG.SHEET_ID
    },
    /* callout */ '<strong>Action required:</strong> Open the sheet, fill in <em>Confirmed Time</em> (column I), then set <em>Status</em> to <strong>Confirmed</strong> or <strong>Proposed New Time</strong> — the user will be emailed automatically.'
  );

  GmailApp.sendEmail(CONFIG.OWNER_EMAIL, subject, stripHtml(html), {
    htmlBody: html,
    name: 'Portfolio Booking System'
  });
}

/* ── USER: CONFIRMATION EMAIL ───────────────────────────────── */

function sendConfirmationToUser(booking) {
  var subject = '[Confirmed] Your ' + (booking.service || 'session') + ' with Shubhojit Chowdhury';

  var rows = [
    detailRow('Session',        booking.service        || '—', true),
    detailRow('Confirmed Time', booking.confirmed_time || 'To be confirmed — check notes below', true),
    detailRow('Your Timezone',  booking.timezone       || '—'),
    detailRow('Topic',          nl2br(esc(booking.topic || '—')))
  ];
  if (booking.notes) {
    rows.push(detailRow('Notes from Shubhojit', nl2br(esc(booking.notes))));
  }

  var html = buildEmailWrapper(
    'Your Session is Confirmed!',
    'Hi ' + esc(booking.name) + ', your session has been confirmed. Here are the details:',
    rows,
    /* cta */ null,
    /* callout */ 'Please reply to this email if you need to reschedule or have any questions. Looking forward to speaking with you!'
  );

  GmailApp.sendEmail(booking.email, subject, stripHtml(html), {
    htmlBody: html,
    name: CONFIG.OWNER_NAME,
    replyTo: CONFIG.OWNER_EMAIL
  });

  // Also notify owner that confirmation was sent
  GmailApp.sendEmail(CONFIG.OWNER_EMAIL,
    '[Sent] Confirmation email dispatched to ' + booking.name,
    'A confirmation email was automatically sent to ' + booking.email + ' for their ' + booking.service + ' session.',
    { name: 'Portfolio Booking System' }
  );
}

/* ── USER: PROPOSED NEW TIME EMAIL ─────────────────────────── */

function sendNewTimeProposalToUser(booking) {
  var subject = '[Action Required] New time proposed for your session with Shubhojit Chowdhury';

  var rows = [
    detailRow('Session',       booking.service        || '—', true),
    detailRow('Proposed Time', booking.confirmed_time || '—', true),
    detailRow('Your Timezone', booking.timezone       || '—'),
    detailRow('Topic',         nl2br(esc(booking.topic || '—')))
  ];
  if (booking.notes) {
    rows.push(detailRow('Message from Shubhojit', nl2br(esc(booking.notes))));
  }

  var html = buildEmailWrapper(
    'New Time Proposed for Your Session',
    'Hi ' + esc(booking.name) + ', thank you for your booking request. The originally requested slot isn\'t available, but here\'s a proposed alternative:',
    rows,
    /* cta */ {
      label: 'Reply to Accept or Suggest Another Time',
      url:   'mailto:' + CONFIG.OWNER_EMAIL + '?subject=Re: ' + encodeURIComponent(subject)
    },
    /* callout */ 'Simply reply to this email to confirm the proposed time, or suggest an alternative that works for you.'
  );

  GmailApp.sendEmail(booking.email, subject, stripHtml(html), {
    htmlBody: html,
    name: CONFIG.OWNER_NAME,
    replyTo: CONFIG.OWNER_EMAIL
  });

  // Also notify owner
  GmailApp.sendEmail(CONFIG.OWNER_EMAIL,
    '[Sent] New time proposal dispatched to ' + booking.name,
    'A new time proposal email was automatically sent to ' + booking.email,
    { name: 'Portfolio Booking System' }
  );
}

/* ── EMAIL BUILDER ──────────────────────────────────────────── */

function buildEmailWrapper(title, subtitle, detailRows, cta, callout) {
  var ctaHtml = cta
    ? '<div style="text-align:center;margin:28px 0 8px;">'
      + '<a href="' + cta.url + '" style="display:inline-block;padding:13px 28px;background:' + CONFIG.BRAND_COLOR + ';color:#ffffff;font-weight:700;font-size:14px;border-radius:999px;text-decoration:none;">'
      + esc(cta.label) + '</a></div>'
    : '';

  var calloutHtml = callout
    ? '<div style="margin-top:22px;padding:16px 18px;background:#eef2ff;border-left:4px solid ' + CONFIG.BRAND_COLOR + ';border-radius:0 8px 8px 0;">'
      + '<p style="margin:0;font-size:13px;color:#3730a3;line-height:1.6;">' + callout + '</p></div>'
    : '';

  return [
    '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f1f5f9;">',
    '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">',
    '<tr><td align="center">',
    '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.10);">',

    /* ── Header ── */
    '<tr><td style="background:' + CONFIG.BRAND_COLOR + ';padding:28px 32px;">',
    '<table width="100%" cellpadding="0" cellspacing="0">',
    '<tr>',
    '<td style="width:44px;height:44px;background:rgba(255,255,255,0.18);border-radius:10px;text-align:center;vertical-align:middle;">',
    '<span style="color:#fff;font-size:16px;font-weight:800;line-height:44px;display:block;">' + CONFIG.LOGO_INITIALS + '</span>',
    '</td>',
    '<td style="padding-left:14px;">',
    '<p style="margin:0;color:#fff;font-weight:800;font-size:17px;">' + esc(CONFIG.OWNER_NAME) + '</p>',
    '<p style="margin:3px 0 0;color:rgba(255,255,255,0.7);font-size:12px;">Forward-Deployed AI Architect</p>',
    '</td>',
    '</tr>',
    '</table>',
    '<h1 style="margin:18px 0 6px;color:#ffffff;font-size:20px;font-weight:800;line-height:1.2;">' + esc(title) + '</h1>',
    '<p style="margin:0;color:rgba(255,255,255,0.8);font-size:13px;">' + subtitle + '</p>',
    '</td></tr>',

    /* ── Body ── */
    '<tr><td style="padding:28px 32px;">',
    '<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;font-family:Inter,\'Segoe UI\',Arial,sans-serif;">',
    detailRows.join(''),
    '</table>',
    calloutHtml,
    ctaHtml,
    '</td></tr>',

    /* ── Footer ── */
    '<tr><td style="padding:16px 32px 24px;border-top:1px solid #e2e6ef;background:#f8f9fc;">',
    '<p style="margin:0;font-size:11px;color:#94a3b8;text-align:center;line-height:1.6;">',
    'This email was sent by the booking system on <a href="' + CONFIG.SITE_URL + '" style="color:' + CONFIG.BRAND_COLOR + ';">shubhojit82.github.io</a>.<br>',
    'To reply directly, email <a href="mailto:' + CONFIG.OWNER_EMAIL + '" style="color:' + CONFIG.BRAND_COLOR + ';">' + CONFIG.OWNER_EMAIL + '</a>.',
    '</p>',
    '</td></tr>',

    '</table>',
    '</td></tr></table>',
    '</body></html>'
  ].join('\n');
}

function detailRow(label, value, highlight) {
  var bg = highlight ? 'background:#f5f7ff;' : '';
  return '<tr style="' + bg + '">'
    + '<td style="padding:10px 12px 10px 0;color:#64748b;font-weight:600;font-size:13px;width:140px;vertical-align:top;border-bottom:1px solid #f1f4f9;">' + esc(label) + '</td>'
    + '<td style="padding:10px 0;color:#0f172a;font-size:13px;vertical-align:top;border-bottom:1px solid #f1f4f9;">' + value + '</td>'
    + '</tr>';
}

/* ── HELPERS ────────────────────────────────────────────────── */

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function nl2br(str) {
  return String(str || '').replace(/\n/g, '<br>');
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function formatDate(ts) {
  try {
    return new Date(ts).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    }) + ' IST';
  } catch(e) {
    return String(ts || '—');
  }
}
