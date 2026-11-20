(function(root) {
"use strict";

const VERSION = "HRE-24/1.0";

const PAIRS = Object.freeze({
  th:"ᚦ",
  sh:"ᛊᚺ",
  ch:"ᚲᚺ",
  ng:"ᛜ",
  ph:"ᚠ",
  ck:"ᚲ",
  qu:"ᚲᚹ"
});

const LETTERS = Object.freeze({
  a:"ᚨ", b:"ᛒ", c:"ᚲ", d:"ᛞ",
  e:"ᛖ", f:"ᚠ", g:"ᚷ", h:"ᚺ",
  i:"ᛁ", j:"ᛃ", k:"ᚲ", l:"ᛚ",
  m:"ᛗ", n:"ᚾ", o:"ᛟ", p:"ᛈ",
  q:"ᚲ", r:"ᚱ", s:"ᛊ", t:"ᛏ",
  u:"ᚢ", v:"ᚠ", w:"ᚹ", x:"ᚲᛊ",
  y:"ᛃ", z:"ᛉ"
});

function encode(text) {
  if (typeof text !== "string") {
    throw new TypeError("Expected a string");
  }

  const input = text.toLowerCase();
  let output = "";

  for (let i=0;i<input.length;) {
    const pair=input.slice(i,i+2);

    if (Object.hasOwn(PAIRS,pair)) {
      output+=PAIRS[pair];
      i+=2;
      continue;
    }

    const letter=input[i];
    output+=LETTERS[letter] ?? letter;
    i++;
  }

  return output;
}

const API=Object.freeze({
  VERSION,PAIRS,LETTERS,encode
});

root.RunicEnglish=API;

if(typeof module!=="undefined" && module.exports) {
  module.exports=API;
}
})(typeof window!=="undefined" ? window : globalThis);
