(function() {
"use strict";

const $=id=>document.getElementById(id);
let questions=[];
let round=0;
let score=0;
let answered=false;
let finished=false;

function showBest() {
  const level=$("clozeLevel").value;
  const best=RuneCloze.highScores()[level];
  $("clozeBest").textContent=
    best===undefined
      ?"Best score: Not yet recorded"
      :`Best score: ${best}%`;
}

function start() {
  const level=$("clozeLevel").value;
  questions=RuneCloze.session(level,10);
  round=0;
  score=0;
  answered=false;
  finished=false;

  $("clozeLibrary").textContent=
    `${RuneCloze.total(level)} sentences available`;

  showBest();
  render();
}

function render() {
  const q=questions[round];
  answered=false;

  $("clozeProgress").textContent=
    `Sentence ${round+1} of ${questions.length}`;
  $("clozeRunes").textContent=q.runic;
  $("clozeFeedback").textContent="";
  $("clozeScore").textContent=
    `Correct: ${score} / ${round}`;

  $("clozeNext").disabled=true;
  $("clozeNext").textContent=
    round===questions.length-1
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

      const correct=i===q.answer;
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

function finish() {
  finished=true;
  const level=$("clozeLevel").value;
  const improved=RuneCloze.saveScore(
    level,score,questions.length
  );

  $("clozeOptions").replaceChildren();
  $("clozeRunes").textContent="ᚠ ᚢ ᚦ";
  $("clozeProgress").textContent="Challenge complete!";
  $("clozeFeedback").textContent=
    `Final score: ${score} / ${questions.length}`;
  $("clozeScore").textContent=
    `${Math.round(score/questions.length*100)}% accuracy`+
    (improved?" · New personal best!":"");

  $("clozeNext").textContent="Play Again";
  $("clozeNext").disabled=false;
  showBest();
}

$("clozeNext").addEventListener("click",()=>{
  if(finished) {
    start();
    return;
  }

  if(!answered) return;

  if(round===questions.length-1)
    finish();
  else {
    round++;
    render();
  }
});

$("clozeLevel").addEventListener("change",start);
start();
})();
