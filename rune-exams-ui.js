(function() {
"use strict";

const $=id=>document.getElementById(id);
let active=null;
let position=0;
let answers=[];

function node(tag,text,cls="") {
  const el=document.createElement(tag);
  el.textContent=text;
  if(cls) el.className=cls;
  return el;
}

function renderSeals() {
  const holder=$("examSeals");
  holder.replaceChildren();

  const earned=RuneExams.seals()
    .filter(s=>s.earned);

  $("hallSeals").textContent=earned.length
    ? "✦ Seals: "+earned.map(s=>s.symbol).join(" ")
    : "ᚠ ᚺ ᛏ · No seals earned";

  for(const seal of RuneExams.seals()) {
    const card=node("div","","exam-seal");
    const ready=RuneExams.available(seal.index);

    card.append(
      node("strong",seal.symbol+" "+seal.name),
      node("small",seal.earned
        ?"✦ Seal earned"
        :ready?"Exam available":"🔒 Locked")
    );

    const button=node(
      "button",
      seal.earned?"Retake Exam":"Begin Exam"
    );
    button.type="button";
    button.disabled=!ready;
    button.addEventListener("click",()=>{
      active=seal.index;
      position=0;
      answers=[];
      $("examFeedback").textContent="";
      renderQuestion();
    });

    card.append(button);
    holder.append(card);
  }
}

function renderQuestion() {
  const holder=$("examQuestions");
  holder.replaceChildren();

  if(active===null) return;

  const quiz=RuneExams.questions(active);
  const q=quiz[position];

  if(!q) return;

  holder.append(
    node("h3",`Question ${position+1} of ${quiz.length}`),
    node("div",q.symbol,"exam-rune"),
    node("p","What is this rune's sound value?")
  );

  const options=node("div","","exam-options");

  for(const value of q.options) {
    const button=node("button",value);
    button.type="button";

    button.addEventListener("click",()=>{
      answers.push(value);
      position++;

      if(position>=quiz.length) {
        finish();
      } else {
        renderQuestion();
      }
    });

    options.append(button);
  }

  holder.append(options);
}

function finish() {
  const result=RuneExams.grade(active,answers);

  $("examQuestions").replaceChildren();

  if(result.locked || result.invalid) {
    $("examFeedback").textContent=
      "Examination unavailable. Please retry.";
  } else {
    $("examFeedback").textContent=result.passed
      ? `✦ PASSED! ${result.score}% · Ætt Seal earned!`
      : `${result.score}% · You need 80% to pass. Try again!`;
  }

  active=null;
  renderSeals();
  document.dispatchEvent(new Event("rune-exam"));
}

document.querySelector(
  '[data-tab="journey"]'
).addEventListener("click",renderSeals);

document.addEventListener(
  "rune-progress",renderSeals
);

window.addEventListener(
  "storage",renderSeals
);

renderSeals();
})();
