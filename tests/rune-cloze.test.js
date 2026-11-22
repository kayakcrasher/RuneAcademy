const assert=require("node:assert/strict");

const store=new Map();
global.localStorage={
  getItem:k=>store.get(k)??null,
  setItem:(k,v)=>store.set(k,String(v))
};

global.RunicEnglish=require("../runic-english.js");
const C=require("../rune-cloze.js");

assert.equal(C.total(),100);

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

assert.equal(C.saveScore("beginner",8,10),true);
assert.equal(C.highScores().beginner,80);
assert.equal(C.saveScore("beginner",6,10),false);
assert.equal(C.highScores().beginner,80);
assert.equal(C.saveScore("beginner",10,10),true);
assert.equal(C.highScores().beginner,100);

console.log("SMASH 016: ALL 100 QUESTIONS GREEN");
