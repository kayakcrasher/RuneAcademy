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

function clearPad() {
  ctx.fillStyle = "#e7dfc9";
  ctx.fillRect(0,0,320,320);
  ctx.strokeStyle = "#253d32";
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  distance = 0;
  previous = null;
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
  canvas.setPointerCapture(e.pointerId);
});

canvas.addEventListener("pointermove",e => {
  if (!drawing) return;
  const next = point(e);
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
  previous = null;
}

canvas.addEventListener("pointerup",stopDrawing);
canvas.addEventListener("pointercancel",stopDrawing);

document.querySelector("#clear").onclick = clearPad;

document.querySelector("#check").onclick = () => {
  feedback.textContent = distance > 100
    ? "Drawing captured! Compare it with the rune above."
    : "Draw the rune before checking.";
};

document.querySelector("#next").onclick = () =>
  selectRune((current+1)%runes.length);

const mapping = {
  th:"ᚦ",ng:"ᛜ",
  f:"ᚠ",u:"ᚢ",a:"ᚨ",r:"ᚱ",
  k:"ᚲ",c:"ᚲ",g:"ᚷ",w:"ᚹ",
  h:"ᚺ",n:"ᚾ",i:"ᛁ",j:"ᛃ",
  y:"ᛃ",p:"ᛈ",z:"ᛉ",s:"ᛊ",
  t:"ᛏ",b:"ᛒ",e:"ᛖ",m:"ᛗ",
  l:"ᛚ",d:"ᛞ",o:"ᛟ",
  v:"ᚹ"
};

function transliterate(text) {
  const input = text.toLowerCase();
  let result = "";
  for(let i=0;i<input.length;) {
    const pair = input.slice(i,i+2);
    if(mapping[pair]) {
      result += mapping[pair];
      i += 2;
    } else {
      result += mapping[input[i]] ?? input[i];
      i++;
    }
  }
  return result;
}

const english = document.querySelector("#english");
const translation = document.querySelector("#translation");

english.addEventListener("input",() => {
  translation.textContent =
    transliterate(english.value);
});

selectRune(0);
