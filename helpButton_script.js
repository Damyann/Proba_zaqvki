let helpIsOpen = false;
function initHelpButton() {
  const btn = document.getElementById("helpButton");
  if (!btn) return;
  btn.textContent = "ℹ";
  fetch('https://script.google.com/macros/s/AKfycbxH2Yz0Tr1U2kpDHp7XeCBly5SlCgA-m27Mz0UsUJVM1PxmlXnp66gVzGqrzCj9g6db/exec?fn=getHelpText')
    .then(response => response.text())
    .then(txt => {
      const b = document.getElementById("helpBalloon");
      if (b) b.innerHTML = txt;
    })
    .catch(error => console.error("Error:", error));
}
function toggleHelpBalloon() {
  const b = document.getElementById("helpBalloon");
  if (!b) return;
  helpIsOpen = !helpIsOpen;
  if (helpIsOpen) {
    b.classList.add("visible", "fadeIn");
  } else {
    b.classList.remove("visible", "fadeIn");
  }
  const btn = document.getElementById("helpButton");
  if (btn) btn.style.animation = "none";
}
document.addEventListener("click", e => {
  if (helpIsOpen) {
    const balloon = document.getElementById("helpBalloon");
    const helpBtn = document.getElementById("helpButton");
    if (balloon && !balloon.contains(e.target) && !helpBtn.contains(e.target)) {
      toggleHelpBalloon();
    }
  }
});
