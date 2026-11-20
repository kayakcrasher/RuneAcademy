(function () {
"use strict";

const KEY = "runeMastery";

function getMastery() {
  try {
    const data = JSON.parse(
      localStorage.getItem(KEY) || "{}"
    );
    return data && typeof data === "object"
      && !Array.isArray(data) ? data : {};
  } catch {
    return {};
  }
}

function masteredCount(data) {
  return Object.values(data).filter(
    value => Number(value) >= 65
  ).length;
}

function updateHall() {
  const data = getMastery();
  const count = Math.min(24,masteredCount(data));
  const percent = Math.round(count/24*100);

  document.querySelector("#masteredCount")
    .textContent = count;

  document.querySelector("#masteryPercent")
    .textContent = percent+"%";

  const bar = document.querySelector("#masteryBar");
  bar.style.width = percent+"%";
  bar.setAttribute("aria-valuenow",percent);

  document.querySelectorAll(".rune").forEach(
    (button,i) => {
      button.classList.toggle(
        "mastered",Number(data[i])>=65
      );
    }
  );
}

function openTab(name) {
  const button = document.querySelector(
    `[data-tab="${name}"]`
  );
  if (button) button.click();
}

document.querySelector("#hallPractice")
  .addEventListener("click",() => {
    const data = getMastery();
    const next = Array.from(
      {length:24},(_,i)=>i
    ).find(i=>Number(data[i])<65);

    if (typeof next === "number") {
      selectRune(next);
    }
    openTab("draw");
  });

document.querySelector("#copyRunes")
  .addEventListener("click",async () => {
    const text = document.querySelector(
      "#translation"
    ).textContent;

    const status = document.querySelector(
      "#copyStatus"
    );

    if (!text) {
      status.textContent = "Write a message first.";
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      status.textContent = "Runes copied!";
    } catch {
      status.textContent =
        "Copy unavailable. Select the runes manually.";
    }
  });

document.querySelectorAll("[data-tab]")
  .forEach(button => {
    button.addEventListener("click",updateHall);
  });

document.querySelector("#check")
  .addEventListener("click",updateHall);

window.addEventListener("storage",updateHall);

updateHall();
})();
