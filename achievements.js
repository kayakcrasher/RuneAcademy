(function(root) {
"use strict";

const TITLE_KEY="runeSelectedTitleV1";

const BADGES=Object.freeze([
  {
    id:"first",
    symbol:"ᚠ",
    name:"First Carving",
    title:"Rune Initiate",
    goal:1,
    metric:"mastered"
  },
  {
    id:"apprentice",
    symbol:"ᚦ",
    name:"Rune Apprentice",
    title:"Rune Apprentice",
    goal:8,
    metric:"mastered"
  },
  {
    id:"master",
    symbol:"ᛟ",
    name:"Rune Master",
    title:"Rune Master",
    goal:24,
    metric:"mastered"
  },
  {
    id:"flame",
    symbol:"ᛊ",
    name:"Flame Keeper",
    title:"Flame Keeper",
    goal:7,
    metric:"streak"
  },
  {
    id:"champion",
    symbol:"ᛏ",
    name:"Trial Champion",
    title:"Trial Champion",
    goal:1,
    metric:"trial"
  },
  {
    id:"reader",
    symbol:"ᚱ",
    name:"Rune Reader",
    title:"Rune Reader",
    goal:70,
    metric:"clozeBeginner"
  },
  {
    id:"interpreter",
    symbol:"ᛖ",
    name:"Rune Interpreter",
    title:"Rune Interpreter",
    goal:80,
    metric:"clozeIntermediate"
  },
  {
    id:"linguist",
    symbol:"ᛟ",
    name:"Runic Linguist",
    title:"Runic Linguist",
    goal:90,
    metric:"clozeAdvanced"
  },
  {
    id:"scholar",
    symbol:"ᛇ",
    name:"Runic Scholar",
    title:"Runic Scholar",
    goal:10,
    metric:"level"
  }
]);

function metrics() {
  const p=RuneProgress.snapshot();
  let mastery={};

  try {
    const raw=JSON.parse(
      localStorage.getItem("runeMastery")||"{}"
    );
    if(raw && typeof raw==="object" &&
       !Array.isArray(raw)) mastery=raw;
  } catch {}

  const mastered=Array.from(
    {length:24},(_,i)=>i
  ).filter(i=>
    Number(mastery[i])>=65 ||
    p.mastered.includes(i)
  ).length;

  let scores={};
  try {
    const raw=JSON.parse(
      localStorage.getItem("runeClozeScoresV1")||"{}"
    );
    if(raw && typeof raw==="object" &&
       !Array.isArray(raw)) scores=raw;
  } catch {}

  return {
    clozeBeginner:Number(scores.beginner)||0,
    clozeIntermediate:Number(scores.intermediate)||0,
    clozeAdvanced:Number(scores.advanced)||0,
    mastered,
    streak:p.bestStreak,
    trial:p.trialBonus===true ? 1:0,
    level:p.level
  };
}

function achievements(data=metrics()) {
  return BADGES.map(badge=>{
    const value=Math.max(
      0,Number(data[badge.metric])||0
    );
    return {
      ...badge,
      value,
      unlocked:value>=badge.goal,
      percent:Math.min(
        100,Math.round(value/badge.goal*100)
      )
    };
  });
}

function unlockedTitles(data=metrics()) {
  return achievements(data)
    .filter(b=>b.unlocked)
    .map(b=>b.title);
}

function selectedTitle(data=metrics()) {
  const saved=localStorage.getItem(TITLE_KEY);
  const available=unlockedTitles(data);

  return available.includes(saved)
    ? saved : "Rune Wanderer";
}

function chooseTitle(title,data=metrics()) {
  if(title!=="Rune Wanderer" &&
     !unlockedTitles(data).includes(title)) {
    return false;
  }

  localStorage.setItem(TITLE_KEY,title);
  return true;
}

const API={
  BADGES,metrics,achievements,
  unlockedTitles,selectedTitle,chooseTitle
};

root.RuneAchievements=API;

if(typeof module!=="undefined" && module.exports) {
  module.exports=API;
}
})(typeof window!=="undefined" ? window : globalThis);
