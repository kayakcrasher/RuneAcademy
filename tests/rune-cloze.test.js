const assert=require("node:assert/strict");

global.RunicEnglish=require("../runic-english.js");
const C=require("../rune-cloze.js");

assert.equal(C.total(),10);

for(let i=0;i<C.total();i++) {
  const q=C.question(i);

  assert.ok(q);
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options).size,4);
  assert.equal(
    q.runic,RunicEnglish.encode(q.english)
  );
  assert.equal(q.options[q.answer],q.english);
  assert.equal(C.check(i,q.answer),true);

  for(let j=0;j<4;j++) {
    if(j!==q.answer)
      assert.equal(C.check(i,j),false);
  }
}

assert.equal(C.question(-1),null);
assert.equal(C.question(10),null);
assert.equal(C.check(0,99),false);

console.log("ALL RUNE CLOZE TESTS PASSED");
