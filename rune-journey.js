(function(root) {
"use strict";

const PATHS=[
  {name:"Freyr's Ætt",symbol:"ᚠ",start:0,end:8},
  {name:"Hagal's Ætt",symbol:"ᚺ",start:8,end:16},
  {name:"Tyr's Ætt",symbol:"ᛏ",start:16,end:24}
];

function mastered() {
  const progress=RuneProgress.load();
  let legacy={};

  try {
    const raw=JSON.parse(
      localStorage.getItem("runeMastery")||"{}"
    );
    if(raw && typeof raw==="object" &&
       !Array.isArray(raw)) legacy=raw;
  } catch {}

  return Array.from({length:24},(_,i)=>i)
    .filter(i=>
      progress.mastered.includes(i) ||
      Number(legacy[i])>=65
    );
}

function status() {
  const known=new Set(mastered());

  return PATHS.map((path,index)=>{
    const count=Array.from(
      {length:8},(_,i)=>path.start+i
    ).filter(i=>known.has(i)).length;

    const unlocked=index===0 ||
      Array.from({length:path.start},(_,i)=>i)
        .every(i=>known.has(i));

    return {
      ...path,count,unlocked,
      complete:count===8
    };
  });
}

function nextRune() {
  const known=new Set(mastered());
  return Array.from({length:24},(_,i)=>i)
    .find(i=>!known.has(i))??null;
}

const API={PATHS,mastered,status,nextRune};
root.RuneJourney=API;

if(typeof module!=="undefined"&&module.exports)
  module.exports=API;
})(typeof window!=="undefined"?window:globalThis);
