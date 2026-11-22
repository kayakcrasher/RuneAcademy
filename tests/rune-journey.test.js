const assert=require("node:assert/strict");

const store=new Map();

global.localStorage={
  getItem:k=>store.get(k)??null,
  setItem:(k,v)=>store.set(k,String(v))
};

global.RuneProgress=require("../progression.js");
const J=require("../rune-journey.js");

assert.equal(J.PATHS.length,3);
assert.equal(J.status()[0].unlocked,true);
assert.equal(J.status()[1].unlocked,false);
assert.equal(J.nextRune(),0);

for(const count of [8,16,24]) {
  const state=RuneProgress.empty();
  state.mastered=Array.from(
    {length:count},(_,i)=>i
  );
  localStorage.setItem(
    "runeProgressV1",JSON.stringify(state)
  );

  const paths=J.status();
  assert.equal(paths[Math.floor(count/8)-1].complete,true);

  if(count<24) {
    assert.equal(
      paths[Math.floor(count/8)].unlocked,true
    );
    assert.equal(J.nextRune(),count);
  } else {
    assert.equal(J.nextRune(),null);
  }
}

console.log("ALL JOURNEY TESTS PASSED");
