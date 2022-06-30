let page = document.getElementById("buttonDiv");
let img = chrome.runtime.getURL("player_image.png");
//import {tester} from "test.js";
//  parse = require('test.js');

/* function test_theme() {
  chrome.storage.sync.get("tst", ({ tst }) => {
    chrome.storage.sync.get("couleur", ({ couleur }) => {
      document.head.insertAdjacentHTML(
        "beforeend",
        `<style> ${tst} </style> <style> .audion-360-print-audio-player-btn{background-color : ${couleur}} </style> <style> .audion-360-print-audio-player-tag{background-color : ${couleur}} </style>`
      );
       document.head.insertAdjacentHTML(
        "beforeend",
        `<style> .audion-360-print-audio-player-btn{background-color : ${couleur}} </style>`
      );
      document.head.insertAdjacentHTML(
        "beforeend",
        `<style> .audion-360-print-audio-player-tag{background-color : ${couleur}} </style>`
      ); 
       var theme = document.createElement("style")
        theme.href=tst;
      document.head.appendChild(theme);  
    });
  });
} */
// Add a button to the page for each supplied color
function constructButtons() {
  //test button
  let button = document.createElement("button");
  button.textContent = "test";
  button.addEventListener("click", async () => {
    //alert("bouton cliqué");
    setValues();
    //alert("values set");
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    loadscriptplayer(tab);
  });
  page.appendChild(button);

  /* let button2 = document.createElement("button");
  button2.textContent = "theme";
  button2.addEventListener("click", async () => {
    setValues();

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      //function: test_theme(couleur),
    });
  });
  page.appendChild(button2); */
}

function loadscriptplayer(tab) {
  //alert("loadscript player ");
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["script-player.js"],
  });
  //alert("fonction finie");
  //document.querySelector(".audion-360-print-audio-player-tag").textContent =
  // "Ecouter cet article";
}

function setValues() {
  chrome.storage.sync.set({
    //ancre: ".featured-articles",
    // ancre: ".content-start h2.text-lg, .m-auto h2.text-lg",

    ancre: document.querySelector("#ancre").value,
    position: document.querySelector("#position").value,
    tst: document.getElementById("theme").value,
    titre: document.querySelector("#titre").value,
    couleur: document.querySelector("#couleur").value,
    marge_top: document.querySelector("#marge-top").value,
    marge_bottom: document.querySelector("#marge-bottom").value,
    sombre: document.querySelector("#theme_sombre").value,
  });
}

// Initialize the page by constructing the buttons
constructButtons();
