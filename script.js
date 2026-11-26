/* TESLA MULTIMEDIA SYSTEM */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const $ = id => document.getElementById(id);

  const pageNames = [
    "dashboard",
    "vehicle",
    "navigation",
    "media",
    "camera",
    "phone",
    "settings"
  ];

  const pages = {};
  pageNames.forEach(name => pages[name] = $(name));

  let mapInstance = null;
  let userMarker = null;
  let placeMarker = null;
  let markerMode = false;
  let audioFiles = [];
  let audioIndex = -1;
  let savedContacts = [];

  const audio = $("audioPlayer");
  const navButtons = [...document.querySelectorAll(".nav-btn")];

  /* PAGE NAVIGATION */

  function openPage(name) {
    if (!pages[name]) return;

    pageNames.forEach(page => {
      if (pages[page]) {
        pages[page].hidden = page !== name;
      }
    });

    if ($("callScreen")) {
      $("callScreen").hidden = true;
    }

    navButtons.forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.page === name
      );
    });

    if (name === "navigation") {
      setTimeout(createMap, 200);
    }
  }

  navButtons.forEach(button => {
    button.addEventListener("click", () => {
      openPage(button.dataset.page);
    });
  });

  document.querySelectorAll("[data-open]").forEach(button => {
    button.addEventListener("click", () => {
      openPage(button.dataset.open);
    });
  });

  document.querySelectorAll("[data-back]").forEach(button => {
    button.addEventListener("click", () => {
      openPage("dashboard");
    });
  });

  /* CLOCK */

  function updateClock() {
    const clock = $("clock");

    if (clock) {
      clock.textContent = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
    }
  }

  updateClock();
  setInterval(updateClock, 1000);

  /* VEHICLE ROTATION */

  function changeVehicleAngle(value) {
    const angle = Number(value) || 0;

    if ($("rotation")) {
      $("rotation").value = angle;
    }

    if ($("rotatingCar")) {
      $("rotatingCar").style.transform =
        "rotate(" + angle + "deg)";
    }

    if ($("angleLabel")) {
      $("angleLabel").textContent =
        angle === 0
          ? "TOP VIEW · 0°"
          : "ROTATED VIEW · " + angle + "°";
    }
  }

  if ($("rotation")) {
    $("rotation").addEventListener("input", event => {
      changeVehicleAngle(event.target.value);
    });
  }

  document.querySelectorAll("[data-angle]").forEach(button => {
    button.addEventListener("click", () => {
      changeVehicleAngle(button.dataset.angle);
    });
  });

  /* MAP */

  function createMap() {
    if (mapInstance || !window.L || !$("liveMap")) return;

    mapInstance = L.map("liveMap").setView(
      [39.6542, 66.9597],
      13
    );

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
      }
    ).addTo(mapInstance);

    mapInstance.on("click", event => {
      if (!markerMode) return;

      markerMode = false;

      selectMapPoint(
        event.latlng.lat,
        event.latlng.lng,
        "Dropped marker"
      );
    });

    setTimeout(() => {
      mapInstance.invalidateSize();
    }, 300);
  }

  function selectMapPoint(latitude, longitude, title) {
    if (!mapInstance) return;

    if (placeMarker) {
      mapInstance.removeLayer(placeMarker);
    }

    placeMarker = L.marker([
      latitude,
      longitude
    ]).addTo(mapInstance);

    if ($("placeName")) {
      $("placeName").textContent = title;
    }

    if ($("placeDetails")) {
      $("placeDetails").textContent =
        "Selected point on the map.";
    }

    if ($("placeCoords")) {
      $("placeCoords").textContent =
        "Coordinates: " +
        latitude.toFixed(5) +
        ", " +
        longitude.toFixed(5);
    }

    mapInstance.setView([latitude, longitude], 16);
  }

  if ($("locateBtn")) {
    $("locateBtn").addEventListener("click", () => {
      if (!navigator.geolocation) {
        if ($("gpsStatus")) {
          $("gpsStatus").textContent = "GPS NOT SUPPORTED";
        }
        return;
      }

      if ($("gpsStatus")) {
        $("gpsStatus").textContent = "GPS SEARCHING...";
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          createMap();

          if (!mapInstance) return;

          if (userMarker) {
            mapInstance.removeLayer(userMarker);
          }

          userMarker = L.circleMarker(
            [latitude, longitude],
            {
              radius: 9,
              color: "#ffffff",
              weight: 3,
              fillColor: "#168cff",
              fillOpacity: 1
            }
          ).addTo(mapInstance);

          mapInstance.setView(
            [latitude, longitude],
            16
          );

          if ($("gpsStatus")) {
            $("gpsStatus").textContent = "GPS FOUND";
          }

          if ($("dashCoords")) {
            $("dashCoords").textContent =
              latitude.toFixed(3) +
              ", " +
              longitude.toFixed(3);
          }

          selectMapPoint(
            latitude,
            longitude,
            "Your location"
          );
        },

        () => {
          if ($("gpsStatus")) {
            $("gpsStatus").textContent =
              "GPS PERMISSION NEEDED";
          }

          if ($("placeDetails")) {
            $("placeDetails").textContent =
              "Allow location permission in your browser.";
          }
        },

        {
          enableHighAccuracy: true,
          timeout: 12000
        }
      );
    });
  }

  if ($("dropPin")) {
    $("dropPin").addEventListener("click", () => {
      markerMode = true;

      if ($("placeDetails")) {
        $("placeDetails").textContent =
          "Tap the map to place a marker.";
      }
    });
  }

  async function searchMapPlace() {
    const query = $("placeSearch")
      ? $("placeSearch").value.trim()
      : "";

    if (!query) return;

    if ($("placeDetails")) {
      $("placeDetails").textContent = "Searching...";
    }

    try {
      const url =
        "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=" +
        encodeURIComponent(query);

      const response = await fetch(url);
      const results = await response.json();

      if (!results.length) {
        $("placeDetails").textContent = "No result found.";
        return;
      }

      createMap();

      const result = results[0];

      selectMapPoint(
        Number(result.lat),
        Number(result.lon),
        result.name || "Search result"
      );

      if ($("placeDetails")) {
        $("placeDetails").textContent =
          result.display_name;
      }

    } catch (error) {
      if ($("placeDetails")) {
        $("placeDetails").textContent =
          "Search failed. Check internet connection.";
      }
    }
  }

  if ($("searchPlace")) {
    $("searchPlace").addEventListener(
      "click",
      searchMapPlace
    );
  }

  if ($("placeSearch")) {
    $("placeSearch").addEventListener("keydown", event => {
      if (event.key === "Enter") {
        searchMapPlace();
      }
    });
  }

  /* MUSIC PLAYER */

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

    return minutes + ":" + remainder;
  }

  function updateTrackLabels() {
    const file = audioFiles[audioIndex];

    const title = file
      ? file.name.replace(/\.[^/.]+$/, "")
      : "No music selected";

    if ($("mediaTrack")) {
      $("mediaTrack").textContent = title;
    }

    if ($("dashTrack")) {
      $("dashTrack").textContent = title;
    }

    if ($("mediaArtist")) {
      $("mediaArtist").textContent =
        file ? "Local audio file" : "Choose an audio file";
    }

    if ($("dashArtist")) {
      $("dashArtist").textContent =
        file ? "Local audio file" : "Choose an audio file";
    }

    document.querySelectorAll(".playlist-item")
      .forEach((item, index) => {
        item.classList.toggle(
          "selected",
          index === audioIndex
        );
      });
  }

  function drawPlaylist() {
    const list = $("playlist");

    if (!list) return;

    list.innerHTML = "";

    if (!audioFiles.length) {
      list.innerHTML =
        '<div class="empty-state">Your playlist is empty</div>';
    } else {
      audioFiles.forEach((file, index) => {
        const item = document.createElement("button");

        item.type = "button";
        item.className = "playlist-item";
        item.textContent = (index + 1) + ". " + file.name;

        item.addEventListener("click", () => {
          playAudioAt(index);
        });

        list.appendChild(item);
      });
    }

    updateTrackLabels();
  }

  function playAudioAt(index) {
    if (!audioFiles.length || !audio) return;

    audioIndex =
      (index + audioFiles.length) % audioFiles.length;

    audio.src = URL.createObjectURL(
      audioFiles[audioIndex]
    );

    audio.play().then(() => {
      if ($("playTrack")) {
        $("playTrack").textContent = "Ⅱ";
      }

      if ($("dashPlay")) {
        $("dashPlay").textContent = "Ⅱ";
      }
    }).catch(() => {
      if ($("mediaArtist")) {
        $("mediaArtist").textContent =
          "Press play to start this file.";
      }
    });

    updateTrackLabels();
  }

  function toggleAudio() {
    if (!audioFiles.length) {
      openPage("media");

      if ($("audioFiles")) {
        $("audioFiles").click();
      }

      return;
    }

    if (audio.paused) {
      if (!audio.src) {
        playAudioAt(Math.max(audioIndex, 0));
      } else {
        audio.play();
      }

      if ($("playTrack")) {
        $("playTrack").textContent = "Ⅱ";
      }

      if ($("dashPlay")) {
        $("dashPlay").textContent = "Ⅱ";
      }

    } else {
      audio.pause();

      if ($("playTrack")) {
        $("playTrack").textContent = "▶";
      }

      if ($("dashPlay")) {
        $("dashPlay").textContent = "▶";
      }
    }
  }

  if ($("audioFiles")) {
    $("audioFiles").addEventListener("change", event => {
      audioFiles = audioFiles.concat(
        Array.from(event.target.files || [])
      );

      drawPlaylist();

      if (audioIndex < 0 && audioFiles.length) {
        playAudioAt(0);
      }

      event.target.value = "";
    });
  }

  ["playTrack", "dashPlay"].forEach(id => {
    if ($(id)) {
      $(id).addEventListener("click", toggleAudio);
    }
  });

  ["prevTrack", "dashPrev"].forEach(id => {
    if ($(id)) {
      $(id).addEventListener("click", () => {
        playAudioAt(audioIndex - 1);
      });
    }
  });

  ["nextTrack", "dashNext"].forEach(id => {
    if ($(id)) {
      $(id).addEventListener("click", () => {
        playAudioAt(audioIndex + 1);
      });
    }
  });

  if (audio) {
    audio.addEventListener("timeupdate", () => {
      if ($("currentTime")) {
        $("currentTime").textContent =
          formatTime(audio.currentTime);
      }

      if ($("duration")) {
        $("duration").textContent =
          formatTime(audio.duration);
      }

      const progress = audio.duration
        ? (audio.currentTime / audio.duration) * 100
        : 0;

      if ($("seekBar")) {
        $("seekBar").value = progress;
      }

      if ($("dashProgress")) {
        $("dashProgress").style.width =
          progress + "%";
      }
    });

    audio.addEventListener("ended", () => {
      playAudioAt(audioIndex + 1);
    });
  }

  if ($("seekBar")) {
    $("seekBar").addEventListener("input", () => {
      if (audio && audio.duration) {
        audio.currentTime =
          audio.duration *
          Number($("seekBar").value) / 100;
      }
    });
  }

  if ($("volume") && audio) {
    $("volume").addEventListener("input", () => {
      audio.volume = Number($("volume").value);
    });
  }

  /* CAMERA DEMO */

  document.querySelectorAll("[data-camera]")
    .forEach(button => {
      button.addEventListener("click", () => {
        document.querySelectorAll("[data-camera]")
          .forEach(item => {
            item.classList.remove("selected");
          });

        button.classList.add("selected");

        const mode = button.dataset.camera || "360";

        if ($("cameraPreview")) {
          $("cameraPreview").textContent =
            mode === "360"
              ? "360° SURROUND DEMO"
              : mode.toUpperCase() + " CAMERA DEMO";
        }
      });
    });

  /* PHONE */

  function drawContacts() {
    const list = $("contactList");

    if (!list) return;

    list.innerHTML = "";

    savedContacts.forEach(contact => {
      const item = document.createElement("button");

      item.type = "button";
      item.className = "contact-item";
      item.textContent =
        contact.name + " · " + contact.number;

      item.addEventListener("click", () => {
        if ($("dialNumber")) {
          $("dialNumber").value = contact.number;
        }
      });

      list.appendChild(item);
    });
  }

  if ($("addContact")) {
    $("addContact").addEventListener("click", () => {
      const name = $("contactName").value.trim();
      const number = $("contactNumber").value.trim();

      if (!name || !number) return;

      savedContacts.push({ name, number });

      $("contactName").value = "";
      $("contactNumber").value = "";

      drawContacts();
    });
  }

  document.querySelectorAll("[data-digit]")
    .forEach(button => {
      button.addEventListener("click", () => {
        if ($("dialNumber")) {
          $("dialNumber").value += button.dataset.digit;
        }
      });
    });

  if ($("deleteDigit")) {
    $("deleteDigit").addEventListener("click", () => {
      if ($("dialNumber")) {
        $("dialNumber").value =
          $("dialNumber").value.slice(0, -1);
      }
    });
  }

  function showCallScreen(status, name, number) {
    pageNames.forEach(page => {
      if (pages[page]) {
        pages[page].hidden = true;
      }
    });

    if ($("callScreen")) {
      $("callScreen").hidden = false;
    }

    if ($("callStatus")) {
      $("callStatus").textContent = status;
    }

    if ($("callerName")) {
      $("callerName").textContent = name;
    }

    if ($("callerNumber")) {
      $("callerNumber").textContent =
        number || "Unknown number";
    }
  }

  if ($("callBtn")) {
    $("callBtn").addEventListener("click", () => {
      const number = $("dialNumber")
        ? $("dialNumber").value.trim()
        : "";

      if (number) {
        showCallScreen(
          "CALLING…",
          number,
          number
        );
      }
    });
  }

  if ($("incomingDemo")) {
    $("incomingDemo").addEventListener("click", () => {
      showCallScreen(
        "INCOMING CALL",
        "Demo caller",
        "+998 90 000 00 00"
      );
    });
  }

  if ($("acceptCall")) {
    $("acceptCall").addEventListener("click", () => {
      if ($("callStatus")) {
        $("callStatus").textContent =
          "CALL CONNECTED · DEMO";
      }
    });
  }

  if ($("endCall")) {
    $("endCall").addEventListener("click", () => {
      openPage("phone");
    });
  }

  /* SETTINGS */

  if ($("accentColor")) {
    $("accentColor").addEventListener("input", () => {
      document.documentElement.style.setProperty(
        "--accent",
        $("accentColor").value
      );
    });
  }

  if ($("themeSelect")) {
    $("themeSelect").addEventListener("change", () => {
      document.body.classList.toggle(
        "light",
        $("themeSelect").value === "light"
      );
    });
  }

  const languageLabels = {
    uz: ["Vehicle", "Map", "Media", "Camera", "Phone", "Settings"],
    en: ["Vehicle", "Map", "Media", "Camera", "Phone", "Settings"],
    ru: ["Авто", "Карта", "Медиа", "Камера", "Телефон", "Настройки"],
    ko: ["차량", "지도", "미디어", "카메라", "전화", "설정"]
  };

  function applyLanguage(language) {
    const labels =
      languageLabels[language] || languageLabels.uz;

    navButtons.forEach((button, index) => {
      const label = button.querySelector("small");

      if (label) {
        label.textContent = labels[index];
      }
    });
  }

  if ($("languageSelect")) {
    $("languageSelect").addEventListener("change", () => {
      applyLanguage($("languageSelect").value);
    });
  }

  if ($("resetSettings")) {
    $("resetSettings").addEventListener("click", () => {
      document.documentElement.style.setProperty(
        "--accent",
        "#168cff"
      );

      document.body.classList.remove("light");

      if ($("accentColor")) {
        $("accentColor").value = "#168cff";
      }

      if ($("themeSelect")) {
        $("themeSelect").value = "dark";
      }

      if ($("languageSelect")) {
        $("languageSelect").value = "uz";
      }

      applyLanguage("uz");
    });
  }

  /* START SYSTEM */

  openPage("dashboard");

});
