const assert=require("node:assert/strict");
const L=require("../rune-lessons.js");

for(let i=0;i<24;i++) {
  const lesson=L.lesson(i);
  assert.ok(lesson);
  assert.ok(lesson.symbol);
  assert.ok(lesson.name);
  assert.ok(lesson.meaning);
  assert.ok(lesson.shape);
  assert.equal(lesson.aett,Math.floor(i/8)+1);

  const options=L.options(i);
  assert.equal(options.length,3);
  assert.equal(new Set(options).size,3);
  assert.ok(options.includes(lesson.sound));
  assert.equal(L.check(i,lesson.sound),true);
}

assert.equal(L.lesson(-1),null);
assert.equal(L.lesson(24),null);
assert.equal(L.check(0,"wrong"),false);

console.log("ALL 24 INTERACTIVE LESSONS PASSED");
