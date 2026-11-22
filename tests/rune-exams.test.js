const assert=require("node:assert/strict");

const store=new Map();

global.localStorage={
  getItem:k=>store.get(k)??null,
  setItem:(k,v)=>store.set(k,String(v))
};

global.RuneProgress=require("../progression.js");
global.RuneJourney=require("../rune-journey.js");
global.RuneLessons=require("../rune-lessons.js");

const E=require("../rune-exams.js");

function master(count) {
  const p=RuneProgress.empty();
  p.mastered=Array.from(
    {length:count},(_,i)=>i
  );
  localStorage.setItem(
    "runeProgressV1",JSON.stringify(p)
  );
}

assert.equal(E.seals().length,3);
assert.equal(E.available(0),false);
assert.deepEqual(E.questions(0),[]);

let locked=E.grade(0,[]);
assert.equal(locked.locked,true);
assert.equal(E.seals()[0].earned,false);

master(8);

assert.equal(E.available(0),true);
assert.equal(E.available(1),false);

let quiz=E.questions(0);
assert.equal(quiz.length,5);

let wrong=quiz.map(q=>
  q.options.find(v=>v!==q.correct)
);

let failed=E.grade(0,wrong);
assert.equal(failed.passed,false);
assert.equal(failed.score,0);
assert.equal(E.seals()[0].earned,false);

let four=quiz.map(q=>q.correct);
four[0]=wrong[0];

let passed=E.grade(0,four);
assert.equal(passed.passed,true);
assert.equal(passed.score,80);
assert.equal(E.seals()[0].earned,true);

assert.equal(
  E.grade(0,[]).invalid,true
);

master(24);

for(let i=1;i<3;i++) {
  const questions=E.questions(i);
  const answers=questions.map(q=>q.correct);

  assert.equal(
    E.grade(i,answers).passed,true
  );
}

assert.ok(E.seals().every(s=>s.earned));

console.log("ALL EXAMINATION TESTS PASSED");
