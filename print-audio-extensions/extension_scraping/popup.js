//get the div for the buttons
let page = document.getElementById("buttonDiv");

//function to initialize default values
function defaultValues() {
  chrome.storage.sync.get("root", ({ root }) => {
    chrome.storage.sync.get("titre", ({ titre }) => {
      chrome.storage.sync.get("paragraphes", ({ paragraphes }) => {
        chrome.storage.sync.get("sous_titres", ({ sous_titres }) => {
          chrome.storage.sync.get("intro", ({ intro }) => {
            chrome.storage.sync.get("exc", ({ exc }) => {
              document.querySelector("#root").value = root;
              document.querySelector("#intro").value = intro;
              document.querySelector("#paragraphes").value = paragraphes;
              document.querySelector("#sous-titres").value = sous_titres;
              document.querySelector("#titre").value = titre;
              document.querySelector("#test").value = "";
            });
          });
        });
      });
    });
  });
}

//function to create the text used to display the selectors

//function to create a custom alert box
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
  //msg.appendChild(d.createTextNode(txt));
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
//function to remove the alert box (triggered by the button ok)
function removeCustomAlert() {
  document
    .getElementsByTagName("body")[0]
    .removeChild(document.getElementById("modalContainer"));
}

//function to initialize the values inputed by the user
function setUpValues() {
  chrome.storage.sync.set({ root: document.querySelector("#root").value });
  chrome.storage.sync.set({ titre: document.querySelector("#titre").value });
  chrome.storage.sync.set({
    paragraphes: document.querySelector("#paragraphes").value,
  });
  chrome.storage.sync.set({
    sous_titres: document.querySelector("#sous-titres").value,
  });
  chrome.storage.sync.set({ intro: document.querySelector("#intro").value });
}

function scrapedText() {
  chrome.storage.sync.get("root", ({ root }) => {
    chrome.storage.sync.get("titre", ({ titre }) => {
      chrome.storage.sync.get("paragraphes", ({ paragraphes }) => {
        chrome.storage.sync.get("sous-titres", ({ sous_titres }) => {
          chrome.storage.sync.get("intro", ({ intro }) => {
            var r = document.querySelector(root);
            if (titre) {
              var t = r.querySelector(titre);
            }
            if (paragraphes) {
              var p = r.querySelectorAll(paragraphes);
            }
            var st = r.querySelectorAll(sous_titres);
            if (intro) {
              var i = r.querySelector(intro);
            }
            if (t) {
              t = t.innerText;
            }
            if (i) {
              i = i.innerText;
            }
            var s_t = "";
            st.forEach((element) => {
              s_t += element.innerText;
            });
            var par = "";
            p.forEach((element) => {
              par += element.innerText;
            });
            let clip = "";
            if (t) {
              clip += `TITRE : ${t}` + "<br>" + "<br>";
            }
            if (i) {
              clip += `INTRO : ${i}` + "<br>" + "<br>";
            }
            if (s_t) {
              clip += `SOUS-TITRES : ${s_t}` + "<br>" + "<br>";
            }

            clip += `PARAGRAPHES : ${par}` + "<br>" + "<br>";
            chrome.storage.sync.set({ clip: clip });
          });
        });
      });
    });
  });
}

//function for the button "setup"
function colors() {
  chrome.storage.sync.get("root", ({ root }) => {
    chrome.storage.sync.get("titre", ({ titre }) => {
      chrome.storage.sync.get("paragraphes", ({ paragraphes }) => {
        chrome.storage.sync.get("sous-titres", ({ sous_titres }) => {
          chrome.storage.sync.get("intro", ({ intro }) => {
            chrome.storage.sync.get("exc", ({ exc }) => {
              var r = document.querySelector(root);
              if (titre) {
                var t = r.querySelector(titre);
              }
              if (paragraphes) {
                var p = r.querySelectorAll(paragraphes);
              }
              var st = r.querySelectorAll(sous_titres);
              if (intro) {
                var i = r.querySelector(intro);
              }

              p.forEach((pItem) => {
                pItem.style.setProperty("background-color", "blue");
              });
              if (t) {
                t.style.setProperty("background-color", "green");
              }
              if (st) {
                st.forEach((stItem) => {
                  stItem.style.setProperty("background-color", "red");
                });
              }
              if (i) {
                i.style.setProperty("background-color", "orange");
              }
            });
          });
        });
      });
    });
  });
}

// create the buttons
function constructbuttons() {
  let setUpButton = document.createElement("button");
  setUpButton.textContent = "Color scraped text";
  setUpButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    setUpValues();
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: colors,
    });
  });
  page.appendChild(setUpButton);

  let textButton = document.createElement("button");
  textButton.textContent = "Display scraped text";
  textButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    setUpValues();
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: scrapedText,
    });
    chrome.storage.sync.get("clip", ({ clip }) => {
      createCustomAlert(clip);
    });
  });
  page.appendChild(textButton);
}

// Initialize the page by constructing the button
constructbuttons();

//initialize default values
defaultValues();
