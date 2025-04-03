
// Глобални променливи и логика за бутоните
let foundRow = -1, selectedValues = [], userName = "";
let selectedNightOption = null, selectedShiftOption = null, selectedExtraShiftOption = null;

const updateSendButtonState = () => {
  const b = document.getElementById("sendButton");
  b.disabled = (selectedNightOption == null || selectedShiftOption == null);
};

