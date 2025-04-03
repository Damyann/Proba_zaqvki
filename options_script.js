
const populateNightOptionsLocal = () => {
  selectedNightOption = null;
  const c = document.getElementById("nightOptionsList");
  c.innerHTML = "";
  nightOptionsData.forEach(o => {
    const l = document.createElement("label");
    l.classList.add("option-label");
    const leftPart = document.createElement("div");
    leftPart.classList.add("leftPart");
    const r = document.createElement("input");
    r.type = "radio"; 
    r.name = "nightOption"; 
    r.value = o; 
    r.classList.add("option-input");
    r.onclick = () => { selectedNightOption = o; updateSendButtonState(); };
    leftPart.appendChild(r);
    const s = document.createElement("span");
    s.classList.add("option-text"); 
    s.textContent = o;
    leftPart.appendChild(s);
    l.appendChild(leftPart);
    c.appendChild(l);
  });
};

const populateShiftOptionsLocal = () => {
  selectedShiftOption = null;
  const c = document.getElementById("shiftOptionsList");
  c.innerHTML = "";
  shiftOptionsData.forEach(o => {
    const l = document.createElement("label");
    l.classList.add("option-label");
    const leftPart = document.createElement("div");
    leftPart.classList.add("leftPart");
    const r = document.createElement("input");
    r.type = "radio"; 
    r.name = "shiftOption"; 
    r.value = o; 
    r.classList.add("option-input");
    r.onclick = () => { selectedShiftOption = o; updateSendButtonState(); };
    leftPart.appendChild(r);
    const s = document.createElement("span");
    s.classList.add("option-text"); 
    s.textContent = o;
    leftPart.appendChild(s);
    l.appendChild(leftPart);
    if (o === "Смесени") {
      const i = document.createElement("span");
      i.classList.add("info-icon"); 
      i.textContent = "i";
      const t = document.createElement("span");
      t.classList.add("shift-tooltip");
      t.textContent = "Смесеният график включва 12-часови дневни и нощни смени";
      i.appendChild(t);
      i.addEventListener("mousedown", e => { e.stopPropagation(); e.preventDefault(); });
      i.addEventListener("click", e => {
        e.stopPropagation(); e.preventDefault();
        t.classList.toggle("visible");
      });
      l.appendChild(i);
    }
    c.appendChild(l);
  });
};

const populateExtraShiftOptionsLocal = () => {
  selectedExtraShiftOption = null;
  const c = document.getElementById("extraShiftOptionsList");
  c.innerHTML = "";
  if (!extraShiftOptionsData || !extraShiftOptionsData.length) {
    document.getElementById("extraShiftOptions").style.display = "none";
    return;
  }
  document.getElementById("extraShiftOptions").style.display = "block";
  extraShiftOptionsData.forEach(o => {
    const l = document.createElement("label");
    l.classList.add("option-label");
    const leftPart = document.createElement("div");
    leftPart.classList.add("leftPart");
    const r = document.createElement("input");
    r.type = "radio"; 
    r.name = "extraShiftOption"; 
    r.value = o; 
    r.classList.add("option-input");
    r.onclick = () => { selectedExtraShiftOption = o; updateSendButtonState(); };
    leftPart.appendChild(r);
    const s = document.createElement("span");
    s.classList.add("option-text"); 
    s.textContent = o;
    leftPart.appendChild(s);
    l.appendChild(leftPart);
    if (o === "Да") {
      const i = document.createElement("span");
      i.classList.add("info-icon"); 
      i.textContent = "i";
      const t = document.createElement("span");
      t.classList.add("extraShift-tooltip");
      t.textContent = "Ще се дават допълнителни смени ако не достигат хора в графика";
      i.appendChild(t);
      i.addEventListener("mousedown", e => { e.stopPropagation(); e.preventDefault(); });
      i.addEventListener("click", e => {
        e.stopPropagation(); e.preventDefault();
        t.classList.toggle("visible");
      });
      l.appendChild(i);
    }
    c.appendChild(l);
  });
};

document.addEventListener("click", e => {
  const v = document.querySelectorAll(".night-tooltip.visible, .shift-tooltip.visible, .extraShift-tooltip.visible");
  v.forEach(tt => { if (!tt.parentElement.contains(e.target)) tt.classList.remove("visible"); });
});
