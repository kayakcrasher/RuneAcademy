(function(root) {
"use strict";

const SENTENCES=[
  "The sun is hot",
  "The moon is bright",
  "The fire is warm",
  "The sky is dark",
  "The wolf is fast",
  "The tree is tall",
  "The river is cold",
  "The bird can fly",
  "The snow is white",
  "The wind is strong"
];

function question(index) {
  if(!Number.isInteger(index) ||
     index<0 || index>=SENTENCES.length)
    return null;

  const english=SENTENCES[index];

  const choices=[
    index,
    (index+1)%SENTENCES.length,
    (index+3)%SENTENCES.length,
    (index+6)%SENTENCES.length
  ];

  // Rotate the answer position each round.
  const shift=index%4;
  const rotated=choices.slice(shift)
    .concat(choices.slice(0,shift));

  return {
    index,
    runic:RunicEnglish.encode(english),
    english,
    options:rotated.map(i=>SENTENCES[i]),
    answer:rotated.indexOf(index)
  };
}

function check(index,choice) {
  const q=question(index);
  return !!q &&
    Number.isInteger(choice) &&
    choice===q.answer;
}

function total() {
  return SENTENCES.length;
}

const API={question,check,total};
root.RuneCloze=API;

if(typeof module!=="undefined"&&module.exports)
  module.exports=API;
})(typeof window!=="undefined"?window:globalThis);
