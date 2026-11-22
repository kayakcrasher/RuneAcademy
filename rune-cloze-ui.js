(function() {
"use strict";

const $=id=>document.getElementById(id);

let round=0;
let score=0;
let answered=false;

function render() {
  const q=RuneCloze.question(round);
  answered=false;

  $("clozeProgress").textContent=
    `Sentence ${round+1} of ${RuneCloze.total()}`;

  $("clozeRunes").textContent=q.runic;
  $("clozeFeedback").textContent="";
  $("clozeScore").textContent=
    `Correct: ${score} / ${round}`;

  $("clozeNext").disabled=true;
  $("clozeNext").textContent=
    round===RuneCloze.total()-1
      ?"Finish Challenge":"Next Sentence";

  const holder=$("clozeOptions");
  holder.replaceChildren();

  q.options.forEach((option,i)=>{
    const button=document.createElement("button");
    button.type="button";
    button.textContent=
      `${String.fromCharCode(65+i)}. ${option}`;

    button.addEventListener("click",()=>{
      if(answered) return;
      answered=true;

      const correct=RuneCloze.check(round,i);

      if(correct) score++;

      $("clozeFeedback").textContent=correct
        ?"ᚠ Correct! Well read!"
        :`Not quite. Answer: ${q.english}`;

      $("clozeScore").textContent=
        `Correct: ${score} / ${round+1}`;

      holder.querySelectorAll("button")
        .forEach((b,j)=>{
          b.disabled=true;
          if(j===q.answer)
            b.classList.add("cloze-correct");
          else if(j===i)
            b.classList.add("cloze-wrong");
        });

      $("clozeNext").disabled=false;
    });

    holder.append(button);
  });
}

$("clozeNext").addEventListener("click",()=>{
  if(!answered) return;

  if(round===RuneCloze.total()-1) {
    $("clozeOptions").replaceChildren();
    $("clozeRunes").textContent="ᚠ ᚢ ᚦ";
    $("clozeProgress").textContent="Challenge complete!";
    $("clozeFeedback").textContent=
      `Final score: ${score} / ${RuneCloze.total()}`;
    $("clozeScore").textContent=
      `${Math.round(score/RuneCloze.total()*100)}% accuracy`;
    $("clozeNext").textContent="Play Again";
    $("clozeNext").disabled=false;
    answered=true;
    round=RuneCloze.total();
    return;
  }

  if(round===RuneCloze.total()) {
    round=0;
    score=0;
  } else {
    round++;
  }

  render();
});

render();
})();
