function doGet(e) {
  if (e.parameter.fn) {
    let result;
    switch (e.parameter.fn) {
      case "loadNames":
        result = loadNames();
        break;
      case "checkNameAndEmail":
        result = checkNameAndEmail(e.parameter.name, e.parameter.email);
        break;
      case "getTimerBounds":
        result = getTimerBounds();
        break;
      case "saveMarkedValues":
        // За POST заявката – очакваме данните в e.postData.contents
        let data = JSON.parse(e.postData.contents);
        result = saveMarkedValues(data.row, data.vals, data.nightOpt, data.shiftOpt, data.extraShiftOpt);
        break;
      case "getHelpText":
        result = getHelpText();
        break;
      default:
        result = { error: "Непозната функция" };
    }
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  } else {
    const tpl = HtmlService.createTemplateFromFile("index");
    return tpl.evaluate()
              .setTitle("Заявки-Добрич")
              .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

function loadNames() {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Заявки");
  return s.getRange("B8:B50").getValues().map(r => String(r[0]).toLowerCase());
}

function checkNameAndEmail(name, email) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Заявки");
  const names = sheet.getRange("B8:B50").getValues();
  const emails = sheet.getRange("C8:C50").getValues();
  let row = -1;
  for (let i = 0; i < names.length; i++) {
    if (String(names[i][0]).toLowerCase() === name.toLowerCase() &&
        String(emails[i][0]).toLowerCase() === email.toLowerCase()) {
      row = i + 8;
      break;
    }
  }
  let halfLimit = false;
  if (row >= 8) {
    const valA = sheet.getRange(row, 1).getValue();
    if (valA === true || String(valA).toLowerCase() === "true") {
      halfLimit = true;
    }
  }
  const monthSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Месец");
  const year = monthSheet.getRange("A2").getValue();
  const rawMonthName = String(monthSheet.getRange("B2").getValue()).trim().toLowerCase();
  const monthMap = {"януари":1, "февруари":2, "март":3, "април":4, "май":5, "юни":6, "юли":7, "август":8, "септември":9, "октомври":10, "ноември":11, "декември":12};
  const monthNumber = monthMap[rawMonthName] || 1;
  const correctedMonthText = rawMonthName.charAt(0).toUpperCase() + rawMonthName.slice(1);
  return { row: row, year: Number(year), month: monthNumber, monthText: correctedMonthText, halfLimit: halfLimit };
}

function getTimerBounds() {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Месец");
  return {
    start: new Date(s.getRange("C2").getValue()).toISOString(),
    end: new Date(s.getRange("D2").getValue()).toISOString()
  };
}

function getHelpText() {
  return `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:16px;">
      <div style="font-weight:bold;font-size:18px;margin-bottom:10px;">Задължителни отметки!</div>
      <div>1. Брой нощни 🌙<br>2. Вид смени ⏰</div>
    </div>
  `;
}

function getNightOptions() {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Месец");
  const vals = s.getRange("E2:I2").getValues()[0];
  const checks = s.getRange("E3:I3").getValues()[0];
  return vals.filter((_, i) => checks[i] === true);
}

function getShiftOptions() {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Месец");
  const vals = s.getRange("J2:L2").getValues()[0];
  const checks = s.getRange("J3:L3").getValues()[0];
  const arr = [];
  for (let i = 0; i < vals.length; i++) {
    if (checks[i] === true) arr.push(vals[i]);
  }
  const extraVal = s.getRange("M2").getValue();
  const extraCheck = s.getRange("M3").getValue();
  if (extraCheck === true && extraVal) arr.push(extraVal);
  return arr;
}

function getExtraShiftOptions() {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Месец");
  if (s.getRange("N3").getValue() === true) return ["Да", "Не"];
  return [];
}

function getCalendarShiftData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Месец");
  const data = sheet.getRange("Q2:S11").getValues();
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const name = data[i][0];
    const active = data[i][1];
    const factor = data[i][2];
    if (active === true && name) {
      result.push({
        name: String(name),
        factor: Number(factor)
      });
    }
  }
  return result;
}

function saveMarkedValues(row, vals, nightOpt, shiftOpt, extraShiftOpt) {
  // Добави логика за записване в Spreadsheet-а.
  return "<div>Примерно резюме на заявката</div>";
}
