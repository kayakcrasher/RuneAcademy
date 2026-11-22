(function(root) {
"use strict";

const BANK={
  beginner:[
    "The sun is hot",
    "The moon is bright",
    "The fire is warm",
    "The sky is dark",
    "The wolf is fast",
    "The tree is tall",
    "The river is cold",
    "The bird can fly",
    "The snow is white",
    "The wind is strong",
    "The dog is happy",
    "The cat is small",
    "The horse is strong",
    "The fish can swim",
    "The rain is cold",
    "The grass is green",
    "The stone is hard",
    "The door is open",
    "The house is old",
    "The water is deep",
    "The road is long",
    "The night is quiet",
    "The day is warm",
    "The child can run",
    "The man is tired",
    "The woman can sing",
    "The boat is small",
    "The bread is fresh",
    "The apple is red",
    "The forest is dark",
    "The hill is high",
    "The lake is calm",
    "The bear is hungry",
    "The fox is clever",
    "The stars are bright"
  ],
  intermediate:[
    "The wolf runs through the forest",
    "The moon shines over the lake",
    "The warrior carries a wooden shield",
    "The farmer walks beside the river",
    "The children play near the house",
    "The old man tells a story",
    "The young woman rides a horse",
    "The black bird sits on a branch",
    "The cold wind blows from the north",
    "The fisherman waits beside his boat",
    "The hunter follows tracks in the snow",
    "The fire burns inside the hall",
    "The village sleeps beneath the stars",
    "The traveler rests under a tree",
    "The rain falls upon the green fields",
    "The dog guards the wooden gate",
    "The fox hides behind a stone",
    "The bear searches for food",
    "The sun rises above the mountains",
    "The moon disappears behind the clouds",
    "The river flows toward the sea",
    "The warrior sharpens his iron sword",
    "The family gathers around the fire",
    "The merchant brings bread to the village",
    "The child finds a feather on the road",
    "The horse drinks water from the stream",
    "The storm shakes the tall trees",
    "The birds return when spring arrives",
    "The farmer plants seeds in the earth",
    "The old bridge crosses the river",
    "The woman opens the heavy door",
    "The traveler watches the distant mountains",
    "The wolf howls beneath the moon",
    "The boat sails across the cold lake",
    "The village celebrates the summer sun"
  ],
  advanced:[
    "The weary traveler reached the village before sunset",
    "A fierce storm swept across the valley during the night",
    "The old warrior remembered the battles of his youth",
    "Beyond the northern mountains stood an ancient fortress",
    "The villagers gathered to celebrate the coming harvest",
    "A lonely wolf followed the river through the forest",
    "The young hunter discovered strange tracks in the snow",
    "Every winter the frozen lake became a silent road",
    "The merchant traded silver for food and warm clothing",
    "Before dawn the sailors prepared their ship for departure",
    "The ancient oak had stood beside the hall for generations",
    "A sudden wind scattered the leaves across the courtyard",
    "The children listened carefully as their grandmother spoke",
    "Far beyond the hills a distant fire illuminated the sky",
    "The blacksmith worked until the final sparks faded away",
    "Although the night was cold the travelers continued walking",
    "The village elder warned everyone about the approaching storm",
    "After the long journey the exhausted horses needed rest",
    "The warriors raised their shields when the enemy appeared",
    "A narrow path led through the darkest part of the forest",
    "The fisherman returned with his boat full of silver fish",
    "At sunrise the valley filled with golden light",
    "The old wooden bridge survived another season of heavy rain",
    "The young apprentice learned to carve symbols into stone",
    "The distant mountains disappeared beneath thick winter clouds",
    "When spring arrived the farmers prepared their fields",
    "The travelers shared stories while the evening fire burned",
    "A great feast welcomed the warriors home from their journey",
    "The quiet village rested beneath a sky full of stars",
    "The final ship vanished beyond the horizon before nightfall"
  ]
};

const LEVELS=Object.keys(BANK);

function total(level) {
  return level?BANK[level]?.length??0:
    LEVELS.reduce((n,l)=>n+BANK[l].length,0);
}

function question(index,level="beginner") {
  const list=BANK[level];
  if(!list || !Number.isInteger(index) ||
     index<0 || index>=list.length) return null;

  const english=list[index];
  const indices=[index];
  let step=1;

  while(indices.length<4) {
    const next=(index+step)%list.length;
    if(!indices.includes(next)) indices.push(next);
    step++;
  }

  const shift=index%4;
  const rotated=indices.slice(shift)
    .concat(indices.slice(0,shift));

  return {
    index,level,english,
    runic:RunicEnglish.encode(english),
    options:rotated.map(i=>list[i]),
    answer:rotated.indexOf(index)
  };
}

function check(index,choice,level="beginner") {
  const q=question(index,level);
  return !!q && Number.isInteger(choice) &&
    choice===q.answer;
}

function session(level="beginner",count=10) {
  if(!BANK[level]) return [];

  const indices=BANK[level].map((_,i)=>i);

  for(let i=indices.length-1;i>0;i--) {
    const j=Math.floor(Math.random()*(i+1));
    [indices[i],indices[j]]=[indices[j],indices[i]];
  }

  return indices.slice(0,Math.min(count,indices.length))
    .map(i=>question(i,level));
}

const API={BANK,LEVELS,total,question,check,session};
root.RuneCloze=API;

if(typeof module!=="undefined"&&module.exports)
  module.exports=API;
})(typeof window!=="undefined"?window:globalThis);
