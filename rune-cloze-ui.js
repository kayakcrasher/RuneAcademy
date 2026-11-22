(function() {
"use strict";

const $=id=>document.getElementById(id);
let questions=[];
let round=0;
let score=0;
let answered=false;
let finished=false;

function renderCodex() {
  const overall=RuneCodex.progress();

  $("clozeCodexTotal").textContent=
    `${overall.mastered} of ${overall.total} sentences mastered`;

  const holder=$("clozeCodexLevels");
  holder.replaceChildren();

  for(const level of RuneCloze.LEVELS) {
    const p=RuneCodex.progress(level);
    const item=document.createElement("p");
    item.textContent=
      `${level}: ${p.mastered}/${p.total} (${p.percent}%)`;
    holder.append(item);
  }
}

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
  const unmastered=
    $("clozeMode").value==="unmastered";

  questions=RuneCodex.session(
    level,10,unmastered
  );
  round=0;
  score=0;
  answered=false;
  finished=false;

  $("clozeLibrary").textContent=
    `${RuneCloze.total(level)} sentences available`;

  showBest();
  renderCodex();

  if(questions.length===0) {
    finished=true;
    $("clozeProgress").textContent=
      "All sentences mastered!";
    $("clozeRunes").textContent="ᛟ";
    $("clozeOptions").replaceChildren();
    $("clozeFeedback").textContent=
      "Choose another difficulty or All sentences.";
    $("clozeScore").textContent="";
    $("clozeNext").disabled=false;
    $("clozeNext").textContent="Play Again";
    return;
  }

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
      if(correct) {
        score++;
        RuneCodex.record(
          q.level,q.index,true
        );
        renderCodex();
      }

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

  const reward=questions.length===10
    ? RuneProgress.awardReading(
        level,score,questions.length
      )
    : {awarded:0};

  $("clozeOptions").replaceChildren();
  $("clozeRunes").textContent="ᚠ ᚢ ᚦ";
  $("clozeProgress").textContent="Challenge complete!";
  $("clozeFeedback").textContent=
    `Final score: ${score} / ${questions.length}`;
  $("clozeScore").textContent=
    `${Math.round(score/questions.length*100)}% accuracy`+
    (improved?" · New personal best!":"")+
    (reward.awarded?` · +${reward.awarded} XP`:"");

  $("clozeNext").textContent="Play Again";
  $("clozeNext").disabled=false;
  showBest();
  document.dispatchEvent(new Event("rune-cloze"));
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
$("clozeMode").addEventListener("change",start);
start();
})();
