
"use strict";

const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".nav-button");

function showPage(id) {
  const nextPage = document.getElementById(id);
  if (!nextPage || !nextPage.classList.contains("page")) return;

  const currentPage = document.querySelector(".page.active");
  if (currentPage === nextPage) return;

  if (currentPage) {
    currentPage.classList.remove("active");
    currentPage.hidden = true;
  }

  nextPage.hidden = false;

  // Restart animation each time a page opens.
  void nextPage.offsetWidth;
  nextPage.classList.add("active");

  navButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.page === id);
  });
}

navButtons.forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.go));
});

// Letter reveal
const openLetterButton = document.getElementById("open-letter");

openLetterButton.addEventListener("click", () => {
  document.getElementById("closed-letter").hidden = true;
  document.getElementById("letter-content").hidden = false;
});

// Relationship timer: 5 October 2026, 19:00 WIB
const anniversary = new Date("2026-10-05T19:00:00+07:00");
const timer = document.getElementById("timer");
const timerLabel = document.getElementById("timer-label");

function updateTimer() {
  const difference = Date.now() - anniversary;
  const isFuture = difference < 0;
  let totalSeconds = Math.floor(Math.abs(difference) / 1000);

  const days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;

  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  timerLabel.textContent = isFuture
    ? "Counting down to our special moment ♡"
    : "Every second, another memory together ♡";

  timer.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

updateTimer();
setInterval(updateTimer, 1000);

// Music player
const music = document.getElementById("music");
const playButton = document.getElementById("play-button");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");

function formatTime(value) {
  if (!Number.isFinite(value)) return "0:00";

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

playButton.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
    } catch (error) {
      alert("Musik belum bisa diputar. Pastikan file music.mp3 sudah di-upload.");
    }
  } else {
    music.pause();
  }
});

music.addEventListener("play", () => {
  playButton.textContent = "Ⅱ";
  playButton.setAttribute("aria-label", "Jeda musik");
});

music.addEventListener("pause", () => {
  playButton.textContent = "▶";
  playButton.setAttribute("aria-label", "Putar musik");
});

music.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(music.duration);
});

music.addEventListener("timeupdate", () => {
  currentTime.textContent = formatTime(music.currentTime);

  if (Number.isFinite(music.duration) && music.duration > 0) {
    progress.value = (music.currentTime / music.duration) * 100;
  }
});

progress.addEventListener("input", () => {
  if (Number.isFinite(music.duration) && music.duration > 0) {
    music.currentTime = (Number(progress.value) / 100) * music.duration;
  }
});

music.addEventListener("error", () => {
  playButton.title = "Periksa file music.mp3";
});
