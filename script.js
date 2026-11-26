
document.addEventListener("DOMContentLoaded", () => {
  const pages = {
    dashboard: document.getElementById("dashboard-screen"),
    camera: document.getElementById("camera-screen"),
    media: document.getElementById("media-screen"),
    phone: document.getElementById("phone-screen"),
    settings: document.getElementById("settings-screen")
  };

  const buttons = document.querySelectorAll(".nav-button");

  function showPage(pageName) {
    if (!pages[pageName]) return;

    // Barcha sahifalarni yashirish
    Object.values(pages).forEach(page => {
      page.hidden = true;
      page.classList.remove("active");
    });

    // Tanlangan sahifani ko'rsatish
    pages[pageName].hidden = false;
    pages[pageName].classList.add("active");

    // Pastki menyu holatini yangilash
    buttons.forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.page === pageName
      );
    });
  }

  // Pastki menyu tugmalari
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      showPage(button.dataset.page);
    });
  });

  // Dashboard ichidagi OPEN MEDIA tugmasi
  document.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", () => {
      showPage(button.dataset.page);
    });
  });

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

  // Dastur ochilganda Dashboard
  showPage("dashboard");
});
