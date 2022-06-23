(function () {
  chrome.storage.sync.get("position", ({ position }) => {
    chrome.storage.sync.get("ancre", ({ ancre }) => {
      chrome.storage.sync.get("titre", ({ titre }) => {
        alert(position + ancre + titre);
        var sessionId = null;
        var sessionIdEventDebug = undefined;
        var collectionId = "uELp0anTnrqw";
        var canonicalUrl = getCanonical();
        var referer = window.location.origin;
        var containers = {
          thin: { selector: `${ancre}`, position: `${position}` },
          //float: { selector: "main", position: "beforeend" },
        };
        var mainContainer =
          containers.thin || containers.sticky || containers.float;
        function getCanonical() {
          var canonical = document.querySelector("[rel=canonical]");
          return (
            (canonical && canonical.href) ||
            window.location.origin + window.location.pathname
          );
        }
        /* function sendTracking(body) {
    const trackingBody = {
      ...body,
      user_agent: navigator.userAgent,
      canonical_url: canonicalUrl,
      collection_id: collectionId,
      referer,
      session_id: sessionId,
    };
    const trackingImg = document.createElement("img");
    trackingImg.src = `https://t.360.dev.audion.fm/v2/event?${Object.entries(
      trackingBody
    )
      .map(([key, value]) =>
        value !== null && value !== ""
          ? `${key}=${encodeURIComponent(value)}`
          : null
      )
      .filter((value) => value !== null)
      .join("&")}`;
    trackingImg.style.position = "absolute";
    trackingImg.style.top = 0;
    trackingImg.style.left = 0;
    trackingImg.style.height = "1px";
    trackingImg.style.width = "1px";
    trackingImg.style.display = "inline-block";
    document.body.append(trackingImg);
  } */
        /* async function fetchSessionId() {
    return await fetch(
      `https://api.360.dev.audion.fm/public/playerScripts/v1/session?v=${Date.now()}`
    )
      .then(function (res) {
        if (!res.ok) {
          throw new Error(
            JSON.stringify({
              message: "Error while fetching session id",
              body: {
                status: res.status,
                statusText: res.statusText,
                url: res.url,
              },
            })
          );
        }
        return res.json();
      })
      .then(function (json) {
        if (!json.id) {
          throw new Error(
            JSON.stringify({
              message: "session id not found in response body",
              body: { body: json },
            })
          );
        }
        return json.id;
      })
      .catch(function (err) {
        sessionIdEventDebug = err.message;
        return null;
      });
  } */
        function setupContainer() {
          var container = document.createElement("div");
          container.id = "audion-360-print-audio-player";
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
          var mainSelector = document.querySelector(mainContainer.selector);
          mainSelector.insertAdjacentElement(mainContainer.position, container);
          /* if (mainSelector) {
      mainSelector.insertAdjacentElement(mainContainer.position, container);
      sendTracking({ event_type: "script_load", event_value_string: "valid" });
    } else {
      sendTracking({
        event_type: "script_load",
        event_value_string: "player_container_not_found",
        event_debug: JSON.stringify({
          message: "mainSelector has not been found in html",
          body: { mainSelector: mainContainer.selector },
        }),
      });
    } */
        }
        function createPlayer() {
          var playerUrl = "https://dev-player.360.audion.fm/v3/latest";
          var container = document.querySelector(mainContainer.selector);
          var link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = playerUrl + "/index.css";
          container.append(link);
          /* var theme = document.createElement("link");
    theme.rel = "stylesheet";
    theme.href = "https://dev-player.360.audion.fm/themes/6vtJrInqHhp6.css"; */
          //container.append(theme);
          fetch(playerUrl + "/player.html")
            .then(function (res) {
              return res.text();
            })
            .then(function (html) {
              var parser = new DOMParser();
              var doc = parser.parseFromString(html, "text/html");
              var setupBody = doc.querySelector(
                "#audion-360-print-audio-player-setup"
              );
              if (setupBody && container) {
                container.append(setupBody);
                var script = document.createElement("script");
                script.src = "./Desktop/extension_player-integration/index.js";
                container.append(script);
              }
              var playerThinBody = doc.querySelector(
                "#audion-360-print-audio-player-body-thin"
              );
              var playerThinSelector = document.querySelector(
                containers.thin && containers.thin.selector
              );
              if (playerThinBody && playerThinSelector) {
                //playerThinBody.style.visibility = "hidden";
                playerThinSelector.insertAdjacentElement(
                  containers.thin.position,
                  playerThinBody
                );
              }
              /* var playerFloatBody = doc.querySelector(
          "#audion-360-print-audio-player-body-float"
        );
        var playerFloatSelector = document.querySelector(
          containers.float && containers.float.selector
        );
        if (playerFloatBody && playerFloatSelector) {
          playerFloatBody.style.visibility = "hidden";
          playerFloatSelector.insertAdjacentElement(
            containers.float.position,
            playerFloatBody
          );
        } */
            });
        }
        function setupPlayer() {
          setupContainer();
          createPlayer();
        }
        setupPlayer();
        document.querySelector(
          ".audion-360-print-audio-player-tag"
        ).textContent = "Ecouter cet article";
        alert(document.querySelector(".audion-360-print-audio-player-tag"));
        /* Promise.all([fetchSessionId()]).then(([fetchedSessionId]) => {
    if (fetchedSessionId) {
      sessionId = fetchedSessionId;
      setupPlayer();
    } else {
      sendTracking({
        event_type: "script_load",
        event_value_string: "session_id_not_provided",
        event_debug: sessionIdEventDebug,
      });
    }
  }); */
      });
    });
  });
})();
