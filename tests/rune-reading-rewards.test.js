const assert=require("node:assert/strict");

const store=new Map();
global.localStorage={
  getItem:k=>store.get(k)??null,
  setItem:(k,v)=>store.set(k,String(v))
};

const P=require("../progression.js");
const A=require("../achievements.js");

const day=new Date(2026,10,22);

assert.equal(
  P.awardReading("beginner",6,10,day).awarded,0
);
assert.equal(
  P.awardReading("beginner",7,10,day).awarded,20
);
assert.equal(
  P.awardReading("beginner",10,10,day).awarded,0
);
assert.equal(
  P.awardReading("intermediate",8,10,day).awarded,20
);
assert.equal(P.snapshot(day).xp,40);

assert.equal(
  P.awardReading("advanced",9,10,
    new Date(2026,10,23)).awarded,20
);
assert.equal(P.snapshot().xp,60);

store.set("runeClozeScoresV1",JSON.stringify({
  beginner:70,
  intermediate:80,
  advanced:90
}));

const badges=A.achievements();
for(const id of ["reader","interpreter","linguist"]) {
  assert.equal(
    badges.find(b=>b.id===id).unlocked,true
  );
}

assert.ok(A.unlockedTitles().includes("Runic Linguist"));

console.log("READING XP + ACHIEVEMENTS GREEN");
