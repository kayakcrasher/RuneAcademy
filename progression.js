(function(root) {
"use strict";

const KEY = "runeProgressV1";
const XP_PER_RUNE = 10;
const FIRST_MASTERY_BONUS = 15;

function empty() {
  return {
    version:1,
    xp:0,
    streak:0,
    bestStreak:0,
    lastPractice:null,
    mastered:[],
    dailyAwards:{}
  };
}

function load() {
  try {
    const raw=JSON.parse(localStorage.getItem(KEY));
    if (!raw || raw.version!==1) return empty();

    return {
      version:1,
      xp:Number.isSafeInteger(raw.xp)
        && raw.xp>=0 ? raw.xp : 0,
      streak:Number.isSafeInteger(raw.streak)
        && raw.streak>=0 ? raw.streak : 0,
      bestStreak:Number.isSafeInteger(raw.bestStreak)
        && raw.bestStreak>=0 ? raw.bestStreak : 0,
      lastPractice:typeof raw.lastPractice==="string"
        ? raw.lastPractice : null,
      mastered:Array.isArray(raw.mastered)
        ? [...new Set(raw.mastered.filter(
            x=>Number.isInteger(x) && x>=0 && x<24
          ))] : [],
      trialDay:typeof raw.trialDay==="string"
        ? raw.trialDay : null,
      trialCompleted:Array.isArray(raw.trialCompleted)
        ? [...new Set(raw.trialCompleted.filter(
          x=>Number.isInteger(x) && x>=0 && x<3
        ))] : [],
      trialBonus:raw.trialBonus===true,
      dailyAwards:raw.dailyAwards &&
        typeof raw.dailyAwards==="object" &&
        !Array.isArray(raw.dailyAwards)
          ? raw.dailyAwards : {}
    };
  } catch {
    return empty();
  }
}

function save(data) {
  localStorage.setItem(KEY,JSON.stringify(data));
}

function dateKey(date=new Date()) {
  const y=date.getFullYear();
  const m=String(date.getMonth()+1).padStart(2,"0");
  const d=String(date.getDate()).padStart(2,"0");
  return `${y}-${m}-${d}`;
}

function previousDay(date=new Date()) {
  const d=new Date(
    date.getFullYear(),date.getMonth(),
    date.getDate()-1
  );
  return dateKey(d);
}

function level(xp) {
  return Math.floor(xp/100)+1;
}

function award(index,score,date=new Date()) {
  if (!Number.isInteger(index) ||
      index<0 || index>=24 ||
      !Number.isFinite(score) || score<65) {
    return {awarded:0,state:load()};
  }

  const data=load();
  const today=dateKey(date);
  const yesterday=previousDay(date);

  // Do not rewrite streak history for older dates.
  if (data.lastPractice && today<data.lastPractice) {
    return {awarded:0,state:data};
  }

  if (data.lastPractice!==today) {
    data.streak=data.lastPractice===yesterday
      ? data.streak+1 : 1;
    data.lastPractice=today;
    data.bestStreak=Math.max(
      data.bestStreak,data.streak
    );
  }

  const dailyKey=`${today}:${index}`;
  let earned=0;

  if (!data.dailyAwards[dailyKey]) {
    earned+=XP_PER_RUNE;
    data.dailyAwards={
      ...Object.fromEntries(
        Object.entries(data.dailyAwards).filter(
          ([key])=>key.startsWith(today+":")
        )
      ),
      [dailyKey]:true
    };
  }

  if (!data.mastered.includes(index)) {
    data.mastered.push(index);
    earned+=FIRST_MASTERY_BONUS;
  }

  data.xp+=earned;
  save(data);

  return {awarded:earned,state:data};
}


function awardReading(level,correct,total,date=new Date()) {
  if(!["beginner","intermediate","advanced"].includes(level) ||
     !Number.isInteger(correct) ||
     !Number.isInteger(total) ||
     total!==10 || correct<7 || correct>total) {
    return {awarded:0,state:load()};
  }

  const data=load();
  const today=dateKey(date);
  const key=`${today}:reading:${level}`;

  if(data.dailyAwards[key])
    return {awarded:0,state:data};

  data.dailyAwards={
    ...Object.fromEntries(
      Object.entries(data.dailyAwards)
        .filter(([k])=>k.startsWith(today+":"))
    ),
    [key]:true
  };

  data.xp+=20;
  save(data);

  if(typeof document!=="undefined")
    document.dispatchEvent(new Event("rune-progress"));

  return {awarded:20,state:data};
}

function snapshot(date=new Date()) {
  const data=load();
  const today=dateKey(date);
  const yesterday=previousDay(date);

  return {
    ...data,
    level:level(data.xp),
    levelXP:data.xp%100,
    currentStreak:
      data.lastPractice===today ||
      data.lastPractice===yesterday
        ? data.streak : 0
  };
}

const API={
  load,award,awardReading,snapshot,dateKey,level,empty
};

root.RuneProgress=API;

if(typeof module!=="undefined" && module.exports) {
  module.exports=API;
}
})(typeof window!=="undefined" ? window : globalThis);
