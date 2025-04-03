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
  const monthMap = {"януари":1,"февруари":2,"март":3,"април":4,"май":5,"юни":6,"юли":7,"август":8,"септември":9,"октомври":10,"ноември":11,"декември":12};
  const monthNumber = monthMap[rawMonthName] || 1;
  const correctedMonthText = rawMonthName.charAt(0).toUpperCase() + rawMonthName.slice(1);
  return {row: row, year: Number(year), month: monthNumber, monthText: correctedMonthText, halfLimit: halfLimit};
}

function saveMarkedValues(row, vals, nightOpt, shiftOpt, extraShiftOpt) {
  if (row < 8 || row > 50) {
    return "Грешка: Невалиден ред!";
  }
  const sheetRequests = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Заявки");
  const sheetMonth = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Месец");
  const isChecked = sheetRequests.getRange(row, 1).getValue() === true;
  let globalLimit = sheetMonth.getRange("Q2").getValue();
  if (isChecked) {
    globalLimit = globalLimit / 2;
  }
  const allowed = ["7", "15", "23", "1", "2", "X", "7+15", "15+23", "7+23", "PH"];
  vals = vals.filter(e =>
    typeof e.day === "number" &&
    e.day >= 1 && e.day <= 31 &&
    typeof e.value === "string" &&
    allowed.includes(e.value)
  );
  const recordAll = sheetMonth.getRange("P3").getValue();
  if (!recordAll) {
    vals = vals.filter(e => e.checked || e.value === "PH");
  }
  let checkedVals = vals.filter(e => e.checked);
  if (checkedVals.length > globalLimit) {
    checkedVals = checkedVals.slice(0, globalLimit);
  }
  const unCheckedVals = vals.filter(e => !e.checked);
  vals = checkedVals.concat(unCheckedVals);

  const finNight = (!nightOpt || nightOpt === 0) ? "Без нощни" : nightOpt + " нощни";
  sheetRequests.getRange(row, 4).setValue(finNight).setFontColor("black");

  const so = String(shiftOpt).trim(); // Преобразуваме shiftOpt в стринг
  let finShift = "Няма";
  if (so === "8") finShift = "8ци";
  else if (so === "12") finShift = "12ки";
  else if (so === "16") finShift = "16ки";
  else if (so === "Смесени") finShift = "Смесени";
  sheetRequests.getRange(row, 6).setValue(finShift).setFontColor("black");

  if (extraShiftOpt) {
    sheetRequests.getRange(row, 8).setValue(extraShiftOpt).setFontColor("black");
  } else {
    sheetRequests.getRange(row, 8).clearContent();
  }

  for (let i = 0; i < 31; i++) {
    sheetRequests.getRange(row, i + 12).setValue("").setFontColor("black");
  }
  sheetRequests.getRange(row, 10)
    .setValue(new Date())
    .setNumberFormat("dd/MM/yyyy");

  vals.sort((a, b) => a.day - b.day);

  let summaryHtml = "<div class='threeColsRow' style='display:flex;justify-content:center;gap:40px;margin:0 auto;margin-bottom:15px;text-align:center;'>";
  summaryHtml += "<div><span class='label-black'>Брой нощни:</span> <span class='value-red'>" + (nightOpt || "Няма") + "</span></div>";

  let shiftText = "Няма";
  if (so === "8") shiftText = "8ци";
  else if (so === "12") shiftText = "12ки";
  else if (so === "16") shiftText = "16ки";
  else if (so === "Смесени") shiftText = "Смесени";
  summaryHtml += "<div><span class='label-black'>Вид смени:</span> <span class='value-red'>" + shiftText + "</span></div>";

  if (extraShiftOpt) {
    summaryHtml += "<div><span class='label-black'>Екстра смени:</span> <span class='value-red'>" + extraShiftOpt + "</span></div>";
  } else {
    summaryHtml += "<div><span class='label-black'>Екстра смени:</span> <span class='value-red'>—</span></div>";
  }
  summaryHtml += "</div>";

  let html = "";
  for (let i = 0; i < vals.length; i++) {
    const e = vals[i];
    const clr = e.checked ? "red" : "black";
    sheetRequests.getRange(row, e.day + 11).setValue(e.value).setFontColor(clr);

    if (i % 3 === 0) {
      html += "<div class='threeColsRow dayRow' style='display:flex;justify-content:center;gap:15px;margin-bottom:8px;'>";
    }
    html += "<div style='display:flex;align-items:center;gap:6px;'><span class='day-label'>Ден " + e.day + " :</span>";
    html += "<span class='selectedValueSquare' style='border-color:" + clr + "; color:" + clr + ";'>" + e.value + "</span></div>";
    if (i % 3 === 2 || i === vals.length - 1) {
      html += "</div>";
    }
  }
  summaryHtml += html;
  return summaryHtml;
}
