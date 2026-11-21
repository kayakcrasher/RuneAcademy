(function() {
"use strict";

function render() {
  const p=RuneProgress.snapshot();

  const values={
    playerXP:p.xp,
    playerLevel:p.level,
    playerStreak:p.currentStreak,
    bestStreak:p.bestStreak
  };

  for(const [id,value] of Object.entries(values)) {
    document.getElementById(id).textContent=value;
  }

  document.getElementById("levelLabel")
    .textContent=
      `Level ${p.level} · ${p.levelXP}/100 XP`;

  document.getElementById("levelBar")
    .style.width=p.levelXP+"%";

  document.getElementById("levelTrack")
    .setAttribute("aria-valuenow",p.levelXP);
}

document.addEventListener("rune-progress",render);
window.addEventListener("storage",render);
render();
})();
