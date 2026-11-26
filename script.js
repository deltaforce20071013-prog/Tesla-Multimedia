
document.addEventListener("DOMContentLoaded", function () {
  const pages = {
    dashboard: document.getElementById("dashboard-screen"),
    camera: document.getElementById("camera-screen"),
    media: document.getElementById("media-screen"),
    phone: document.getElementById("phone-screen"),
    settings: document.getElementById("settings-screen")
  };

  const buttons = document.querySelectorAll(".nav-button");

  function showPage(name) {
    if (!pages[name]) return;

    // Barcha sahifalarni yashirish
    Object.keys(pages).forEach(function (key) {
      pages[key].hidden = true;
    });

    // Kerakli sahifani ochish
    pages[name].hidden = false;

    // Menyu tugmalarini yangilash
    buttons.forEach(function (button) {
      button.classList.toggle(
        "active",
        button.dataset.page === name
      );
    });
  }

  // Pastki menyu
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      showPage(button.dataset.page);
    });
  });

  // Dashboard ichidagi Media tugmasi
  const openMedia = document.querySelector(".open-media");

  if (openMedia) {
    openMedia.addEventListener("click", function () {
      showPage("media");
    });
  }

  // Soat
  function updateClock() {
    const clock = document.getElementById("clock");

    if (!clock) return;

    const now = new Date();

    clock.textContent = now.toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  }

  updateClock();
  setInterval(updateClock, 1000);

  // Boshlang'ich sahifa
  showPage("dashboard");
});
