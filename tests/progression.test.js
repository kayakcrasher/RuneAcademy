const assert=require("node:assert/strict");

const store=new Map();

global.localStorage={
  getItem:k=>store.get(k)??null,
  setItem:(k,v)=>store.set(k,String(v))
};

const P=require("../progression.js");

function day(value) {
  return new Date(value+"T12:00:00");
}

function test(name,fn) {
  store.clear();
  fn();
  console.log("PASS:",name);
}

test("first mastery awards 25 XP",()=>{
  const r=P.award(0,90,day("2026-11-20"));
  assert.equal(r.awarded,25);
  assert.equal(r.state.xp,25);
});

test("same rune cannot farm XP",()=>{
  const d=day("2026-11-20");
  P.award(0,90,d);
  assert.equal(P.award(0,90,d).awarded,0);
});

test("different rune earns daily XP",()=>{
  const d=day("2026-11-20");
  P.award(0,90,d);
  assert.equal(P.award(1,90,d).awarded,25);
  assert.equal(P.award(0,90,d).awarded,0);
});

test("repeat next day earns 10 XP",()=>{
  P.award(0,90,day("2026-11-20"));
  const r=P.award(0,90,day("2026-11-21"));
  assert.equal(r.awarded,10);
  assert.equal(r.state.streak,2);
});

test("missed day resets streak",()=>{
  P.award(0,90,day("2026-11-20"));
  const r=P.award(1,90,day("2026-11-23"));
  assert.equal(r.state.streak,1);
});

test("same day doesn't grow streak",()=>{
  const d=day("2026-11-20");
  P.award(0,90,d);
  const r=P.award(1,90,d);
  assert.equal(r.state.streak,1);
});

test("failed drawing earns nothing",()=>{
  const r=P.award(0,40,day("2026-11-20"));
  assert.equal(r.awarded,0);
  assert.equal(r.state.xp,0);
});

test("100 XP reaches level 2",()=>{
  assert.equal(P.level(0),1);
  assert.equal(P.level(99),1);
  assert.equal(P.level(100),2);
  assert.equal(P.level(250),3);
});

test("yesterday streak remains visible",()=>{
  P.award(0,90,day("2026-11-20"));
  const s=P.snapshot(day("2026-11-21"));
  assert.equal(s.currentStreak,1);
});

console.log("ALL PROGRESSION TESTS PASSED");
