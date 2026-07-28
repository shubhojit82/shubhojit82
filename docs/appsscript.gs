/**
 * PORTFOLIO BOOKING — Google Apps Script  v4
 * ============================================
 *
 * FEATURES:
 *  1. Booking form submissions → saved to Google Sheet
 *  2. Owner notification email on each new booking
 *  3. Custom sidebar in the Sheet — open it from the
 *     "Bookings" menu → "Manage Selected Booking"
 *     Shows: booking details, date/time picker, comments,
 *     and three action buttons: Confirm / Propose New Time / Cancel
 *  4. Status column has a dropdown (no manual typing)
 *  5. Branded HTML emails sent to user on each action
 *
 * HOW TO USE THE SIDEBAR:
 *   1. Open your Google Sheet
 *   2. Click any booking row to select it
 *   3. Click the top menu "Bookings" → "Manage Selected Booking"
 *   4. The sidebar opens on the right showing booking details
 *   5. Pick date/time, add comments, then click an action button
 */

/* ── CONFIG ─────────────────────────────────────────────────── */
var CONFIG = {
  SHEET_ID:      '1Iv_JlRjU300CjozWPhDBiTqVOz_2Facd8EsCX7dU9Ug',
  SHEET_NAME:    'Bookings',
  OWNER_EMAIL:   'shubhojit.chowdhury@gmail.com',
  OWNER_NAME:    'Shubhojit Chowdhury',
  SITE_URL:      'https://shubhojit82.github.io/shubhojit82/docs/',
  BRAND_COLOR:   '#4338ca',
  LOGO_INITIALS: 'SC'
};

var COL = {
  TIMESTAMP:1, NAME:2, EMAIL:3, SERVICE:4, TOPIC:5,
  TIMEZONE:6, PREFERRED_TIME:7, STATUS:8, CONFIRMED_TIME:9, NOTES:10
};

var STATUS = {
  NEW:      'New',
  CONFIRMED:'Confirmed',
  PROPOSED: 'Proposed New Time',
  CANCELLED:'Cancelled'
};

/* ── MENU ───────────────────────────────────────────────────── */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Bookings')
    .addItem('Manage Selected Booking', 'openSidebar')
    .addItem('Fix Status Dropdowns', 'fixStatusDropdowns')
    .addToUi();
}

/* ── SIDEBAR ────────────────────────────────────────────────── */

function openSidebar() {
  var html = HtmlService.createHtmlOutput(getSidebarHtml())
    .setTitle('Manage Booking')
    .setWidth(340);
  SpreadsheetApp.getUi().showSidebar(html);
}

function getSelectedBooking() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) return { error: 'Bookings sheet not found.' };

  var row = sheet.getActiveRange().getRow();
  if (row <= 1) return { error: 'Please click on a booking row (not the header).' };

  var data = sheet.getRange(row, 1, 1, 10).getValues()[0];
  if (!data[COL.NAME - 1] && !data[COL.EMAIL - 1]) {
    return { error: 'This row appears to be empty. Click a booking row first.' };
  }

  return {
    row:          row,
    timestamp:    data[COL.TIMESTAMP - 1]      ? String(data[COL.TIMESTAMP - 1]) : '',
    name:         data[COL.NAME - 1]           || '',
    email:        data[COL.EMAIL - 1]          || '',
    service:      data[COL.SERVICE - 1]        || '',
    topic:        data[COL.TOPIC - 1]          || '',
    timezone:     data[COL.TIMEZONE - 1]       || '',
    preferred:    data[COL.PREFERRED_TIME - 1] || '',
    status:       data[COL.STATUS - 1]         || STATUS.NEW,
    confirmedTime:data[COL.CONFIRMED_TIME - 1] ? String(data[COL.CONFIRMED_TIME - 1]) : '',
    notes:        data[COL.NOTES - 1]          || ''
  };
}

/**
 * Called from sidebar buttons.
 * action: 'confirm' | 'propose' | 'cancel'
 */
function processBookingAction(params) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) return { ok: false, msg: 'Bookings sheet not found.' };

    var row = parseInt(params.row, 10);
    if (!row || row < 2) return { ok: false, msg: 'Invalid row.' };

    var rowData = sheet.getRange(row, 1, 1, 10).getValues()[0];
    var booking = {
      row:          row,
      name:         rowData[COL.NAME - 1]           || '',
      email:        rowData[COL.EMAIL - 1]          || '',
      service:      rowData[COL.SERVICE - 1]        || '',
      topic:        rowData[COL.TOPIC - 1]          || '',
      timezone:     rowData[COL.TIMEZONE - 1]       || '',
      preferred:    rowData[COL.PREFERRED_TIME - 1] || '',
      confirmedTime:params.datetime || '',
      notes:        params.notes    || ''
    };

    if (!booking.email) return { ok: false, msg: 'No email address found for this booking.' };

    var newStatus, bgColor, fontColor;

    if (params.action === 'confirm') {
      if (!booking.confirmedTime) return { ok: false, msg: 'Please enter a confirmed date and time.' };
      newStatus = STATUS.CONFIRMED;
      bgColor   = '#f0fdf4';
      fontColor = '#166534';
      sendConfirmationToUser(booking);
    } else if (params.action === 'propose') {
      if (!booking.confirmedTime) return { ok: false, msg: 'Please enter a proposed date and time.' };
      newStatus = STATUS.PROPOSED;
      bgColor   = '#fffbeb';
      fontColor = '#92400e';
      sendNewTimeProposalToUser(booking);
    } else if (params.action === 'cancel') {
      newStatus = STATUS.CANCELLED;
      bgColor   = '#fef2f2';
      fontColor = '#991b1b';
      sendCancellationToUser(booking);
    } else {
      return { ok: false, msg: 'Unknown action: ' + params.action };
    }

    // Update sheet
    sheet.getRange(row, COL.STATUS, 1, 1).setValue(newStatus);
    sheet.getRange(row, COL.CONFIRMED_TIME, 1, 1).setValue(booking.confirmedTime);
    sheet.getRange(row, COL.NOTES, 1, 1).setValue(booking.notes);
    sheet.getRange(row, 1, 1, 10).setBackground(bgColor);
    sheet.getRange(row, COL.STATUS, 1, 1).setFontColor(fontColor).setFontWeight('bold');

    // Notify owner that email was dispatched
    GmailApp.sendEmail(CONFIG.OWNER_EMAIL,
      '[Sent] ' + newStatus + ' email dispatched to ' + booking.name,
      newStatus + ' email sent to ' + booking.email + ' for their ' + booking.service + ' session.',
      { name: 'Portfolio Booking System' }
    );

    return { ok: true, msg: 'Done! ' + newStatus + ' email sent to ' + booking.email };

  } catch (err) {
    Logger.log('processBookingAction error: ' + err.toString());
    return { ok: false, msg: 'Error: ' + err.toString() };
  }
}

/* ── FIX DROPDOWNS (menu item) ──────────────────────────────── */

function fixStatusDropdowns() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) { SpreadsheetApp.getUi().alert('Bookings sheet not found.'); return; }
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList([STATUS.NEW, STATUS.CONFIRMED, STATUS.PROPOSED, STATUS.CANCELLED], true)
    .setAllowInvalid(false).build();
  sheet.getRange(2, COL.STATUS, Math.max(sheet.getLastRow(), 100), 1).setDataValidation(rule);
  SpreadsheetApp.getUi().alert('Status dropdowns applied to all rows.');
}

/* ── WEB APP (form submissions) ─────────────────────────────── */

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Booking endpoint is live.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ── INPUT SANITIZATION ─────────────────────────────────────── */

/**
 * Strip leading = + - @ to prevent CSV/spreadsheet formula injection.
 * Also enforce a maximum field length to prevent abuse.
 */
function sanitizeField(raw, maxLen) {
  var s = (raw || '').trim();
  if (maxLen && s.length > maxLen) s = s.substring(0, maxLen);
  // Block formula injection prefixes
  if (s && /^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return s;
}

function doPost(e) {
  try {
    var data = {
      name:           sanitizeField(e.parameter.name,           120),
      email:          sanitizeField(e.parameter.email,          200),
      topic:          sanitizeField(e.parameter.topic,          500),
      service:        sanitizeField(e.parameter.service,        200),
      timezone:       sanitizeField(e.parameter.timezone,        80),
      preferred_time: sanitizeField(e.parameter.preferred_time, 200),
      timestamp:      e.parameter.timestamp || new Date().toISOString()
    };
    // Basic email format guard
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: 'Invalid request.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    appendToSheet(data);
    sendOwnerNotification(data);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log('doPost error: ' + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: 'An error occurred. Please try again.' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* ── SHEET ──────────────────────────────────────────────────── */

function appendToSheet(data) {
  var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) { sheet = ss.insertSheet(CONFIG.SHEET_NAME); }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp','Name','Email','Service','Topic','Timezone','Preferred Time','Status','Confirmed Time','Notes']);
    var h = sheet.getRange(1,1,1,10);
    h.setFontWeight('bold'); h.setBackground(CONFIG.BRAND_COLOR);
    h.setFontColor('#ffffff'); h.setFontSize(11);
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1,200); sheet.setColumnWidth(2,160); sheet.setColumnWidth(3,220);
    sheet.setColumnWidth(4,200); sheet.setColumnWidth(5,240); sheet.setColumnWidth(6,100);
    sheet.setColumnWidth(7,160); sheet.setColumnWidth(8,160);
    sheet.setColumnWidth(9,220); sheet.setColumnWidth(10,280);
  }

  // Always ensure dropdown validation covers new rows
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList([STATUS.NEW, STATUS.CONFIRMED, STATUS.PROPOSED, STATUS.CANCELLED], true)
    .setAllowInvalid(false).build();
  var nextRow = sheet.getLastRow() + 1;
  sheet.getRange(nextRow, COL.STATUS).setDataValidation(rule);

  sheet.appendRow([
    data.timestamp, data.name, data.email, data.service,
    data.topic, data.timezone, data.preferred_time,
    STATUS.NEW, '', ''
  ]);

  var lastRow = sheet.getLastRow();
  if (lastRow % 2 === 0) { sheet.getRange(lastRow,1,1,10).setBackground('#f8f9fc'); }
}

/* ── EMAILS ─────────────────────────────────────────────────── */

function sendOwnerNotification(data) {
  var subject = '[New Booking] ' + (data.service||'Session') + ' - ' + (data.name||'Unknown');
  var html = buildEmailWrapper(
    'New Booking Request',
    'A new session has been requested via your portfolio.',
    [
      detailRow('Session',   data.service||'—', true),
      detailRow('Name',      data.name||'—'),
      detailRow('Email',     '<a href="mailto:'+esc(data.email)+'" style="color:'+CONFIG.BRAND_COLOR+';font-weight:600;">'+esc(data.email)+'</a>'),
      detailRow('Topic',     nl2br(esc(data.topic||'—'))),
      detailRow('Timezone',  data.timezone||'—'),
      detailRow('Preferred', data.preferred_time||'—'),
      detailRow('Received',  formatDate(data.timestamp))
    ],
    { label:'Open Bookings Sheet', url:'https://docs.google.com/spreadsheets/d/'+CONFIG.SHEET_ID },
    '<strong>Action:</strong> Open the sheet, click the booking row, then go to <strong>Bookings menu &rarr; Manage Selected Booking</strong> to confirm, propose a new time, or cancel.'
  );
  GmailApp.sendEmail(CONFIG.OWNER_EMAIL, subject, stripHtml(html), { htmlBody:html, name:'Portfolio Booking System' });
}

function sendConfirmationToUser(booking) {
  var subject = '[Confirmed] Your ' + (booking.service||'session') + ' with Shubhojit Chowdhury';
  var rows = [
    detailRow('Session',        booking.service||'—', true),
    detailRow('Confirmed Time', booking.confirmedTime||'Check notes below', true),
    detailRow('Your Timezone',  booking.timezone||'—'),
    detailRow('Topic',          nl2br(esc(booking.topic||'—')))
  ];
  if (booking.notes) { rows.push(detailRow('Notes from Shubhojit', nl2br(esc(booking.notes)))); }
  var html = buildEmailWrapper(
    'Your Session is Confirmed!',
    'Hi ' + esc(booking.name) + ', your session has been confirmed. See details below:',
    rows, null,
    'Please reply to this email if you need to reschedule or have any questions. Looking forward to speaking with you!'
  );
  GmailApp.sendEmail(booking.email, subject, stripHtml(html),
    { htmlBody:html, name:CONFIG.OWNER_NAME, replyTo:CONFIG.OWNER_EMAIL });
}

function sendNewTimeProposalToUser(booking) {
  var subject = '[Action Required] New time proposed for your session with Shubhojit Chowdhury';
  var rows = [
    detailRow('Session',       booking.service||'—', true),
    detailRow('Proposed Time', booking.confirmedTime||'—', true),
    detailRow('Your Timezone', booking.timezone||'—'),
    detailRow('Topic',         nl2br(esc(booking.topic||'—')))
  ];
  if (booking.notes) { rows.push(detailRow('Message from Shubhojit', nl2br(esc(booking.notes)))); }
  var html = buildEmailWrapper(
    'New Time Proposed for Your Session',
    'Hi ' + esc(booking.name) + ", the originally requested slot isn't available. Here's a proposed alternative:",
    rows,
    { label:'Reply to Accept or Suggest Another Time',
      url:'mailto:'+CONFIG.OWNER_EMAIL+'?subject=Re: '+encodeURIComponent(subject) },
    'Simply reply to this email to confirm the proposed time, or suggest an alternative that works for you.'
  );
  GmailApp.sendEmail(booking.email, subject, stripHtml(html),
    { htmlBody:html, name:CONFIG.OWNER_NAME, replyTo:CONFIG.OWNER_EMAIL });
}

function sendCancellationToUser(booking) {
  var subject = '[Cancelled] Your session request with Shubhojit Chowdhury';
  var rows = [
    detailRow('Session',       booking.service||'—', true),
    detailRow('Your Timezone', booking.timezone||'—'),
    detailRow('Topic',         nl2br(esc(booking.topic||'—')))
  ];
  if (booking.notes) { rows.push(detailRow('Reason / Message', nl2br(esc(booking.notes)))); }
  var html = buildEmailWrapper(
    'Session Request Cancelled',
    'Hi ' + esc(booking.name) + ', unfortunately this session request has been cancelled.',
    rows,
    { label:'Book Another Session', url:CONFIG.SITE_URL+'#book' },
    'Feel free to submit a new booking request at any time — I\'d still love to connect.'
  );
  GmailApp.sendEmail(booking.email, subject, stripHtml(html),
    { htmlBody:html, name:CONFIG.OWNER_NAME, replyTo:CONFIG.OWNER_EMAIL });
}

/* ── SIDEBAR HTML ───────────────────────────────────────────── */

function getSidebarHtml() {
  return '<!DOCTYPE html><html><head><meta charset="utf-8">'
  + '<style>'
  + '*{box-sizing:border-box;margin:0;padding:0}'
  + 'body{font-family:Inter,"Segoe UI",Arial,sans-serif;font-size:13px;color:#0f172a;background:#f8f9fc;}'
  + '.header{background:#4338ca;color:#fff;padding:16px 18px;}'
  + '.header h2{font-size:15px;font-weight:800;margin:0}'
  + '.header p{font-size:11px;color:rgba(255,255,255,.7);margin:3px 0 0}'
  + '#loading{padding:24px 18px;color:#64748b;text-align:center}'
  + '#error-box{display:none;margin:12px 18px;padding:10px 14px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;color:#991b1b;font-size:12px}'
  + '#content{display:none}'
  + '.booking-info{background:#fff;margin:12px;border-radius:10px;border:1px solid #e2e6ef;overflow:hidden}'
  + '.info-header{background:#eef2ff;padding:10px 14px;border-bottom:1px solid #e2e6ef}'
  + '.info-header .name{font-weight:700;font-size:14px;color:#3730a3}'
  + '.info-header .service{font-size:11px;color:#6366f1;font-weight:600;margin-top:2px}'
  + '.info-row{display:flex;padding:7px 14px;border-bottom:1px solid #f1f4f9;font-size:12px}'
  + '.info-row:last-child{border-bottom:none}'
  + '.info-label{color:#64748b;font-weight:600;width:80px;flex-shrink:0}'
  + '.info-val{color:#0f172a;line-height:1.4}'
  + '.form-section{margin:12px;background:#fff;border-radius:10px;border:1px solid #e2e6ef;padding:14px}'
  + '.form-section h3{font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px}'
  + '.form-group{margin-bottom:11px}'
  + '.form-group label{display:block;font-size:11px;font-weight:600;color:#475569;margin-bottom:4px}'
  + '.form-group input,.form-group textarea,.form-group select{width:100%;padding:8px 10px;border:1.5px solid #e2e6ef;border-radius:7px;font-size:12px;font-family:inherit;color:#0f172a;background:#f8f9fc;outline:none}'
  + '.form-group input:focus,.form-group textarea:focus{border-color:#4338ca;background:#fff}'
  + '.form-group textarea{resize:vertical;min-height:70px}'
  + '.actions{margin:12px;display:flex;flex-direction:column;gap:8px}'
  + '.btn{width:100%;padding:10px;border-radius:999px;font-size:13px;font-weight:700;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:opacity .15s}'
  + '.btn:hover{opacity:.88}'
  + '.btn:disabled{opacity:.5;cursor:not-allowed}'
  + '.btn-confirm{background:#4338ca;color:#fff}'
  + '.btn-propose{background:#d97706;color:#fff}'
  + '.btn-cancel{background:#dc2626;color:#fff}'
  + '.toast{display:none;margin:0 12px 12px;padding:10px 14px;border-radius:8px;font-size:12px;font-weight:600;text-align:center}'
  + '.toast.ok{background:#f0fdf4;border:1px solid #bbf7d0;color:#166534}'
  + '.toast.err{background:#fef2f2;border:1px solid #fecaca;color:#991b1b}'
  + '.spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}'
  + '@keyframes spin{to{transform:rotate(360deg)}}'
  + '</style></head><body>'

  + '<div class="header">'
  + '<h2>Manage Booking</h2>'
  + '<p>Select a row in the sheet, then click Refresh</p>'
  + '</div>'

  + '<div id="loading">Loading booking details...</div>'
  + '<div id="error-box"></div>'

  + '<div id="content">'
  + '  <div class="booking-info" id="booking-info"></div>'

  + '  <div class="form-section">'
  + '    <h3>Date, Time &amp; Notes</h3>'
  + '    <div class="form-group">'
  + '      <label for="f-datetime">Date &amp; Time (shown to user)</label>'
  + '      <input type="datetime-local" id="f-datetime" />'
  + '    </div>'
  + '    <div class="form-group">'
  + '      <label for="f-notes">Message / Notes to user</label>'
  + '      <textarea id="f-notes" placeholder="e.g. Zoom link, agenda, instructions..."></textarea>'
  + '    </div>'
  + '  </div>'

  + '  <div class="actions">'
  + '    <button class="btn btn-confirm" id="btn-confirm" onclick="doAction(\'confirm\')">'
  + '      &#10003; Confirm Session'
  + '    </button>'
  + '    <button class="btn btn-propose" id="btn-propose" onclick="doAction(\'propose\')">'
  + '      &#8635; Propose New Time'
  + '    </button>'
  + '    <button class="btn btn-cancel" id="btn-cancel" onclick="doAction(\'cancel\')">'
  + '      &#10005; Cancel Booking'
  + '    </button>'
  + '  </div>'

  + '  <div class="toast" id="toast"></div>'
  + '</div>'

  + '<script>'
  + 'var currentRow = null;'

  + 'function load() {'
  + '  document.getElementById("loading").style.display="block";'
  + '  document.getElementById("content").style.display="none";'
  + '  document.getElementById("error-box").style.display="none";'
  + '  google.script.run'
  + '    .withSuccessHandler(onLoaded)'
  + '    .withFailureHandler(onError)'
  + '    .getSelectedBooking();'
  + '}'

  + 'function onLoaded(b) {'
  + '  document.getElementById("loading").style.display="none";'
  + '  if (b.error) { showError(b.error); return; }'
  + '  currentRow = b.row;'
  + '  var info = document.getElementById("booking-info");'
  + '  info.innerHTML = '
  + '    "<div class=\\"info-header\\"><div class=\\"name\\">"+b.name+"</div><div class=\\"service\\">"+b.service+"</div></div>"'
  + '   +"<div class=\\"info-row\\"><span class=\\"info-label\\">Email</span><span class=\\"info-val\\">"+b.email+"</span></div>"'
  + '   +"<div class=\\"info-row\\"><span class=\\"info-label\\">Preferred</span><span class=\\"info-val\\">"+b.preferred+"</span></div>"'
  + '   +"<div class=\\"info-row\\"><span class=\\"info-label\\">Timezone</span><span class=\\"info-val\\">"+b.timezone+"</span></div>"'
  + '   +"<div class=\\"info-row\\"><span class=\\"info-label\\">Topic</span><span class=\\"info-val\\">"+b.topic+"</span></div>"'
  + '   +"<div class=\\"info-row\\"><span class=\\"info-label\\">Status</span><span class=\\"info-val\\"><b>"+b.status+"</b></span></div>";'
  + '  if (b.confirmedTime) document.getElementById("f-datetime").value = toDatetimeLocal(b.confirmedTime);'
  + '  if (b.notes) document.getElementById("f-notes").value = b.notes;'
  + '  document.getElementById("content").style.display="block";'
  + '}'

  + 'function onError(err) {'
  + '  document.getElementById("loading").style.display="none";'
  + '  showError("Script error: " + err.message);'
  + '}'

  + 'function showError(msg) {'
  + '  var el = document.getElementById("error-box");'
  + '  el.textContent = msg; el.style.display="block";'
  + '}'

  + 'function doAction(action) {'
  + '  if (!currentRow) { showToast("Please load a booking first.", false); return; }'
  + '  var dt = document.getElementById("f-datetime").value;'
  + '  var notes = document.getElementById("f-notes").value;'
  + '  if ((action==="confirm"||action==="propose") && !dt) {'
  + '    showToast("Please select a date and time first.", false); return;'
  + '  }'
  + '  if (action==="cancel" && !confirm("Cancel this booking and email the user?")) return;'
  + '  setLoading(true);'
  + '  var params = { row:currentRow, action:action, datetime:formatDatetime(dt), notes:notes };'
  + '  google.script.run'
  + '    .withSuccessHandler(function(r){ setLoading(false); showToast(r.msg, r.ok); if(r.ok) load(); })'
  + '    .withFailureHandler(function(e){ setLoading(false); showToast("Error: "+e.message, false); })'
  + '    .processBookingAction(params);'
  + '}'

  + 'function setLoading(on) {'
  + '  ["btn-confirm","btn-propose","btn-cancel"].forEach(function(id){'
  + '    document.getElementById(id).disabled = on;'
  + '  });'
  + '}'

  + 'function showToast(msg, ok) {'
  + '  var el = document.getElementById("toast");'
  + '  el.textContent = msg;'
  + '  el.className = "toast " + (ok ? "ok" : "err");'
  + '  el.style.display = "block";'
  + '  setTimeout(function(){ el.style.display="none"; }, 5000);'
  + '}'

  + 'function formatDatetime(val) {'
  + '  if (!val) return "";'
  + '  try {'
  + '    var d = new Date(val);'
  + '    return d.toLocaleString("en-IN",{weekday:"short",year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",hour12:true});'
  + '  } catch(e) { return val; }'
  + '}'

  + 'function toDatetimeLocal(str) {'
  + '  try {'
  + '    var d = new Date(str);'
  + '    if (isNaN(d)) return "";'
  + '    var pad = function(n){ return n<10?"0"+n:n; };'
  + '    return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())+"T"+pad(d.getHours())+":"+pad(d.getMinutes());'
  + '  } catch(e) { return ""; }'
  + '}'

  + 'load();'
  + '<\/script></body></html>';
}

/* ── EMAIL BUILDER ──────────────────────────────────────────── */

function buildEmailWrapper(title, subtitle, rows, cta, callout) {
  var ctaHtml = cta
    ? '<div style="text-align:center;margin:28px 0 8px;"><a href="'+cta.url
      +'" style="display:inline-block;padding:13px 28px;background:'+CONFIG.BRAND_COLOR
      +';color:#fff;font-weight:700;font-size:14px;border-radius:999px;text-decoration:none;">'
      +esc(cta.label)+'</a></div>' : '';
  var calloutHtml = callout
    ? '<div style="margin-top:22px;padding:16px 18px;background:#eef2ff;border-left:4px solid '
      +CONFIG.BRAND_COLOR+';border-radius:0 8px 8px 0;"><p style="margin:0;font-size:13px;color:#3730a3;line-height:1.6;">'
      +callout+'</p></div>' : '';
  return '<!DOCTYPE html><html><head><meta charset="utf-8"></head>'
    +'<body style="margin:0;padding:0;background:#f1f5f9;">'
    +'<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">'
    +'<tr><td align="center">'
    +'<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,.10);">'
    +'<tr><td style="background:'+CONFIG.BRAND_COLOR+';padding:28px 32px;">'
    +'<table cellpadding="0" cellspacing="0"><tr>'
    +'<td style="width:44px;height:44px;background:rgba(255,255,255,.18);border-radius:10px;text-align:center;vertical-align:middle;">'
    +'<span style="color:#fff;font-size:16px;font-weight:800;display:block;line-height:44px;">'+CONFIG.LOGO_INITIALS+'</span></td>'
    +'<td style="padding-left:14px;">'
    +'<p style="margin:0;color:#fff;font-weight:800;font-size:17px;">'+esc(CONFIG.OWNER_NAME)+'</p>'
    +'<p style="margin:3px 0 0;color:rgba(255,255,255,.7);font-size:12px;">Enterprise AI, Digital Experience &amp; Commerce Architect</p>'
    +'</td></tr></table>'
    +'<h1 style="margin:18px 0 6px;color:#fff;font-size:20px;font-weight:800;line-height:1.2;">'+esc(title)+'</h1>'
    +'<p style="margin:0;color:rgba(255,255,255,.8);font-size:13px;">'+subtitle+'</p>'
    +'</td></tr>'
    +'<tr><td style="padding:28px 32px;">'
    +'<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;font-family:Inter,Arial,sans-serif;">'
    +rows.join('')+'</table>'+calloutHtml+ctaHtml
    +'</td></tr>'
    +'<tr><td style="padding:16px 32px 24px;border-top:1px solid #e2e6ef;background:#f8f9fc;">'
    +'<p style="margin:0;font-size:11px;color:#94a3b8;text-align:center;line-height:1.6;">'
    +'Sent from <a href="'+CONFIG.SITE_URL+'" style="color:'+CONFIG.BRAND_COLOR+';">shubhojit82.github.io</a>'
    +' &nbsp;|&nbsp; Reply to <a href="mailto:'+CONFIG.OWNER_EMAIL+'" style="color:'+CONFIG.BRAND_COLOR+';">'+CONFIG.OWNER_EMAIL+'</a>'
    +'</p></td></tr>'
    +'</table></td></tr></table></body></html>';
}

function detailRow(label, value, highlight) {
  var bg = highlight ? 'background:#f5f7ff;' : '';
  return '<tr style="'+bg+'">'
    +'<td style="padding:10px 12px 10px 0;color:#64748b;font-weight:600;font-size:13px;width:140px;vertical-align:top;border-bottom:1px solid #f1f4f9;">'+esc(label)+'</td>'
    +'<td style="padding:10px 0;color:#0f172a;font-size:13px;vertical-align:top;border-bottom:1px solid #f1f4f9;">'+value+'</td>'
    +'</tr>';
}

/* ── HELPERS ────────────────────────────────────────────────── */

function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function nl2br(s) { return String(s||'').replace(/\n/g,'<br>'); }
function stripHtml(h) { return h.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }
function formatDate(ts) {
  try {
    return new Date(ts).toLocaleString('en-IN',{timeZone:'Asia/Kolkata',dateStyle:'medium',timeStyle:'short'})+' IST';
  } catch(e) { return String(ts||'—'); }
}
