let page = document.getElementById("buttonDiv");
let img = chrome.runtime.getURL("player_image.png");
//import {tester} from "test.js";
//  parse = require('test.js');

function test_theme() {
  chrome.storage.sync.get("tst", ({ tst }) => {
    document.head.insertAdjacentHTML("beforeend", `<style> ${tst} </style>`);

    /* var theme = document.createElement("style")
        theme.href=tst;
      document.head.appendChild(theme);  */
  });
}
// Add a button to the page for each supplied color
function constructButtons() {
  //test button
  let button = document.createElement("button");
  button.textContent = "test";
  button.addEventListener("click", async () => {
    setValues();
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    //page.appendChild(img);
    //alert(document.getElementById("theme").value);
    //function: test_theme,
    //document.querySelector(".audion-360-print-audio-player-tag").textContent = "Ecouter cet article"
    loadscriptplayer(tab);
  });

  page.appendChild(button);
  /*let button2 = document.createElement("button");
      button2.textContent= "theme";
      button2.addEventListener("click", async () => { 
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function : test_theme,
      }) 
   })*/
  //page.appendChild(button2);
}

function loadscriptplayer(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["script-player.js"],
  });
  document.querySelector(".audion-360-print-audio-player-tag").textContent =
    "Ecouter cet article";
}

function setValues() {
  chrome.storage.sync.set({
    // ancre: ".featured-articles",
    // ancre: ".content-start h2.text-lg, .m-auto h2.text-lg",

    ancre: document.querySelector("#ancre").value,
    position: document.querySelector("#position").value,
    tst: document.getElementById("theme").value,
    titre: "Resources for developers"
    // titre: document.querySelector("h1").value
  });
}

// Initialize the page by constructing the buttons
constructButtons();
