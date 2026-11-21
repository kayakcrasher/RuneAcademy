(function() {
"use strict";

const message=document.querySelector("#runeMessage");
const status=document.querySelector("#messageStatus");

RuneKeyboard.mount(
  document.querySelector("#messageKeyboard"),
  message
);

RuneKeyboard.mount(
  document.querySelector("#trialKeyboard"),
  document.querySelector("#trialAnswer")
);

async function copy(text) {
  if(!text.trim()) {
    status.textContent="Write a message first.";
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    status.textContent="ᚠ Message copied!";
  } catch {
    message.focus();
    message.select();
    status.textContent=
      "Select Copy from your phone's text menu.";
  }
}

document.querySelector("#copyMessage")
  .addEventListener("click",()=>{
    copy(message.value);
  });

document.querySelector("#shareMessage")
  .addEventListener("click",async()=>{
    const text=message.value;
    if(!text.trim()) {
      status.textContent="Write a message first.";
      return;
    }

    if(navigator.share) {
      try {
        await navigator.share({
          title:"Rune Academy",
          text
        });
        status.textContent="Share menu opened.";
      } catch(err) {
        if(err.name!=="AbortError") {
          status.textContent="Unable to share.";
        }
      }
    } else {
      await copy(text);
    }
  });
})();
