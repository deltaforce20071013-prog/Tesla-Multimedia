
document.addEventListener("DOMContentLoaded", () => {

  // EKRANLAR
  const dashboard = document.getElementById("main-screen");
  const cameraScreen = document.getElementById("camera-screen");

  // TUGMALAR
  const vehicleBtn = document.getElementById("vehicleBtn");
  const musicBtn = document.getElementById("musicBtn");
  const cameraBtn = document.getElementById("cameraBtn");
  const phoneBtn = document.getElementById("phoneBtn");
  const settingsBtn = document.getElementById("settingsBtn");

  // EKRAN ALMASHTIRISH
  function showScreen(screenName) {

    dashboard.hidden = screenName !== "dashboard";
    cameraScreen.hidden = screenName !== "camera";

    // Tanlangan tugmani belgilash
    document.querySelectorAll(".bottom-menu button")
      .forEach(button => button.classList.remove("active"));

    const activeButtons = {
      dashboard: vehicleBtn,
      camera: cameraBtn
    };

    if (activeButtons[screenName]) {
      activeButtons[screenName].classList.add("active");
    }
  }

  // AVTOMOBIL — ASOSIY DASHBOARD
  vehicleBtn.addEventListener("click", () => {
    showScreen("dashboard");
  });

  // KAMERA
  cameraBtn.addEventListener("click", () => {
    showScreen("camera");
  });

  // HOZIRCHA KEYINGI BOSQICHLAR UCHUN
  musicBtn.addEventListener("click", () => {
    showScreen("dashboard");
    alert("Media bo‘limi keyingi bosqichda yaratiladi.");
  });

  phoneBtn.addEventListener("click", () => {
    showScreen("dashboard");
    alert("Telefon bo‘limi keyingi bosqichda yaratiladi.");
  });

  settingsBtn.addEventListener("click", () => {
    showScreen("dashboard");
    alert("Sozlamalar keyingi bosqichda yaratiladi.");
  });

  // SOAT
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

  // BOSHLANG‘ICH EKRAN
  showScreen("dashboard");

});
