const assert=require("node:assert/strict");
const RE=require("../runic-english.js");

const cases=[
  ["Hello friend","ᚺᛖᛚᛚᛟ ᚠᚱᛁᛖᚾᛞ"],
  ["Think","ᚦᛁᚾᚲ"],
  ["Writing","ᚹᚱᛁᛏᛁᛜ"],
  ["Runic English","ᚱᚢᚾᛁᚲ ᛖᛜᛚᛁᛊᚺ"],
  ["Quick fox","ᚲᚹᛁᚲᚲ ᚠᛟᚲᛊ"],
  ["Ship","ᛊᚺᛁᛈ"],
  ["Phone","ᚠᛟᚾᛖ"],
  ["Sing","ᛊᛁᛜ"],
  ["Cat","ᚲᚨᛏ"],
  ["Very","ᚠᛖᚱᛃ"],
  ["Knight","ᚲᚾᛁᚷᚺᛏ"],
  ["Hello, world!","ᚺᛖᛚᛚᛟ, ᚹᛟᚱᛚᛞ!"],
  ["2026","2026"]
];

for (const [english,expected] of cases) {
  assert.equal(
    RE.encode(english),
    expected,
    `Failed: ${english}`
  );
  console.log("PASS:",english);
}

assert.equal(RE.VERSION,"HRE-24/1.0");
assert.equal(RE.encode("TH"),RE.encode("th"));
assert.throws(()=>RE.encode(null),TypeError);

console.log("HRE-24 compliance tests passed");
