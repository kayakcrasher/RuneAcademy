(function() {
"use strict";

let current=0;

const word=document.querySelector("#trialWord");
const answer=document.querySelector("#trialAnswer");
const feedback=document.querySelector("#trialFeedback");

function render() {
  const list=RuneTrials.challenges();
  const state=RuneTrials.load();

  if(state.completed.length===3) {
    word.textContent="ᛟ";
    document.querySelector("#trialHeading")
      .textContent="All Trials Complete!";
    answer.disabled=true;
    document.querySelector("#trialCheck").disabled=true;
  } else {
    if(state.completed.includes(current)) {
      current=list.find(
        x=>!state.completed.includes(x.id)
      ).id;
    }
    word.textContent=list[current].word;
    document.querySelector("#trialHeading")
      .textContent=`Trial ${current+1} of 3`;
    answer.disabled=false;
    document.querySelector("#trialCheck").disabled=false;
  }

  document.querySelector("#trialProgress")
    .textContent=`${state.completed.length} of 3 completed`;

  document.querySelector("#trialBar")
    .style.width=
      (state.completed.length/3*100)+"%";
}

document.querySelector("#trialCheck")
  .addEventListener("click",()=>{
    const result=RuneTrials.submit(
      current,answer.value
    );

    if(result.correct) {
      feedback.textContent=
        `Victory! +${result.awarded} XP`;
      answer.value="";
      document.dispatchEvent(
        new Event("rune-progress")
      );
      render();
    } else {
      feedback.textContent=
        "Not quite. Try again, warrior!";
    }
  });

document.querySelector("#trialNext")
  .addEventListener("click",()=>{
    const state=RuneTrials.load();
    const list=RuneTrials.challenges();
    const available=list.filter(
      x=>!state.completed.includes(x.id)
    );
    if(available.length) {
      const next=available.find(x=>x.id>current)
        ||available[0];
      current=next.id;
      answer.value="";
      feedback.textContent="";
      render();
    }
  });

document.querySelector("#trialHint")
  .addEventListener("click",()=>{
    const trial=RuneTrials.challenges()[current];
    feedback.textContent=
      "Hint: "+RunicEnglish.encode(trial.word)
        .slice(0,1)+"…";
  });

document.querySelector(
  '[data-tab="trials"]'
).addEventListener("click",render);

render();
})();
