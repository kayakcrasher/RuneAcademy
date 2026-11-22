(function(root) {
"use strict";

const RUNES=[
  ["ᚠ","Fehu","f"],["ᚢ","Uruz","u"],
  ["ᚦ","Thurisaz","th"],["ᚨ","Ansuz","a"],
  ["ᚱ","Raidho","r"],["ᚲ","Kenaz","k"],
  ["ᚷ","Gebo","g"],["ᚹ","Wunjo","w"],
  ["ᚺ","Hagalaz","h"],["ᚾ","Naudiz","n"],
  ["ᛁ","Isaz","i"],["ᛃ","Jera","j / y"],
  ["ᛇ","Eihwaz","ï / ei"],["ᛈ","Perthro","p"],
  ["ᛉ","Algiz","z"],["ᛊ","Sowilo","s"],
  ["ᛏ","Tiwaz","t"],["ᛒ","Berkano","b"],
  ["ᛖ","Ehwaz","e"],["ᛗ","Mannaz","m"],
  ["ᛚ","Laguz","l"],["ᛜ","Ingwaz","ng"],
  ["ᛞ","Dagaz","d"],["ᛟ","Othala","o"]
];

const NOTES=[
  ["Cattle, wealth","A main stem with two rising branches"],
  ["Aurochs","Two upright strokes joined diagonally"],
  ["Thorn or giant","A stem with an angular side shape"],
  ["A god or divine association","A stem with two descending branches"],
  ["Riding or journey","A stem with an angular upper loop and leg"],
  ["Torch or ulcer","Two angled strokes meeting a central stem"],
  ["Gift","Two crossing diagonal strokes"],
  ["Joy","A stem with a triangular upper flag"],
  ["Hail","Two uprights connected diagonally"],
  ["Need or distress","A stem crossed by a diagonal"],
  ["Ice","A single upright stroke"],
  ["Year or harvest","Two opposed angular halves"],
  ["Yew","A stem with opposing angled branches"],
  ["Uncertain meaning","An angular bowl-like shape"],
  ["Elk-sedge, uncertain interpretation","A stem with two raised arms"],
  ["Sun","A lightning-like zigzag"],
  ["The god Týr","An upright with two upper branches"],
  ["Birch","A stem with two angular loops"],
  ["Horse","Two stems linked by a diagonal"],
  ["Human","Two uprights joined by angled strokes"],
  ["Water or lake","A stem with a descending branch"],
  ["The god Ing","A diamond-like shape"],
  ["Day","Two opposed triangles meeting"],
  ["Inherited estate","A diamond with two descending legs"]
];

function lesson(index) {
  if(!Number.isInteger(index) ||
     index<0 || index>=24) return null;
  const [symbol,name,sound]=RUNES[index];
  return {
    index,symbol,name,sound,
    meaning:NOTES[index][0],
    shape:NOTES[index][1],
    aett:Math.floor(index/8)+1
  };
}

function options(index) {
  const correct=lesson(index);
  if(!correct) return [];
  const result=[correct.sound];
  for(let step=1;result.length<3;step++) {
    const other=lesson((index+step)%24).sound;
    if(!result.includes(other)) result.push(other);
  }
  return result.sort((a,b)=>a.localeCompare(b));
}

function check(index,answer) {
  const item=lesson(index);
  return !!item && answer===item.sound;
}

const API={lesson,options,check};
root.RuneLessons=API;
if(typeof module!=="undefined" && module.exports)
  module.exports=API;
})(typeof window!=="undefined" ? window : globalThis);
