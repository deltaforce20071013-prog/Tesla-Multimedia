
const dashboard = document.getElementById("main-screen");
const cameraScreen = document.getElementById("camera-screen");

const vehicleBtn = document.getElementById("vehicleBtn");
const cameraBtn = document.getElementById("cameraBtn");

function showScreen(screen) {
  dashboard.hidden = screen !== "dashboard";
  cameraScreen.hidden = screen !== "camera";
}

vehicleBtn.addEventListener("click", () => {
  showScreen("dashboard");
});

cameraBtn.addEventListener("click", () => {
  showScreen("camera");
});

// Real vaqt soati
function updateClock() {
  const now = new Date();

  document.getElementById("clock").textContent =
    now.toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
}

updateClock();
setInterval(updateClock, 1000);
