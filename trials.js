(function(root) {
"use strict";

const WORDS=[
  "rune","wolf","shield","storm",
  "sword","raven","winter","fire",
  "north","forest","king","ship",
  "friend","writing","stone","dragon",
  "thunder","night","home","warrior",
  "magic","river","moon","sun"
];

const KEY="runeTrialsV1";

function today(date=new Date()) {
  return RuneProgress.dateKey(date);
}

function challenges(date=new Date()) {
  const key=today(date);
  const seed=Number(key.replaceAll("-",""));
  const start=seed%WORDS.length;

  return Array.from({length:3},(_,i)=>({
    id:i,
    word:WORDS[(start+i*7)%WORDS.length]
  }));
}

function load(date=new Date()) {
  const day=today(date);
  const progress=RuneProgress.load();
  if(progress.trialDay===day) {
    return {
      day,
      completed:progress.trialCompleted || [],
      bonus:progress.trialBonus===true
    };
  }
  return {day,completed:[],bonus:false};
}

function normalize(value) {
  return value.trim().replace(/\s+/g,"");
}

function submit(id,answer,date=new Date()) {
  const list=challenges(date);
  const trial=list[id];
  const state=load(date);

  if(!trial || !Number.isInteger(id)) {
    return {correct:false,awarded:0};
  }

  if(state.completed.includes(id)) {
    return {correct:true,awarded:0,already:true};
  }

  const expected=RunicEnglish.encode(trial.word);

  if(normalize(answer)!==expected) {
    return {correct:false,awarded:0};
  }

  state.completed.push(id);
  let earned=15;

  if(state.completed.length===3 && !state.bonus) {
    state.bonus=true;
    earned+=20;
  }

  // Keep all XP in the existing progression save.
  const progress=RuneProgress.load();
  const day=today(date);
  const yesterday=new Date(
    date.getFullYear(),date.getMonth(),
    date.getDate()-1
  );
  const previous=today(yesterday);

  if(progress.lastPractice &&
     day<progress.lastPractice) {
    return {correct:false,awarded:0};
  }

  if(progress.lastPractice!==day) {
    progress.streak=
      progress.lastPractice===previous
        ? progress.streak+1 : 1;
    progress.bestStreak=Math.max(
      progress.bestStreak,progress.streak
    );
    progress.lastPractice=day;
  }

  progress.xp+=earned;

  // Save the trial completion and XP together
  // in the progression record for consistency.
  progress.trialDay=day;
  progress.trialCompleted=state.completed;
  progress.trialBonus=state.bonus;

  localStorage.setItem(
    "runeProgressV1",JSON.stringify(progress)
  );
  localStorage.setItem(KEY,JSON.stringify(state));

  return {
    correct:true,
    awarded:earned,
    completed:state.completed.length
  };
}

root.RuneTrials={
  challenges,load,submit,normalize
};

if(typeof module!=="undefined" && module.exports) {
  module.exports=root.RuneTrials;
}
})(typeof window!=="undefined" ? window : globalThis);
