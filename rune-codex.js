(function(root) {
"use strict";

const KEY="runeReadingCodexV1";
const LEVELS=["beginner","intermediate","advanced"];

function empty() {
  return {
    version:1,
    beginner:[],
    intermediate:[],
    advanced:[]
  };
}

function load() {
  let raw;
  try {
    raw=JSON.parse(localStorage.getItem(KEY));
  } catch {
    return empty();
  }

  const data=empty();
  if(!raw || raw.version!==1) return data;

  for(const level of LEVELS) {
    const list=Array.isArray(raw[level])
      ?raw[level]:[];

    data[level]=[...new Set(list.filter(i=>
      Number.isInteger(i) &&
      i>=0 && i<RuneCloze.total(level)
    ))].sort((a,b)=>a-b);
  }

  return data;
}

function record(level,index,correct) {
  if(!LEVELS.includes(level) ||
     !Number.isInteger(index) ||
     index<0 || index>=RuneCloze.total(level) ||
     correct!==true) return false;

  const data=load();
  if(data[level].includes(index)) return false;

  data[level].push(index);
  data[level].sort((a,b)=>a-b);
  localStorage.setItem(KEY,JSON.stringify(data));
  return true;
}

function progress(level) {
  const data=load();

  if(level) {
    if(!LEVELS.includes(level)) return null;

    const mastered=data[level].length;
    const total=RuneCloze.total(level);

    return {
      mastered,total,
      remaining:total-mastered,
      percent:Math.round(mastered/total*100)
    };
  }

  const mastered=LEVELS.reduce(
    (sum,l)=>sum+data[l].length,0
  );
  const total=RuneCloze.total();

  return {
    mastered,total,
    remaining:total-mastered,
    percent:Math.round(mastered/total*100)
  };
}

function session(level,count=10,unmastered=false) {
  if(!LEVELS.includes(level)) return [];

  const completed=new Set(load()[level]);
  let indices=RuneCloze.BANK[level]
    .map((_,i)=>i);

  if(unmastered)
    indices=indices.filter(i=>!completed.has(i));

  for(let i=indices.length-1;i>0;i--) {
    const j=Math.floor(Math.random()*(i+1));
    [indices[i],indices[j]]=
      [indices[j],indices[i]];
  }

  return indices
    .slice(0,Math.min(count,indices.length))
    .map(i=>RuneCloze.question(i,level));
}

const API={empty,load,record,progress,session};
root.RuneCodex=API;

if(typeof module!=="undefined"&&module.exports)
  module.exports=API;
})(typeof window!=="undefined"?window:globalThis);
