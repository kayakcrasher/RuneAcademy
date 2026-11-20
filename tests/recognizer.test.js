const assert=require("node:assert/strict");
const R=require("../recognizer.js");

function test(name,fn) {
  try {
    fn();
    console.log("PASS:",name);
  } catch(error) {
    console.error("FAIL:",name);
    throw error;
  }
}

function transform(strokes,scale,dx,dy) {
  return strokes.map(stroke=>stroke.map(p=>({
    x:p.x*scale+dx,
    y:p.y*scale+dy
  })));
}

test("24 rune templates exist",()=>{
  assert.equal(R.shapes.length,24);
});

test("all templates match themselves",()=>{
  R.shapes.forEach((shape,i)=>{
    const strokes=R.parseShape(shape);
    const result=R.recognize(strokes,i);
    assert.equal(result.passed,true,
      `Rune ${i} failed`);
    assert.equal(result.score,100);
  });
});

test("stroke order can be reversed",()=>{
  const strokes=R.parseShape(R.shapes[0]);
  const reversed=strokes.slice().reverse()
    .map(s=>s.slice().reverse());

  const result=R.recognize(reversed,0);
  assert.equal(result.passed,true);
});

test("size and position do not matter",()=>{
  const strokes=R.parseShape(R.shapes[4]);
  const moved=transform(strokes,2.4,70,35);

  assert.equal(
    R.recognize(moved,4).passed,true
  );
});

test("blank drawings fail",()=>{
  const result=R.recognize([],0);
  assert.equal(result.passed,false);
});

test("single straight line fails Fehu",()=>{
  const line=[[{x:50,y:0},{x:50,y:100}]];
  const result=R.recognize(line,0);
  assert.equal(result.passed,false);
});

test("invalid target is rejected",()=>{
  assert.throws(
    ()=>R.recognize([],99),
    RangeError
  );
});

console.log("Recognition tests complete");
