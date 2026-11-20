const runes = [
  ["ᚠ","Fehu","f"],
  ["ᚢ","Uruz","u"],
  ["ᚦ","Thurisaz","th"],
  ["ᚨ","Ansuz","a"],
  ["ᚱ","Raidho","r"],
  ["ᚲ","Kenaz","k"],
  ["ᚷ","Gebo","g"],
  ["ᚹ","Wunjo","w"],
  ["ᚺ","Hagalaz","h"],
  ["ᚾ","Naudiz","n"],
  ["ᛁ","Isaz","i"],
  ["ᛃ","Jera","j / y"],
  ["ᛇ","Eihwaz","ï / ei"],
  ["ᛈ","Perthro","p"],
  ["ᛉ","Algiz","z"],
  ["ᛊ","Sowilo","s"],
  ["ᛏ","Tiwaz","t"],
  ["ᛒ","Berkano","b"],
  ["ᛖ","Ehwaz","e"],
  ["ᛗ","Mannaz","m"],
  ["ᛚ","Laguz","l"],
  ["ᛜ","Ingwaz","ng"],
  ["ᛞ","Dagaz","d"],
  ["ᛟ","Othala","o"]
];

let current = 0;
const grid = document.querySelector("#runeGrid");
const details = document.querySelector("#details");
const target = document.querySelector("#target");
const sound = document.querySelector("#sound");
const feedback = document.querySelector("#feedback");

function selectRune(index) {
  current = index;
  const [symbol,name,value] = runes[index];

  details.innerHTML = `
    <div class="target">${symbol}</div>
    <h2>${name}</h2>
    <p>Sound value: ${value}</p>
    <p>Rune ${index+1} of 24</p>
    <p>Ætt: ${Math.floor(index/8)+1}</p>
  `;

  target.textContent = symbol;
  sound.textContent = `${name} · ${value}`;

  document.querySelectorAll(".rune")
    .forEach((button,i) =>
      button.classList.toggle(
        "selected",i===index
      )
    );
  clearPad();
}

runes.forEach(([symbol,name],i) => {
  const button = document.createElement("button");
  button.className = "rune";
  button.textContent = symbol;
  button.title = name;
  button.setAttribute("aria-label",name);
  button.onclick = () => selectRune(i);
  grid.appendChild(button);
});

document.querySelectorAll("[data-tab]")
  .forEach(button => {
    button.onclick = () => {
      document.querySelectorAll("[data-tab]")
        .forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      document.querySelectorAll(".panel")
        .forEach(p => p.classList.add("hidden"));

      document.getElementById(
        button.dataset.tab
      ).classList.remove("hidden");
    };
  });

const canvas = document.querySelector("#pad");
const ctx = canvas.getContext("2d");
let drawing = false;
let distance = 0;
let previous = null;
let strokes = [];
let activeStroke = null;

function clearPad() {
  ctx.fillStyle = "#e7dfc9";
  ctx.fillRect(0,0,320,320);
  ctx.strokeStyle = "#253d32";
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  distance = 0;
  previous = null;
  strokes = [];
  activeStroke = null;
  feedback.textContent = "";
}

function point(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x:(event.clientX-rect.left)*320/rect.width,
    y:(event.clientY-rect.top)*320/rect.height
  };
}

canvas.addEventListener("pointerdown",e => {
  drawing = true;
  previous = point(e);
  activeStroke = [previous];
  strokes.push(activeStroke);
  canvas.setPointerCapture(e.pointerId);
});

canvas.addEventListener("pointermove",e => {
  if (!drawing) return;
  const next = point(e);
  activeStroke.push(next);
  ctx.beginPath();
  ctx.moveTo(previous.x,previous.y);
  ctx.lineTo(next.x,next.y);
  ctx.stroke();
  distance += Math.hypot(
    next.x-previous.x,
    next.y-previous.y
  );
  previous = next;
});

function stopDrawing() {
  drawing = false;
  activeStroke = null;
  previous = null;
}

canvas.addEventListener("pointerup",stopDrawing);
canvas.addEventListener("pointercancel",stopDrawing);

document.querySelector("#clear").onclick = clearPad;

document.querySelector("#check").onclick = () => {
  if (distance < 30) {
    feedback.textContent = "Draw the rune first.";
    return;
  }

  const result = RuneRecognizer.recognize(
    strokes,current
  );

  feedback.textContent = result.passed
    ? `ᚠ Success! Accuracy: ${result.score}%`
    : `Accuracy: ${result.score}%. Try again!`;

  if (result.passed) {
    const saved = JSON.parse(
      localStorage.getItem("runeMastery") || "{}"
    );
    saved[current] = Math.max(
      saved[current] || 0,
      result.score
    );
    localStorage.setItem(
      "runeMastery",JSON.stringify(saved)
    );
  }
};

document.querySelector("#next").onclick = () =>
  selectRune((current+1)%runes.length);

const english = document.querySelector("#english");
const translation = document.querySelector("#translation");

english.addEventListener("input",() => {
  translation.textContent =
    RunicEnglish.encode(english.value);
});

selectRune(0);
