let page = document.querySelector(".position-button");
let page2 = document.getElementById("theme-player");
let creation;

//fonction pour créer une boîte d'alerte personalisée
function createCustomAlert(txt) {
  var ALERT_TITLE = "texte";
  var ALERT_BUTTON_TEXT = "Ok";
  d = document;

  if (d.getElementById("modalContainer")) {
    removeCustomAlert();
  }
  mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
  mObj.id = "modalContainer";
  mObj.style.height = d.documentElement.scrollHeight + "px";

  alertObj = mObj.appendChild(d.createElement("div"));
  alertObj.id = "alertBox";
  if (d.all && !window.opera)
    alertObj.style.top = document.documentElement.scrollTop + "px";
  alertObj.style.left =
    (d.documentElement.scrollWidth - alertObj.offsetWidth) / 2 + "px";
  alertObj.style.visiblity = "visible";

  h1 = alertObj.appendChild(d.createElement("h1"));
  h1.appendChild(d.createTextNode(ALERT_TITLE));

  msg = alertObj.appendChild(d.createElement("p"));
  msg.appendChild(d.createTextNode(txt));
  msg.innerHTML = txt;

  btn = alertObj.appendChild(d.createElement("a"));
  btn.id = "closeBtn";
  btn.appendChild(d.createTextNode(ALERT_BUTTON_TEXT));
  btn.href = "#";
  btn.focus();
  btn.onclick = function () {
    removeCustomAlert();
    return false;
  };

  alertObj.style.display = "block";
}

function default_values() {
  chrome.storage.sync.get("couleur", ({ couleur }) => {
    chrome.storage.sync.get("marge_top", ({ marge_top }) => {
      chrome.storage.sync.get("marge_bottom", ({ marge_bottom }) => {
        chrome.storage.sync.get("tst", ({ tst }) => {
          chrome.storage.sync.get("balise_sombre", ({ balise_sombre }) => {
            chrome.storage.sync.get(
              "unite_marge_bottom",
              ({ unite_marge_bottom }) => {
                chrome.storage.sync.get(
                  "unite_marge_top",
                  ({ unite_marge_top }) => {
                    chrome.storage.sync.get("sombre", ({ sombre }) => {
                      chrome.storage.sync.get("position", ({ position }) => {
                        chrome.storage.sync.get("ancre", ({ ancre }) => {
                          chrome.storage.sync.get("titre", ({ titre }) => {
                            document.querySelector("#couleur").value = couleur;
                            document.getElementById("theme").value = tst;
                            document.querySelector("#marge-top").value =
                              marge_top;
                            document.querySelector("#marge-bottom").value =
                              marge_bottom;
                            document.querySelector("#balise-sombre").value =
                              balise_sombre;
                            document.querySelector(
                              "#marge-bottom-unite"
                            ).value = unite_marge_bottom;
                            document.querySelector("#marge-top-unite").value =
                              unite_marge_top;
                            document.querySelector("#ancre").value = ancre;
                            document.querySelector("#position").value =
                              position;
                            document.querySelector("#titre").value = titre;
                            document.querySelector("#theme_sombre").value =
                              sombre;
                          });
                        });
                      });
                    });
                  }
                );
              }
            );
          });
        });
      });
    });
  });
}

function scss() {
  let tst = document.getElementById("theme").value;
  let couleur = document.querySelector("#couleur").value;
  let marge_top = document.querySelector("#marge-top").value;
  let unite_marge_top = document.querySelector("#marge-top-unite").value;
  let marge_bottom = document.querySelector("#marge-bottom").value;
  let unite_marge_bottom = document.querySelector("#marge-bottom-unite").value;
  let sombre = document.querySelector("#theme_sombre").value;
  let balise_sombre = document.querySelector("#balise-sombre").value;
  let code_scss =
    `.audion-360-print-audio-player-body {
                        --print-audio-primary: ${couleur}
}\n\n` +
    `#audion-360-print-audio-player-body-thin {
                        margin-bottom: ${marge_bottom}${unite_marge_bottom};
}\n\n` +
    `#audion-360-print-audio-player-body-thin {
                        margin-top: ${marge_top}${unite_marge_top};
};\n\n`;
  +`${balise_sombre} .audion-360-print-audio-player-body {
                            --print-audio-text : white;    
}\n\n`;
  code_scss += `${tst}`;
  return code_scss;
}

// Add a button to the page for each supplied color
function constructButton1() {
  //test button
  let button = document.createElement("button");
  button.textContent = "creation-player";
  button.addEventListener("click", async () => {
    creation = 1;
    setValues1();
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    loadscriptplayer(tab);
  });
  page.appendChild(button);

  let button2 = document.createElement("button");
  button2.textContent = "theme";
  button2.addEventListener("click", async () => {
    creation = 0;
    setValues();
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    loadscriptplayer(tab);
  });
  page2.appendChild(button2);
  let button3 = document.createElement("button");
  button3.textContent = "generer scss";
  button3.addEventListener("click", async () => {
    var css = scss();
    alert(css);
  });
  page2.appendChild(button3);

  let button4 = document.createElement("button");
  button4.textContent = "remove-theme";
  button4.addEventListener("click", async () => {
    creation = 2;
    setValues();
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    loadscriptplayer(tab);
  });
  page2.appendChild(button4);
}

function loadscriptplayer(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["script-player.js"],
  });
}

function setValues1() {
  chrome.storage.sync.set({
    creation: creation,
    ancre: document.querySelector("#ancre").value,
    position: document.querySelector("#position").value,
    titre: document.querySelector("#titre").value,
  });
}

function setValues() {
  chrome.storage.sync.set({
    creation: creation,
    tst: document.getElementById("theme").value,
    couleur: document.querySelector("#couleur").value,
    marge_top: document.querySelector("#marge-top").value,
    unite_marge_top: document.querySelector("#marge-top-unite").value,
    marge_bottom: document.querySelector("#marge-bottom").value,
    unite_marge_bottom: document.querySelector("#marge-bottom-unite").value,
    sombre: document.querySelector("#theme_sombre").value,
    balise_sombre: document.querySelector("#balise-sombre").value,
  });
}

// Initialize the page by constructing the buttons

constructButton1();

//initialize default values
default_values();
