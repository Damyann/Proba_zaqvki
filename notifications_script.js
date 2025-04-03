
let notificationTimeout;
function showNotification(message, type) {
  const n = document.getElementById("notification");
  const dur = 4500;
  n.textContent = message;
  if (type === "error") {
    n.classList.add("error");
  } else {
    n.classList.remove("error");
  }
  
  // Ако съобщението съдържа "Вече сте маркирали", добавяме специалния клас
  if (message.indexOf("Вече сте маркирали") !== -1) {
    n.classList.add("limitNotification");
  } else {
    n.classList.remove("limitNotification");
  }
  
  n.classList.add("show");
  clearTimeout(notificationTimeout);
  notificationTimeout = setTimeout(() => {
    n.classList.remove("show");
  }, dur + 1250);
}

