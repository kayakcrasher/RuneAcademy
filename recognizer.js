(function (root) {
"use strict";

const SHAPES = [
  "20,95 20,5;20,30 80,5;20,55 80,30",
  "20,5 20,75 50,95 80,75 80,5",
  "20,5 20,95;20,30 75,30 90,45 75,60 20,60",
  "15,95 50,5 85,95;30,60 70,60",
  "20,95 20,5;20,5 75,5 85,25 75,45 20,45;20,45 85,95",
  "20,5 20,95;80,5 20,55 80,95",
  "15,5 85,95;85,5 15,95",
  "20,95 20,5 80,30 20,55",
  "20,5 20,95;80,5 80,95;20,5 80,50 20,95;80,5 20,50 80,95",
  "20,5 80,95;10,55 90,40",
  "50,5 50,95",
  "20,5 50,35 80,5;50,35 50,65;20,95 50,65 80,95",
  "20,5 80,95;80,5 20,95;20,50 80,50",
  "20,95 20,5 75,5 85,25 75,45 20,45",
  "20,5 50,45 80,5;50,45 50,95",
  "80,5 20,50 80,50 20,95",
  "15,45 50,5 85,45;50,5 50,95",
  "20,95 20,5;20,5 75,5 85,25 75,45 20,45;20,45 85,65 75,95 20,95",
  "20,95 20,5 80,95 80,5 20,95",
  "20,95 20,5;80,95 80,5;20,5 50,50 80,5;20,95 50,50 80,95",
  "20,5 20,95 80,95",
  "20,95 20,5 50,35 80,5 80,95",
  "20,5 80,95;80,5 20,95;20,5 80,5;20,95 80,95",
  "20,5 20,95;80,5 80,95;20,5 80,5;20,95 80,95"
];

// Each semicolon separates a pen stroke.
// Each space separates points along a stroke.
function parseShape(shape) {
  return shape.split(";").map(part =>
    part.trim().split(/\s+/).map(pair => {
      const [x,y] = pair.split(",").map(Number);
      return {x,y};
    })
  );
}

function resample(strokes, count=96) {
  const segments = [];
  let total = 0;

  for (const stroke of strokes) {
    for (let i=1;i<stroke.length;i++) {
      const a=stroke[i-1], b=stroke[i];
      const len=Math.hypot(b.x-a.x,b.y-a.y);
      if (len>0) {
        segments.push({a,b,len});
        total+=len;
      }
    }
  }

  if (!total) return [];

  const points=[];
  for (let i=0;i<count;i++) {
    const target=(i+0.5)*total/count;
    let traversed=0;

    for (const seg of segments) {
      if (traversed+seg.len>=target) {
        const t=(target-traversed)/seg.len;
        points.push({
          x:seg.a.x+(seg.b.x-seg.a.x)*t,
          y:seg.a.y+(seg.b.y-seg.a.y)*t
        });
        break;
      }
      traversed+=seg.len;
    }
  }
  return points;
}

function normalize(strokes) {
  const points=resample(strokes);
  if (!points.length) return [];

  const xs=points.map(p=>p.x);
  const ys=points.map(p=>p.y);
  const minX=Math.min(...xs), maxX=Math.max(...xs);
  const minY=Math.min(...ys), maxY=Math.max(...ys);
  const width=maxX-minX, height=maxY-minY;

  if (Math.max(width,height)<1) return [];

  // Preserve proportions, center in unit square.
  const scale=Math.max(width,height);
  return points.map(p=>({
    x:(p.x-(minX+maxX)/2)/scale,
    y:(p.y-(minY+maxY)/2)/scale
  }));
}

function nearestDistance(p,points) {
  let best=Infinity;
  for (const q of points) {
    const d=(p.x-q.x)**2+(p.y-q.y)**2;
    if(d<best) best=d;
  }
  return Math.sqrt(best);
}

function distance(a,b) {
  if (!a.length || !b.length) return Infinity;

  let sum=0;
  for (const p of a) sum+=nearestDistance(p,b);
  for (const p of b) sum+=nearestDistance(p,a);

  return sum/(a.length+b.length);
}

const templates=SHAPES.map(shape =>
  normalize(parseShape(shape))
);

function placementPenalty(strokes) {
  const points=strokes.flat().filter(p=>
    Number.isFinite(p.x) &&
    Number.isFinite(p.y)
  );

  if(!points.length) return 0;

  const xs=points.map(p=>p.x);
  const ys=points.map(p=>p.y);

  const cx=(Math.min(...xs)+Math.max(...xs))/2;
  const cy=(Math.min(...ys)+Math.max(...ys))/2;

  // The center is (160,160).
  // Allow 32px of freedom before applying a penalty.
  const offset=Math.hypot(cx-160,cy-160);
  return Math.min(8,
    Math.round(Math.max(0,offset-32)/12)
  );
}

function recognize(strokes,targetIndex) {
  if (!Number.isInteger(targetIndex) ||
      targetIndex<0 || targetIndex>=templates.length) {
    throw new RangeError("Invalid rune index");
  }

  const points=normalize(strokes);
  if (points.length<16) {
    return {score:0,passed:false};
  }

  const d=distance(points,templates[targetIndex]);

  // 0.16 is the approximate maximum tolerated
  // average normalized geometric error.
  const score=Math.max(0,Math.min(100,
    Math.round(100*(1-d/0.16))
  ));

  const penalty=placementPenalty(strokes);
  const finalScore=Math.max(0,score-penalty);

  return {
    score:finalScore,
    passed:finalScore>=65,
    distance:d,
    shapeScore:score,
    placementPenalty:penalty
  };
}

root.RuneRecognizer={
  recognize,parseShape,normalize,distance,placementPenalty,
  shapes:SHAPES
};

if(typeof module!=="undefined" && module.exports) {
  module.exports=root.RuneRecognizer;
}
})(typeof window!=="undefined" ? window : globalThis);
