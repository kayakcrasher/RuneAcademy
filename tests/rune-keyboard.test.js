const assert=require("node:assert/strict");
const K=require("../rune-keyboard.js");

assert.equal(K.RUNES.length,24);

const symbols=K.RUNES.map(r=>r[0]);
assert.equal(new Set(symbols).size,24);

assert.equal(
  K.insert("ᚠᚢ",2,2,"ᚦ"),
  "ᚠᚢᚦ"
);

assert.equal(
  K.insert("ᚠᚢᚦ",1,2,"ᚨ"),
  "ᚠᚨᚦ"
);

assert.equal(
  K.erase("ᚠᚢᚦ",3,3),
  "ᚠᚢ"
);

assert.equal(
  K.erase("ᚠᚢᚦ",1,3),
  "ᚠ"
);

assert.equal(
  K.erase("",0,0),
  ""
);

assert.equal(
  K.insert("ᚠ",1,1," "),
  "ᚠ "
);

console.log("ALL RUNE KEYBOARD TESTS PASSED");
