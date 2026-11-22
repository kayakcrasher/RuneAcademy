(function() {
"use strict";

const grid=document.querySelector(
  "#achievementGrid"
);
const picker=document.querySelector(
  "#titlePicker"
);

function render() {
  const badges=RuneAchievements.achievements();
  const unlocked=badges.filter(b=>b.unlocked);
  const selected=RuneAchievements.selectedTitle();

  document.querySelector("#currentTitle")
    .textContent=selected;

  document.querySelector("#honorsCount")
    .textContent=
      `${unlocked.length} of ${badges.length} unlocked`;

  picker.replaceChildren();

  const titles=[
    "Rune Wanderer",
    ...RuneAchievements.unlockedTitles()
  ];

  for(const title of titles) {
    const option=document.createElement("option");
    option.value=title;
    option.textContent=title;
    picker.appendChild(option);
  }

  picker.value=selected;
  grid.replaceChildren();

  for(const badge of badges) {
    const card=document.createElement("article");
    card.className="achievement-card"+
      (badge.unlocked?" unlocked":" locked");

    const symbol=document.createElement("div");
    symbol.className="achievement-symbol";
    symbol.textContent=badge.symbol;

    const name=document.createElement("h3");
    name.textContent=badge.name;

    const progress=document.createElement("p");
    progress.textContent=badge.unlocked
      ? "✦ Achievement unlocked"
      : `${Math.min(badge.value,badge.goal)}`+
        ` / ${badge.goal}`;

    const bar=document.createElement("div");
    bar.className="progress-track";

    const fill=document.createElement("div");
    fill.className="progress-fill";
    fill.style.width=badge.percent+"%";
    bar.appendChild(fill);

    const title=document.createElement("small");
    title.textContent=badge.unlocked
      ? `Title: ${badge.title}`
      : "Locked";

    card.append(
      symbol,name,progress,bar,title
    );
    grid.appendChild(card);
  }
}

picker.addEventListener("change",()=>{
  RuneAchievements.chooseTitle(picker.value);
  render();
});

document.querySelector(
  '[data-tab="honors"]'
).addEventListener("click",render);

document.addEventListener(
  "rune-progress",render
);

document.addEventListener("rune-cloze",render);
window.addEventListener("storage",render);

render();
})();
