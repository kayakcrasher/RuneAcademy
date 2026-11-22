(function() {
"use strict";

let active=0;
let passed=false;

const $=id=>document.getElementById(id);

function show(index) {
  const item=RuneLessons.lesson(index);
  if(!item) return;

  active=index;
  passed=false;

  $("lessonSymbol").textContent=item.symbol;
  $("lessonName").textContent=item.name;
  $("lessonMeaning").textContent=
    "Traditional association: "+item.meaning;
  $("lessonShape").textContent=
    "Shape: "+item.shape;
  $("lessonAett").textContent=
    `Ætt ${item.aett} · Rune ${index+1} of 24`;

  $("lessonFeedback").textContent="";
  $("lessonPractice").disabled=true;
  $("lessonOptions").replaceChildren();

  for(const option of RuneLessons.options(index)) {
    const button=document.createElement("button");
    button.type="button";
    button.textContent=option;
    button.addEventListener("click",()=>{
      if(passed) return;

      if(RuneLessons.check(active,option)) {
        passed=true;
        $("lessonFeedback").textContent=
          "ᚠ Correct! Drawing practice unlocked.";
        $("lessonPractice").disabled=false;
      } else {
        $("lessonFeedback").textContent=
          "Not quite. Try another answer.";
      }
    });
    $("lessonOptions").appendChild(button);
  }
}

$("lessonPractice").addEventListener("click",()=>{
  if(!passed) return;
  selectRune(active);
  document.querySelector(
    '[data-tab="draw"]'
  ).click();
});

document.querySelectorAll("#runeGrid .rune")
  .forEach((button,index)=>{
    button.addEventListener("click",()=>show(index));
  });

document.addEventListener("rune-lesson",event=>{
  show(event.detail.index);
});

show(0);
})();
