const assert=require("node:assert/strict");

const store=new Map();

global.localStorage={
  getItem:key=>store.get(key)??null,
  setItem:(key,value)=>
    store.set(key,String(value))
};

global.RuneProgress=require("../progression.js");

const A=require("../achievements.js");

function test(name,fn) {
  store.clear();
  fn();
  console.log("PASS:",name);
}

function data(overrides={}) {
  return {
    mastered:0,
    streak:0,
    trial:0,
    level:1,
    ...overrides
  };
}

test("six achievements exist",()=>{
  assert.equal(A.BADGES.length,6);
});

test("new player has no achievements",()=>{
  assert.equal(
    A.achievements(data())
      .filter(b=>b.unlocked).length,
    0
  );
  assert.equal(
    A.selectedTitle(data()),
    "Rune Wanderer"
  );
});

test("first rune unlocks First Carving",()=>{
  const badges=A.achievements(
    data({mastered:1})
  );
  assert.equal(badges[0].unlocked,true);
  assert.equal(badges[1].unlocked,false);
});

test("eight runes unlock apprentice",()=>{
  assert.equal(
    A.achievements(data({mastered:8}))[1]
      .unlocked,true
  );
});

test("24 runes unlock master",()=>{
  assert.equal(
    A.achievements(data({mastered:24}))[2]
      .unlocked,true
  );
});

test("seven days unlock Flame Keeper",()=>{
  assert.equal(
    A.achievements(data({streak:7}))[3]
      .unlocked,true
  );
});

test("daily trial victory unlocks champion",()=>{
  assert.equal(
    A.achievements(data({trial:1}))[4]
      .unlocked,true
  );
});

test("level ten unlocks scholar",()=>{
  assert.equal(
    A.achievements(data({level:10}))[5]
      .unlocked,true
  );
});

test("locked titles cannot be selected",()=>{
  assert.equal(
    A.chooseTitle("Rune Master",data()),
    false
  );
  assert.equal(
    A.selectedTitle(data()),
    "Rune Wanderer"
  );
});

test("unlocked title can be selected",()=>{
  const progress=data({mastered:1});
  assert.equal(
    A.chooseTitle("Rune Initiate",progress),
    true
  );
  assert.equal(
    A.selectedTitle(progress),
    "Rune Initiate"
  );
});

test("legacy rune mastery is recognized",()=>{
  store.set("runeMastery",
    JSON.stringify({"0":85})
  );
  assert.equal(A.metrics().mastered,1);
});

console.log("ALL ACHIEVEMENT TESTS PASSED");
