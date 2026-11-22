(function(root) {
"use strict";

const KEY="runeMemoryForgeV1";
const LEVELS=["beginner","intermediate","advanced"];
const INTERVALS=[1,3,7,14,30];
const DAY=86400000;

function dayKey(date=new Date()) {
  return date.getFullYear()+"-"+
    String(date.getMonth()+1).padStart(2,"0")+"-"+
    String(date.getDate()).padStart(2,"0");
}

function addDays(day,n) {
  const [y,m,d]=day.split("-").map(Number);
  const date=new Date(Date.UTC(y,m-1,d+n));
  return date.toISOString().slice(0,10);
}

function validDay(value) {
  return typeof value==="string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value+"T00:00:00Z")
      .toISOString().slice(0,10)===value;
}

function empty() {
  return {version:1,items:{}};
}

function load() {
  let data;
  try {
    data=JSON.parse(localStorage.getItem(KEY));
  } catch {}

  if(!data || data.version!==1 ||
     !data.items || typeof data.items!=="object" ||
     Array.isArray(data.items))
    data=empty();

  const items={};

  for(const [key,item] of Object.entries(data.items)) {
    const [level,indexText]=key.split(":");
    const index=Number(indexText);

    if(!LEVELS.includes(level) ||
       !/^\d+$/.test(indexText||"") ||
       index>=RuneCloze.total(level) ||
       !item || typeof item!=="object")
      continue;

    if(!validDay(item.due)) continue;

    items[key]={
      streak:Number.isSafeInteger(item.streak)
        ?Math.max(0,Math.min(5,item.streak)):0,
      correct:Number.isSafeInteger(item.correct)
        ?Math.max(0,item.correct):0,
      wrong:Number.isSafeInteger(item.wrong)
        ?Math.max(0,item.wrong):0,
      due:item.due,
      last:validDay(item.last)?item.last:null
    };
  }

  return {version:1,items};
}

function save(data) {
  localStorage.setItem(KEY,JSON.stringify(data));
}

function migrate(today=new Date()) {
  const data=load();
  const legacy=RuneCodex.load();
  const date=dayKey(today);
  let changed=false;

  for(const level of LEVELS) {
    for(const index of legacy[level]) {
      const key=`${level}:${index}`;
      if(data.items[key]) continue;

      data.items[key]={
        streak:1,correct:1,wrong:0,
        last:null,due:date
      };
      changed=true;
    }
  }

  if(changed) save(data);
  return data;
}

function record(level,index,correct,today=new Date()) {
  if(!LEVELS.includes(level) ||
     !Number.isInteger(index) ||
     index<0 || index>=RuneCloze.total(level) ||
     typeof correct!=="boolean")
    return null;

  const data=migrate(today);
  const key=`${level}:${index}`;
  const date=dayKey(today);
  const old=data.items[key];

  // Do not allow older dated activity to rewrite history.
  if(old && old.last && date<old.last)
    return null;

  const streak=correct
    ?Math.min(5,(old?.streak||0)+1):0;

  const interval=correct
    ?INTERVALS[streak-1]:1;

  const item={
    streak,
    correct:(old?.correct||0)+(correct?1:0),
    wrong:(old?.wrong||0)+(correct?0:1),
    last:date,
    due:addDays(date,interval)
  };

  data.items[key]=item;
  save(data);
  return item;
}

function due(level,today=new Date()) {
  if(!LEVELS.includes(level)) return [];

  const data=migrate(today);
  const date=dayKey(today);

  return Object.entries(data.items)
    .filter(([key,item])=>
      key.startsWith(level+":") &&
      item.due<=date
    )
    .sort((a,b)=>
      a[1].due.localeCompare(b[1].due) ||
      a[1].streak-b[1].streak
    )
    .map(([key])=>Number(key.split(":")[1]));
}

function summary(today=new Date()) {
  const data=migrate(today);
  const date=dayKey(today);
  const result={learned:0,due:0,reviewedToday:0};

  for(const item of Object.values(data.items)) {
    result.learned++;
    if(item.due<=date) result.due++;
    if(item.last===date) result.reviewedToday++;
  }

  return result;
}

function session(level,count=10,today=new Date()) {
  return due(level,today).slice(0,count)
    .map(index=>RuneCloze.question(index,level));
}

const API={
  dayKey,addDays,load,migrate,
  record,due,summary,session
};

root.RuneMemoryForge=API;
if(typeof module!=="undefined"&&module.exports)
  module.exports=API;
})(typeof window!=="undefined"?window:globalThis);
