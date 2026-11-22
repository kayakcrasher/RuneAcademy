(function() {
"use strict";

const container=document.querySelector("#journeyPaths");

function node(tag,text,className="") {
  const el=document.createElement(tag);
  el.textContent=text;
  if(className) el.className=className;
  return el;
}

function openRune(index,mode) {
  selectRune(index);

  if(mode==="learn") {
    document.dispatchEvent(
      new CustomEvent("rune-lesson",{
        detail:{index}
      })
    );
  }

  document.querySelector(
    `[data-tab="${mode}"]`
  ).click();

  document.querySelector("nav")
    .scrollIntoView({block:"start"});
}

function render() {
  const paths=RuneJourney.status();
  const known=new Set(RuneJourney.mastered());

  document.querySelector("#journeySummary")
    .textContent=`${known.size} / 24 runes mastered`;

  document.querySelector("#hallTitle")
    .textContent="✦ "+RuneAchievements.selectedTitle();

  container.replaceChildren();

  for(const path of paths) {
    const card=node("article","","journey-card");

    card.append(
      node("h2",`${path.symbol} ${path.name}`),
      node("p",`${path.count} / 8 mastered`)
    );

    const track=node("div","","progress-track");
    const fill=node("div","","progress-fill");
    fill.style.width=(path.count/8*100)+"%";
    track.append(fill);
    card.append(track);

    if(!path.unlocked) {
      card.append(node(
        "p","🔒 Master the previous ætt",
        "journey-locked"
      ));
    } else {
      if(path.complete) {
        card.append(node(
          "p","✦ Ætt mastered!",
          "journey-complete"
        ));
      }

      const list=node("div","","journey-runes");

      for(let i=path.start;i<path.end;i++) {
        const lesson=RuneLessons.lesson(i);
        const row=node("div","","journey-rune");

        const info=node("div","","journey-info");
        info.append(
          node("strong",
            lesson.symbol+" "+lesson.name),
          node("small",
            known.has(i)?"✓ Mastered":"Not mastered")
        );

        const actions=node("div","","journey-actions");

        for(const mode of ["learn","draw"]) {
          const button=node(
            "button",mode==="learn"?"Lesson":"Draw"
          );
          button.type="button";
          button.addEventListener(
            "click",()=>openRune(i,mode)
          );
          actions.append(button);
        }

        row.append(info,actions);
        list.append(row);
      }

      card.append(list);
    }

    container.append(card);
  }
}

document.querySelector(
  '[data-tab="journey"]'
).addEventListener("click",render);

document.addEventListener("rune-progress",render);

document.querySelector("#titlePicker")
  .addEventListener("change",render);

window.addEventListener("storage",render);

render();
})();
