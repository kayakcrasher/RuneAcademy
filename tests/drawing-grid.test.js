const assert=require("node:assert/strict");
const R=require("../recognizer.js");

function shapeAt(dx,dy) {
  return R.parseShape(R.shapes[0]).map(stroke=>
    stroke.map(p=>({
      x:110+p.x+dx,
      y:110+p.y+dy
    }))
  );
}

const centered=shapeAt(0,0);
const shifted=shapeAt(65,0);

const a=R.recognize(centered,0);
const b=R.recognize(shifted,0);

assert.equal(a.passed,true);
assert.equal(a.placementPenalty,0);
assert.ok(b.placementPenalty>0);
assert.ok(b.placementPenalty<=8);
assert.ok(b.score<a.score);
assert.equal(a.shapeScore,b.shapeScore);

console.log("DRAWING PRECISION TESTS GREEN");
