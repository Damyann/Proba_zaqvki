
function generateCalendar(year, month) {
  const cal = document.getElementById("calendar");
  cal.innerHTML = "";
  selectedValues = [];
  
  function formatShifts(num) {
    return Number.isInteger(num) ? num.toString() : num.toFixed(1);
  }
  
  const lastDay = new Date(year, month, 0).getDate();
  for (let d = 1; d <= lastDay; d++) {
    const date = new Date(year, month - 1, d);
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    if ([0, 6].includes(date.getDay())) {
      dayDiv.classList.add("weekend");
    }
    const dayNumber = document.createElement("div");
    dayNumber.classList.add("dayNumber");
    dayNumber.textContent = d;
    dayNumber.style.position = "relative";
    dayNumber.style.top = "-10px";
    dayNumber.style.fontSize = "18px";
    dayDiv.appendChild(dayNumber);
    
    const isActive = (dayStatus[d] === true);
    if (!isActive) {
      dayDiv.style.backgroundColor = "#fff";
      dayDiv.style.pointerEvents = "none";
      const cross = document.createElement("div");
      cross.textContent = "✖";
      cross.style.position = "absolute";
      cross.style.top = "50%";
      cross.style.left = "50%";
      cross.style.transform = "translate(-50%, -50%)";
      cross.style.fontSize = "55px";
      cross.style.color = "#FF0000";
      dayDiv.appendChild(cross);
    } else {
      const sel = document.createElement("select");
      sel.style.width = "75px";
      sel.style.height = "24px";
      sel.style.fontSize = "18px";
      sel.style.marginTop = "-12px";
      let optionsHTML = "<option value=''>--</option>";
      calendarShiftsData.forEach(sh => {
        optionsHTML += `<option value="${sh.name}">${sh.name}</option>`;
      });
      sel.innerHTML = optionsHTML;
      sel.addEventListener("change", function() {
        if (this.value === "PH") {
          radio.disabled = true;
          radio.checked = false;
          radio._wasChecked = false;
          sel.classList.remove("marked");
        } else {
          radio.disabled = false;
        }
        const isMarked = radio._wasChecked;
        updateDayItem(d, this.value, isMarked);
        if (isMarked) {
          sel.classList.add("marked");
        } else {
          sel.classList.remove("marked");
        }
        recalcShifts();
      });
      
      const selectContainer = document.createElement("div");
      selectContainer.style.display = "flex";
      selectContainer.style.justifyContent = "center";
      selectContainer.appendChild(sel);
      dayDiv.appendChild(selectContainer);
      
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "radioDay_" + d;
      radio.classList.add("dayCheckbox");
      radio._wasChecked = false;
      radio.addEventListener("click", function() {
        if (sel.value === "PH") {
          radio.checked = false;
          radio._wasChecked = false;
          return;
        }
        if (this._wasChecked) {
          this.checked = false;
          this._wasChecked = false;
          updateDayItem(d, sel.value, false);
          sel.classList.remove("marked");
        } else {
          if (limitActive) {
            const alreadyChecked = selectedValues.filter(e => e.checked).length;
            if (alreadyChecked >= limitNumber) {
              showNotification("Вече сте маркирали " + limitNumber + " тикчета!", "error");
              this.checked = false;
              return;
            }
          }
          this._wasChecked = true;
          updateDayItem(d, sel.value, true);
          sel.classList.add("marked");
        }
        recalcShifts();
      });
      
      const radioContainer = document.createElement("div");
      radioContainer.style.display = "flex";
      radioContainer.style.justifyContent = "center";
      radioContainer.style.marginTop = "5px";
      radioContainer.appendChild(radio);
      dayDiv.appendChild(radioContainer);
    }
    cal.appendChild(dayDiv);
  }
  
  function updateDayItem(d, newVal, newChecked) {
    let idx = selectedValues.findIndex(e => e.day === d);
    if (idx === -1) {
      selectedValues.push({ day: d, value: newVal || "", checked: newChecked || false });
    } else {
      selectedValues[idx].value = newVal;
      selectedValues[idx].checked = newChecked;
    }
    const item = selectedValues.find(e => e.day === d);
    if (item && !item.value && !item.checked) {
      selectedValues = selectedValues.filter(e => e.day !== d);
    }
  }
  
  function recalcShifts() {
    let normalSum = 0;
    let phCount = 0;
    let nightCount = 0;
    let dayCount = 0;
    const nightShiftValues = ["2", "23", "15+23", "7+23"];
    const dayShiftValues = ["7", "1", "15", "7+15", "7+23"];
    
    selectedValues.forEach(e => {
      const shiftObj = calendarShiftsData.find(sh => sh.name === e.value);
      if (shiftObj) {
        if (e.value === "PH") {
          phCount++;
        } else {
          normalSum += shiftObj.factor;
        }
      }
      if (nightShiftValues.includes(e.value)) {
        nightCount++;
      }
      if (dayShiftValues.includes(e.value)) {
        dayCount++;
      }
    });
    
    let totalNormal = normalSum <= 22 ? normalSum : 22 + (normalSum - 22) * 1.5;
    let total = totalNormal + phCount;
    
    const counterEl = document.getElementById("shiftCounter");
    if (counterEl) {
      counterEl.innerHTML = "Shifts: " + formatShifts(normalSum + phCount) +
        "<br>Total: <span id='totalDisplay'>" + formatTotal(total) + "</span>" +
        "<br>Нощни: " + nightCount +
        "<br>Дневни: " + dayCount +
        "<br>Отпуски: " + phCount;
      const totalDisplayEl = document.getElementById("totalDisplay");
      if (total > 22) totalDisplayEl.classList.add("total-above");
      else totalDisplayEl.classList.remove("total-above");
    }
    
    if (limitActive) {
      const alreadyChecked = selectedValues.filter(e => e.checked).length;
      const remaining = limitNumber - alreadyChecked;
      const remainingEl = document.getElementById("remainingCount");
      const containerEl = document.getElementById("remainingCountContainer");
      if (remainingEl && containerEl) {
        remainingEl.textContent = "Важни дати: " + remaining;
        remainingEl.style.fontSize = "20px";
        if (remaining === 0) {
          remainingEl.classList.add("zero");
          containerEl.classList.add("blink");
        } else {
          remainingEl.classList.remove("zero");
          containerEl.classList.remove("blink");
        }
      }
    }
  }
  
  function formatTotal(total) {
    const epsilon = 1e-8;
    let intPart = Math.floor(total);
    let frac = total - intPart;
    if (Math.abs(frac) < epsilon) {
      return intPart.toString();
    } else if (Math.abs(frac - 0.5) < epsilon) {
      return total.toFixed(1);
    } else if (Math.abs(frac - 0.25) < epsilon || Math.abs(frac - 0.75) < epsilon) {
      return total.toFixed(2);
    } else {
      return total.toFixed(2);
    }
  }
  
  function formatShifts(num) {
    return Number.isInteger(num) ? num.toString() : num.toFixed(1);
  }
}

