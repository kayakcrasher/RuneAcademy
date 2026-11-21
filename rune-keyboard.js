(function(root) {
"use strict";

const RUNES=Object.freeze([
  ["ᚠ","Fehu","f"],["ᚢ","Uruz","u"],
  ["ᚦ","Thurisaz","th"],["ᚨ","Ansuz","a"],
  ["ᚱ","Raidho","r"],["ᚲ","Kenaz","k"],
  ["ᚷ","Gebo","g"],["ᚹ","Wunjo","w"],
  ["ᚺ","Hagalaz","h"],["ᚾ","Naudiz","n"],
  ["ᛁ","Isaz","i"],["ᛃ","Jera","j/y"],
  ["ᛇ","Eihwaz","ei"],["ᛈ","Perthro","p"],
  ["ᛉ","Algiz","z"],["ᛊ","Sowilo","s"],
  ["ᛏ","Tiwaz","t"],["ᛒ","Berkano","b"],
  ["ᛖ","Ehwaz","e"],["ᛗ","Mannaz","m"],
  ["ᛚ","Laguz","l"],["ᛜ","Ingwaz","ng"],
  ["ᛞ","Dagaz","d"],["ᛟ","Othala","o"]
]);

function insert(text,start,end,value) {
  return text.slice(0,start)+value+text.slice(end);
}

function erase(text,start,end) {
  if(start!==end) return insert(text,start,end,"");
  if(start===0) return text;
  const before=Array.from(text.slice(0,start));
  before.pop();
  return before.join("")+text.slice(end);
}

function mount(container,textarea) {
  if(!container || !textarea) {
    throw new Error("Keyboard target missing");
  }

  const grid=document.createElement("div");
  grid.className="rune-keyboard";
  grid.setAttribute("aria-label","Elder Futhark keyboard");

  const status=document.createElement("p");
  status.className="note";
  status.setAttribute("aria-live","polite");

  function change(value,backspace=false) {
    const start=textarea.selectionStart;
    const end=textarea.selectionEnd;
    const text=textarea.value;

    const result=backspace
      ? erase(text,start,end)
      : insert(text,start,end,value);

    const cursor=backspace
      ? start===end
        ? Array.from(text.slice(0,start))
            .slice(0,-1).join("").length
        : start
      : start+value.length;

    textarea.value=result;
    textarea.focus();
    textarea.setSelectionRange(cursor,cursor);
    textarea.dispatchEvent(
      new Event("input",{bubbles:true})
    );
  }

  function key(label,action,description) {
    const button=document.createElement("button");
    button.type="button";
    button.textContent=label;
    button.title=description || label;
    button.setAttribute(
      "aria-label",description || label
    );
    button.addEventListener("click",action);
    grid.appendChild(button);
    return button;
  }

  for(const [symbol,name,sound] of RUNES) {
    const button=key(symbol,()=>change(symbol),
      `${name} (${sound})`);
    button.textContent="";
    const rune=document.createElement("span");
    rune.className="key-rune";
    rune.textContent=symbol;
    const letter=document.createElement("span");
    letter.className="key-letter";
    letter.textContent={
      "ᚠ":"F/V","ᚲ":"C/K","ᛃ":"J/Y"
    }[symbol] || sound.toUpperCase();
    button.append(rune,letter);
  }

  key("Space",()=>change(" "),"Insert space")
    .classList.add("wide-key");
  key("᛫",()=>change("᛫"),"Rune separator");
  key(".",()=>change("."),"Period");
  key(",",()=>change(","),"Comma");
  key("⌫",()=>change("",true),"Backspace");
  key("Clear",()=>{
    textarea.value="";
    textarea.dispatchEvent(
      new Event("input",{bubbles:true})
    );
    textarea.focus();
    status.textContent="Message cleared";
  }).classList.add("wide-key");

  container.append(grid,status);

  return {grid,status};
}

const API={RUNES,insert,erase,mount};
root.RuneKeyboard=API;

if(typeof module!=="undefined" && module.exports) {
  module.exports=API;
}
})(typeof window!=="undefined" ? window : globalThis);
