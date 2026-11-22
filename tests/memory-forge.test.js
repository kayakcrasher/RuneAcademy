const assert=require("node:assert/strict");

const store=new Map();
global.localStorage={
  getItem:k=>store.get(k)??null,
  setItem:(k,v)=>store.set(k,String(v))
};

global.RunicEnglish=require("../runic-english.js");
global.RuneCloze=require("../rune-cloze.js");
global.RuneCodex=require("../rune-codex.js");

const F=require("../memory-forge.js");

function date(day) {
  return new Date(day+"T12:00:00Z");
}

assert.equal(F.addDays("2026-12-31",1),"2027-01-01");
assert.equal(F.summary(date("2026-11-22")).learned,0);

// Existing Codex progress must survive.
RuneCodex.record("beginner",0,true);
let stats=F.summary(date("2026-11-22"));
assert.equal(stats.learned,1);
assert.equal(stats.due,1);

let item=F.record(
  "beginner",0,true,date("2026-11-22")
);
assert.equal(item.streak,2);
assert.equal(item.due,"2026-11-25");

assert.equal(
  F.due("beginner",date("2026-11-24")).length,0
);
assert.deepEqual(
  F.due("beginner",date("2026-11-25")),[0]
);

item=F.record(
  "beginner",0,true,date("2026-11-25")
);
assert.equal(item.streak,3);
assert.equal(item.due,"2026-12-02");

item=F.record(
  "beginner",0,false,date("2026-12-02")
);
assert.equal(item.streak,0);
assert.equal(item.wrong,1);
assert.equal(item.due,"2026-12-03");

item=F.record(
  "beginner",0,true,date("2026-12-03")
);
assert.equal(item.streak,1);
assert.equal(item.due,"2026-12-04");

// Newly encountered sentences are scheduled too.
item=F.record(
  "advanced",2,true,date("2026-11-22")
);
assert.equal(item.streak,1);
assert.equal(item.due,"2026-11-23");

assert.equal(
  F.session("advanced",10,date("2026-11-23")).length,
  1
);

// Invalid answers must not change stored data.
assert.equal(F.record("beginner",999,true),null);
assert.equal(F.record("unknown",0,true),null);

console.log("SMASH 019: MEMORY FORGE GREEN");
