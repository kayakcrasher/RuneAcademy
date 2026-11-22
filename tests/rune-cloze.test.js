const assert=require("node:assert/strict");

global.RunicEnglish=require("../runic-english.js");
const C=require("../rune-cloze.js");

assert.equal(C.total(),100);
assert.equal(C.total("beginner"),35);
assert.equal(C.total("intermediate"),35);
assert.equal(C.total("advanced"),30);

for(const level of C.LEVELS) {
  for(let i=0;i<C.total(level);i++) {
    const q=C.question(i,level);

    assert.ok(q);
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options).size,4);
    assert.equal(q.options[q.answer],q.english);
    assert.equal(
      q.runic,RunicEnglish.encode(q.english)
    );
    assert.equal(C.check(i,q.answer,level),true);

    for(let j=0;j<4;j++) {
      if(j!==q.answer)
        assert.equal(C.check(i,j,level),false);
    }
  }

  const rounds=C.session(level,10);
  assert.equal(rounds.length,10);
  assert.equal(
    new Set(rounds.map(q=>q.index)).size,10
  );
}

assert.equal(C.question(-1),null);
assert.equal(C.question(100),null);
assert.equal(C.check(0,99),false);

console.log("100 SENTENCES VERIFIED — GREEN");
