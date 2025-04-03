function hideOutsideTimeInfo() {
  const i = document.getElementById("outsideTimeInfo");
  if (i) i.classList.remove("visible");
}

function showOutsideTimeInfo() {
  const i = document.getElementById("outsideTimeInfo");
  if (i) i.classList.add("visible");
}

function flashTimer() {
  const c = document.getElementById("timerContainer");
  if (!c) return;
  let times = 6;
  const intId = setInterval(() => {
    c.classList.toggle("flash-border");
    times--;
    if (times <= 0) {
      clearInterval(intId);
      c.classList.remove("flash-border");
      showOutsideTimeInfo();
    }
  }, 300);
}

function updateTimer() {
  let now = new Date();
  now = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 2 * 3600000);
  const start = new Date(timerStart), end = new Date(timerEnd);
  const d = document.getElementById("timerDisplay");
  if (!d) return;
  if (now < start || now > end) {
    d.innerHTML = "Заявките са затворени!";
    d.classList.remove("timer-open");
    d.classList.add("timer-closed");
    timerClosed = true;
  } else {
    let diff = Math.max(end - now, 0);
    const ds = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hs = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const ms = Math.floor((diff / (1000 * 60)) % 60);
    const ss = Math.floor((diff / 1000) % 60);
    d.innerHTML = "Оставащо време:<div class='timer-text'>" +
      (ds > 0 ? ds + "д " : "") +
      (hs > 0 || ds > 0 ? hs + "ч " : "") +
      ms + "м " + ss + "с</div>";
    d.classList.remove("timer-closed");
    d.classList.add("timer-open");
    timerClosed = false;
    hideOutsideTimeInfo();
  }
}
setInterval(updateTimer, 1000);
updateTimer();

// Използваме fetch за обновяване на таймер границите
setInterval(() => {
  fetch('https://script.google.com/macros/s/AKfycbxH2Yz0Tr1U2kpDHp7XeCBly5SlCgA-m27Mz0UsUJVM1PxmlXnp66gVzGqrzCj9g6db/exec?fn=getTimerBounds')
    .then(response => response.json())
    .then(b => {
      if (b.start !== timerStart || b.end !== timerEnd) {
        timerStart = b.start;
        timerEnd = b.end;
      }
    })
    .catch(error => console.error("Error:", error));
}, 15000);

document.addEventListener("click", e => {
  if (timerClosed && e.target.tagName === "BUTTON") {
    flashTimer();
    e.preventDefault();
    e.stopPropagation();
  }
}, true);
