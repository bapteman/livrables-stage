chrome.storage.sync.get("position", ({ position }) => {
  chrome.storage.sync.get("creation", ({ creation }) => {
    chrome.storage.sync.get("ancre", ({ ancre }) => {
      chrome.storage.sync.get("titre", ({ titre }) => {
        chrome.storage.sync.get("couleur", ({ couleur }) => {
          chrome.storage.sync.get("marge_top", ({ marge_top }) => {
            chrome.storage.sync.get("marge_bottom", ({ marge_bottom }) => {
              chrome.storage.sync.get("sombre", ({ sombre }) => {
                chrome.storage.sync.get("tst", ({ tst }) => {
                  chrome.storage.sync.get(
                    "balise_sombre",
                    ({ balise_sombre }) => {
                      chrome.storage.sync.get(
                        "unite_marge_bottom",
                        ({ unite_marge_bottom }) => {
                          chrome.storage.sync.get(
                            "unite_marge_top",
                            ({ unite_marge_top }) => {
                              //alert(position + ancre + titre);
                              if (creation == 1) {
                                if (
                                  document.querySelector(
                                    "audion-360-print-audio-player"
                                  )
                                ) {
                                  document
                                    .querySelector(
                                      "audion-360-print-audio-player"
                                    )
                                    .remove();
                                  document.querySelector(
                                    "audion-360-print-audio-player-body-thin"
                                  ).remove;
                                }
                                test1 = document.getElementById(
                                  "audion-360-print-audio-player-body-thin"
                                );
                                test2 = document.getElementById(
                                  "audion-360-print-audio-player"
                                );
                                if (test1) {
                                  test1.remove();
                                }
                                if (test2) {
                                  test2.remove();
                                }
                                //alert("position, ancre");
                                var sessionId = null;
                                var sessionIdEventDebug = undefined;
                                var collectionId = "uELp0anTnrqw";
                                var canonicalUrl = getCanonical();
                                var referer = window.location.origin;
                                var containers = {
                                  thin: {
                                    selector: `${ancre}`,
                                    position: `${position}`,
                                  },
                                  //float: { selector: "main", position: "beforeend" },
                                };
                                var mainContainer =
                                  containers.thin ||
                                  containers.sticky ||
                                  containers.float;
                                function getCanonical() {
                                  var canonical =
                                    document.querySelector("[rel=canonical]");
                                  return (
                                    (canonical && canonical.href) ||
                                    window.location.origin +
                                      window.location.pathname
                                  );
                                }

                                function setupContainer() {
                                  var container = document.createElement("div");
                                  container.id =
                                    "audion-360-print-audio-player";
                                  container.dataset.id = collectionId;
                                  container.dataset.sessionId = sessionId;
                                  container.dataset.canonicalUrl = canonicalUrl;
                                  container.dataset.referer = referer;
                                  container.dataset.players = JSON.stringify({
                                    thin: "audion-360-print-audio-player-root-thin",
                                    //float: "audion-360-print-audio-player-root-float",
                                  });
                                  container.dataset.title = `${titre}`;
                                  container.dataset.lang = "fr-FR";
                                  container.dataset.dictionary =
                                    '{"listen_to_this_article":"Ecouter cet article","ad":"Annonce","your_content_after_this_ad":"Votre contenu après cette annonce","powered_by":"Powered by","wait":"/wait.fr.mp3"}';
                                  container.style.display = "none";
                                  var mainSelector = document.querySelector(
                                    mainContainer.selector
                                  );
                                  mainSelector.insertAdjacentElement(
                                    mainContainer.position,
                                    container
                                  );
                                }
                                function createPlayer() {
                                  var playerUrl =
                                    "https://dev-player.360.audion.fm/v3/latest";
                                  var container = document.querySelector(
                                    mainContainer.selector
                                  );
                                  var link = document.createElement("link");
                                  link.rel = "stylesheet";
                                  link.href = playerUrl + "/index.css";
                                  container.append(link);

                                  var parser = new DOMParser();
                                  var doc = parser.parseFromString(
                                    getPlayerHTML(
                                      document.querySelector(`${titre}`)
                                        .textContent
                                    ),
                                    "text/html"
                                  );
                                  var setupBody = doc.querySelector(
                                    "#audion-360-print-audio-player-setup"
                                  );
                                  if (setupBody && container) {
                                    container.append(setupBody);
                                    // var script = document.createElement("script");
                                    // script.src = "./index.js";
                                    // container.append(script);
                                  }
                                  var playerThinBody = doc.querySelector(
                                    "#audion-360-print-audio-player-body-thin"
                                  );
                                  var playerThinSelector =
                                    document.querySelector(
                                      containers.thin &&
                                        containers.thin.selector
                                    );
                                  if (playerThinBody && playerThinSelector) {
                                    playerThinSelector.insertAdjacentElement(
                                      containers.thin.position,
                                      playerThinBody
                                    );
                                  }
                                  const btnPlays = Array.from(
                                    document.getElementsByClassName(
                                      "audion-360-print-audio-player-btn"
                                    )
                                  );
                                  const playerAudio = document.getElementById(
                                    "audion-360-print-audio-player-audio"
                                  );
                                  btnPlays.forEach((btn) =>
                                    btn.addEventListener("click", () => {
                                      playerAudio.play();
                                      playerAudio.autoplay = true;
                                    })
                                  );
                                }
                                function setupPlayer() {
                                  setupContainer();
                                  createPlayer();
                                }
                                setupPlayer();
                              }
                              if (creation == 0) {
                                if (couleur) {
                                  setupCouleur(couleur);
                                }
                                if (marge_top) {
                                  setupMargetop(marge_top, unite_marge_top);
                                }
                                if (marge_bottom) {
                                  setupMargebottom(
                                    marge_bottom,
                                    unite_marge_bottom
                                  );
                                }
                                if (tst) {
                                  setupTheme(tst);
                                }
                                if (sombre) {
                                  setupSombre(balise_sombre);
                                }
                              }
                              if (creation == 2) {
                                document.head
                                  .querySelectorAll(".audion-360-player-style")
                                  .forEach((element) => element.remove());
                              }
                            }
                          );
                        }
                      );
                    }
                  );
                });
              });
            });
          });
        });
      });
    });
  });
});

function getPlayerHTML(title) {
  return `
<div id="audion-360-print-audio-player-setup" style="width:0;height:0">
<div id="audion-360-print-audio-player-root"></div>
<audio id="audion-360-print-audio-player-audio"
    preload="none" src="https://media.360.audion.fm/sites/AKLgDdNYtj4G/printAudio/vAbmTPzJUCf7/1655988245664.mp3"></audio>
    <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <mask id="encoderMask" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <path fill="#fff" d="M0 0h16v16H0z" />
    </mask>
    <mask id="loaderMask" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <path fill="#fff" d="M0 0h24v24H0z" />
    </mask>
</svg>
</div>
<div id="audion-360-print-audio-player-body-thin" class="audion-360-print-audio-player-body">
<div class="audion-360-print-audio-player-content">
    <div class="audion-360-print-audio-player-poweredBy">
    Powered By
        <a class="audion-360-print-audio-player-poweredByAudion" href="https://www.audion.fm/" target="_blank"
            rel="noopener">Audion</a>
    </div>
    <div class="audion-360-print-audio-player-placeholder">
        <button class="audion-360-print-audio-player-btn">
            <svg class="audion-360-print-audio-player-btnLoaderIcon" fill="none"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <g mask="url(#loaderMask)">
                    <circle cx="24" cy="24" r="21.4" stroke-width="2" />
                </g>
            </svg>
            <svg class="audion-360-print-audio-player-btnEncoderIcon" fill="none"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <g mask="url(#encoderMask)">
                    <circle cx="24" cy="24" r="21.4" stroke-width="2" />
                </g>
            </svg>
            <div class="audion-360-print-audio-player-btnIdle">
                <div class="audion-360-print-audio-player-btnIdleAnimation"></div>
            </div>
            <svg class="audion-360-print-audio-player-btnPlayIcon" fill="none"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31 34">
                <path
                    d="M23.8 22l-1.8.9V17h-2.5v7.4l-1.7 1V11.8h-2.6v15l-1.6.9V14.5H11v14.8l-1.7 1V19.5H6.7v12.2l-1.6 1V16.1H2.5V34a2 2 0 01-2.1-2V2.1a2 2 0 013-1.8l25.9 15a2 2 0 010 3.4l-3 1.7v-5.1h-2.5v6.6z" />
            </svg>
        </button>
        <div class="audion-360-print-audio-player-controls">
            <div class="audion-360-print-audio-player-top">
                <div class="audion-360-print-audio-player-header">
                    <div class="audion-360-print-audio-player-tag">Ecouter cet article</div>
                    <div class="audion-360-print-audio-player-title">
                        <div class="audion-360-print-audio-player-titleText">${title}</div>
                    </div>
                </div>
                <div class="audion-360-print-audio-player-time">00:00</div>
            </div>
            <div class="audion-360-print-audio-player-progress">
                <div class="audion-360-print-audio-player-progressBackground"></div>
            </div>
        </div>
    </div>
    <div id="audion-360-print-audio-player-root-thin"></div>
</div>
</div>
`;
}

function setupCouleur(couleur) {
  chrome.storage.sync.set({ couleur: couleur });
  document.head.insertAdjacentHTML(
    "beforeend",
    `<style class="audion-360-player-style"> .audion-360-print-audio-player-btn{background-color : ${couleur} !important} 
.audion-360-print-audio-player-tag{background-color : ${couleur} !important} 
#audion-360-print-audio-player-body-thin .audion-360-print-audio-player-poweredByAudion{color : ${couleur} !important;} </style>`
  );
}

function setupMargetop(marge_top, unite_marge_top) {
  chrome.storage.sync.set({ marge_top: marge_top });
  chrome.storage.sync.set({ unite_marge_top: unite_marge_top });
  document.head.insertAdjacentHTML(
    "beforeend",
    `<style class="audion-360-player-style"> #audion-360-print-audio-player-body-thin{margin-top :${marge_top}${unite_marge_top} !important;}`
  );
}

function setupMargebottom(marge_bottom, unite_marge_bottom) {
  chrome.storage.sync.set({ marge_bottom: marge_bottom });
  chrome.storage.sync.set({ unite_marge_bottom: unite_marge_bottom });
  document.head.insertAdjacentHTML(
    "beforeend",
    `<style class="audion-360-player-style"> #audion-360-print-audio-player-body-thin{margin-bottom : ${marge_bottom}${unite_marge_bottom} !important}`
  );
}

function setupTheme(tst) {
  chrome.storage.sync.set({ tst: tst });
  document.head.insertAdjacentHTML(
    "beforeend",
    `<style class="audion-360-player-style"> ${tst} </style> `
  );
}

function setupSombre(balise_sombre) {
  if (balise_sombre) {
    chrome.storage.sync.set({ balise_sombre: balise_sombre });
    document.head.insertAdjacentHTML(
      "beforeend",
      `<style class="audion-360-player-style">${balise_sombre} .audion-360-print-audio-player-titleText{color : white !important;}${balise_sombre} .audion-360-print-audio-player-time{color : white !important;}${balise_sombre} .audion-360-print-audio-player-poweredBy{color : white !important;}</style>`
    );
  } else {
    document.head.insertAdjacentHTML(
      "beforeend",
      `<style class="audion-360-player-style">.audion-360-print-audio-player-titleText{color : white !important;}.audion-360-print-audio-player-time{color : white !important;}.audion-360-print-audio-player-poweredBy{color : white !important;}</style>`
    );
  }
}
