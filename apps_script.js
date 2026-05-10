// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE APPS SCRIPT — paste this entire file into your Apps Script editor
// Extensions > Apps Script > replace everything > Save > Deploy > Web App
// ─────────────────────────────────────────────────────────────────────────────

const SHEET_NAME = 'Responses';  // tab name in your spreadsheet

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    // Create the sheet and header row if it doesn't exist yet
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'timestamp', 'participant_name', 'participant_email', 'condition',
        'q', 'stimulus_id',
        'prediction', 'ground_truth', 'task_correct',
        'chosen_features', 'shap_top3', 'causal_correct', 'jaccard',
        'confidence'
      ]);
      sheet.setFrozenRows(1);
    }

    var rows = JSON.parse(e.postData.contents);
    rows.forEach(function(r) {
      sheet.appendRow([
        new Date().toISOString(),
        r.participant_name,
        r.participant_email,
        r.condition,
        r.q,
        r.stimulus_id,
        r.prediction,
        r.ground_truth,
        r.task_correct,
        r.chosen_features,
        r.shap_top3,
        r.causal_correct,
        r.jaccard,
        r.confidence
      ]);
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', rows: rows.length }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test this by running doGet — it just confirms the script is alive
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'alive' }))
    .setMimeType(ContentService.MimeType.JSON);
}
