const assert=require("node:assert/strict");

const store=new Map();
global.localStorage={
  getItem:k=>store.get(k)??null,
  setItem:(k,v)=>store.set(k,String(v))
};

global.RunicEnglish=require("../runic-english.js");
global.RuneCloze=require("../rune-cloze.js");

const C=require("../rune-codex.js");

assert.equal(C.progress().total,100);
assert.equal(C.progress().mastered,0);

assert.equal(C.record("beginner",0,true),true);
assert.equal(C.record("beginner",0,true),false);
assert.equal(C.record("beginner",1,false),false);
assert.equal(C.record("beginner",99,true),false);

assert.equal(C.progress("beginner").mastered,1);
assert.equal(C.progress().mastered,1);

const rounds=C.session("beginner",10,true);

assert.equal(rounds.length,10);
assert.equal(rounds.some(q=>q.index===0),false);
assert.equal(
  new Set(rounds.map(q=>q.index)).size,10
);

for(let i=0;i<35;i++)
  C.record("beginner",i,true);

assert.equal(C.progress("beginner").percent,100);
assert.equal(C.session("beginner",10,true).length,0);
assert.equal(C.session("beginner",10,false).length,10);

console.log("READING CODEX TESTS GREEN");
