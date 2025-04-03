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
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "GET, POST")
      .setHeader("Access-Control-Allow-Headers", "Content-Type");
  } else {
    const tpl = HtmlService.createTemplateFromFile("index");
    return tpl.evaluate()
              .setTitle("Заявки-Добрич")
              .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

// Останалите функции остават същите, както преди:
// loadNames, checkNameAndEmail, getTimerBounds, getHelpText,
// getNightOptions, getShiftOptions, getExtraShiftOptions, getCalendarShiftData, saveMarkedValues.
