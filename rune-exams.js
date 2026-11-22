(function(root) {
"use strict";

const KEY="runeExamSealsV1";

function load() {
  try {
    const raw=JSON.parse(
      localStorage.getItem(KEY)||"{}"
    );
    if(!raw || typeof raw!=="object" ||
       Array.isArray(raw)) return {};
    return raw;
  } catch {
    return {};
  }
}

function seals() {
  const saved=load();
  return RuneJourney.PATHS.map((path,i)=>({
    index:i,
    name:path.name,
    symbol:path.symbol,
    earned:saved[i]===true
  }));
}

function available(index) {
  if(!Number.isInteger(index) ||
     index<0 || index>=3) return false;
  return RuneJourney.status()[index].complete;
}

function questions(index) {
  if(!available(index)) return [];

  const start=RuneJourney.PATHS[index].start;
  const offsets=[0,2,4,5,7];

  return offsets.map(offset=>{
    const runeIndex=start+offset;
    const lesson=RuneLessons.lesson(runeIndex);
    return {
      runeIndex,
      symbol:lesson.symbol,
      name:lesson.name,
      correct:lesson.sound,
      options:RuneLessons.options(runeIndex)
    };
  });
}

function grade(index,answers) {
  if(!available(index)) {
    return {passed:false,score:0,locked:true};
  }

  const quiz=questions(index);
  if(!Array.isArray(answers) ||
     answers.length!==quiz.length) {
    return {passed:false,score:0,invalid:true};
  }

  const correct=quiz.filter(
    (q,i)=>answers[i]===q.correct
  ).length;

  const passed=correct>=4;

  if(passed) {
    const saved=load();
    saved[index]=true;
    localStorage.setItem(
      KEY,JSON.stringify(saved)
    );
  }

  return {
    passed,
    correct,
    total:quiz.length,
    score:correct*20
  };
}

const API={
  load,seals,available,questions,grade
};

root.RuneExams=API;

if(typeof module!=="undefined"&&module.exports)
  module.exports=API;
})(typeof window!=="undefined"?window:globalThis);
