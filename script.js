
// TESLA MULTIMEDIA SYSTEM

// 1. Haqiqiy vaqt
function updateClock() {
  const now = new Date();

  document.getElementById("clock").textContent =
    now.toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit"
    });
}

updateClock();
setInterval(updateClock, 1000);


// 2. Menyu boshqaruvi
const sections = [
  "vehicle-section",
  "navigation-section",
  "music-section"
];

const menuButtons = document.querySelectorAll(
  ".bottom-menu button"
);

menuButtons.forEach((button, index) => {
  button.addEventListener("click", () => {

    if (index === 0) {
      showSection("vehicle-section");
    }

    if (index === 1) {
      showSection("navigation-section");
    }

    if (index === 2) {
      showSection("music-section");
    }

    if (index === 3) {
      alert("Phone interface coming soon");
    }

    if (index === 4) {
      alert("Settings coming soon");
    }

  });
});

function showSection(sectionId) {
  sections.forEach(id => {
    const section = document.getElementById(id);

    section.style.display =
      id === sectionId ? "block" : "none";
  });
}

console.log("Tesla Multimedia System loaded!");
