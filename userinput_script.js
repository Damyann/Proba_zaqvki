// Глобална променлива за валидните имена
let validNames = [];

// Зареждане на валидните имена чрез fetch
function loadNames() {
  fetch('https://script.google.com/macros/s/AKfycbxH2Yz0Tr1U2kpDHp7XeCBly5SlCgA-m27Mz0UsUJVM1PxmlXnp66gVzGqrzCj9g6db/exec?fn=loadNames')
    .then(response => response.json())
    .then(n => { validNames = n; })
    .catch(error => console.error("Error:", error));
}

function checkUserCredentials() {
  const nameVal = document.getElementById("nameInput").value.trim();
  const emailVal = document.getElementById("emailInput").value.trim();
  if (!nameVal || !emailVal) {
    showNotification("Моля, попълнете и двете полета!", "error");
    return;
  }
  if (!validNames.includes(nameVal.toLowerCase())) {
    showNotification("Грешно име. Моля, опитайте отново!", "error");
    return;
  }
  userName = nameVal;
  fetch(`https://script.google.com/macros/s/AKfycbxH2Yz0Tr1U2kpDHp7XeCBly5SlCgA-m27Mz0UsUJVM1PxmlXnp66gVzGqrzCj9g6db/exec?fn=checkNameAndEmail&name=${encodeURIComponent(nameVal)}&email=${encodeURIComponent(emailVal)}`)
    .then(response => response.json())
    .then(d => {
      if (d.row > 0) {
        if (d.halfLimit) { limitNumber = Math.floor(limitNumber / 2); }
        foundRow = d.row;
        const p = nameVal.charAt(0).toUpperCase() + nameVal.slice(1).toLowerCase();
        const h = document.getElementById("calendarPanel").querySelector("h2");
        if (h) { h.textContent = "Здравейте, " + p + ". Моля, изберете датите, които са от значение за Вас."; }
        document.getElementById("namePanel").style.display = "none";
        document.getElementById("calendarPanel").style.display = "block";
        document.getElementById("optionsPanel").style.display = "block";
        document.getElementById("shiftsPanel").style.display = "block";
        document.getElementById("monthLabel").textContent = d.monthText;
        generateCalendar(d.year, d.month);
        populateNightOptionsLocal();
        populateShiftOptionsLocal();
        populateExtraShiftOptionsLocal();
      } else {
        showNotification("Грешни данни. Моля, опитайте отново!", "error");
      }
    })
    .catch(error => console.error("Error:", error));
}

function saveMarkedValues() {
  fetch('https://script.google.com/macros/s/AKfycbxH2Yz0Tr1U2kpDHp7XeCBly5SlCgA-m27Mz0UsUJVM1PxmlXnp66gVzGqrzCj9g6db/exec?fn=saveMarkedValues', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      row: foundRow,
      vals: selectedValues,
      nightOpt: selectedNightOption,
      shiftOpt: selectedShiftOption,
      extraShiftOpt: selectedExtraShiftOption
    })
  })
  .then(response => response.json())
  .then(r => {
    const cp = document.getElementById("confirmationPanel");
    const cm = document.getElementById("confirmationMessage");
    const properName = userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();
    let h = `<h2 style='font-size:28px;font-weight:bold;margin-bottom:12px;color:#8B0000;'>Здравей, ${properName}!</h2>`;
    h += "<p style='font-size:18px;margin-bottom:12px;font-weight:bold;color:black;'>Вие изпратихте следната заявка:</p>";
    h += "<div id='daysGrid'>" + r + "</div>";
    cm.innerHTML = h;
    cp.style.display = "block";
    document.getElementById("calendarPanel").style.display = "none";
    document.getElementById("optionsPanel").style.display = "none";
    document.getElementById("shiftsPanel").style.display = "none";
  })
  .catch(error => console.error("Error:", error));
}
