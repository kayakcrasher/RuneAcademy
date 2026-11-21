const assert=require("node:assert/strict");

const store=new Map();
global.localStorage={
  getItem:k=>store.get(k)??null,
  setItem:(k,v)=>store.set(k,String(v))
};

global.RuneProgress=require("../progression.js");
global.RunicEnglish=require("../runic-english.js");

const T=require("../trials.js");

function date(s) {
  return new Date(s+"T12:00:00");
}

const d=date("2026-11-20");
const list=T.challenges(d);

assert.equal(list.length,3);
assert.equal(new Set(list.map(x=>x.word)).size,3);

const first=RunicEnglish.encode(list[0].word);

assert.equal(T.submit(0,"wrong",d).correct,false);
assert.equal(RuneProgress.load().xp,0);

const win=T.submit(0,first,d);
assert.equal(win.correct,true);
assert.equal(win.awarded,15);
assert.equal(RuneProgress.load().xp,15);

const repeat=T.submit(0,first,d);
assert.equal(repeat.awarded,0);

for(let i=1;i<3;i++) {
  const answer=RunicEnglish.encode(list[i].word);
  const result=T.submit(i,answer,d);
  assert.equal(result.correct,true);
  assert.equal(result.awarded,i===2?35:15);
}

assert.equal(RuneProgress.load().xp,65);
assert.equal(T.load(d).completed.length,3);
assert.equal(RuneProgress.load().streak,1);

const tomorrow=date("2026-11-21");
assert.equal(T.load(tomorrow).completed.length,0);

const next=T.challenges(tomorrow);
const nextAnswer=RunicEnglish.encode(next[0].word);
T.submit(0,nextAnswer,tomorrow);

assert.equal(RuneProgress.load().streak,2);
assert.equal(RuneProgress.load().xp,80);

console.log("ALL RUNE TRIAL TESTS PASSED");
