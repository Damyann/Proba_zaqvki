// Чете настройки от "Месец" (нощни, вид, екстра)
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
  if (s.getRange("N3").getValue() === true) return ["Да","Не"];
  return [];
}
