(() => {
    const env = ENV_VARIABLE;
    const POLL_INTERVAL = 1000;
    const STARTED_CLASS = 'print-audio-started';
    const LOADING_CLASS = 'print-audio-loading';
    const WAITING_CLASS = 'print-audio-waiting';
    const PROCESSING_CLASS = 'print-audio-processing';
    const READY_CLASS = 'print-audio-ready';
    const APP_READY_CLASS = 'print-audio-app-ready';
    const ABOVE_CLASS = 'print-audio-above-view';
    const BELOW_CLASS = 'print-audio-below-view';

    const poll = async ({ fn, validate, shouldAbort, beforeRetry, interval }) => {
        const executePoll = async (resolve, reject) => {
            const result = await fn();

            if (validate(result)) {
                return resolve(result);
            } else if (shouldAbort(result)) {
                return reject(new Error('Abort polling'));
            } else {
                beforeRetry();
                setTimeout(executePoll, interval, resolve, reject);
            }
        };

        return new Promise(executePoll);
    };

    const sendTracking = (body) => {
        const trackingBody = {
            ...body,
            user_agent: navigator.userAgent,
            canonical_url: canonicalUrl,
            collection_id: collectionId,
            referer,
            session_id: sessionId,
        };
        const trackingUrl = TRACKING_URL;
        const cloudFunctionImg = document.createElement('img');
        cloudFunctionImg.src = `${trackingUrl}?${Object.entries(trackingBody)
            .map(([key, value]) =>
                value !== null && value !== ''
                    ? `${key}=${encodeURIComponent(value)}`
                    : null
            )
            .filter((value) => value !== null)
            .join('&')}`;
        cloudFunctionImg.className = 'print-audio-pixelImg';
        container.append(cloudFunctionImg);
    };

    const setupLang = () => {
        const dataDictionary =
            (container.dataset.dictionary &&
                JSON.parse(container.dataset.dictionary)) ||
            {};
        const defaultDictionary = {
            listen_to_this_article: 'Ecouter cet article',
            ad: 'Annonce',
            your_content_after_this_ad: 'Votre contenu après cette annonce',
            powered_by: 'Powered by',
            wait: '/wait.fr.mp3',
        };
        dictionary = {
            ...defaultDictionary,
            ...dataDictionary,
        };
    };

    const translate = (key) => dictionary[key] || key;

    const createPlayer = (data) => {
        const playerUrl = PLAYER_URL;
        container.dataset.printAudioId = data.id;
        container.dataset.title = data.displayTitle;
        container.dataset.url = data.contentUrl;
        container.dataset.sessionId = sessionId;
        container.dataset.markers = JSON.stringify(data.markers || []);

        if (env === 'local') {
            const script = document.createElement('script');
            script.src = './static/js/bundle.js';
            container.append(script);
        }

        if (env === 'production') {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `${playerUrl}/static/css/main.css`;
            container.append(link);

            const script = document.createElement('script');
            script.src = `${playerUrl}/static/js/main.js`;
            container.append(script);
        }
    };

    const readyPlayer = () => {
        playerAudio.addEventListener('durationchange', () => {
            playersBody.forEach((playerBody) =>
                playerBody.classList.replace(LOADING_CLASS, APP_READY_CLASS)
            );
        });
        createPlayer(data);
    };

    const onEndJingle = () => {
        playerAudio.removeEventListener('ended', onEndJingle);
        readyPlayer();
    };

    const setupJingle = () => {
        playersBody.forEach((playerBody) =>
            playerBody.classList.remove(PROCESSING_CLASS)
        );
        playerAudio.addEventListener('ended', onEndJingle);
        playerAudio.src = `${STATIC_MEDIAS_URL}/jingle.wav`;
    };

    const onEndWaiting = () => {
        playerAudio.removeEventListener('ended', onEndWaiting);
        waitAudioHasBeenPlayed = true;
        if (data) {
            setupJingle();
        } else {
            waitAudioLoopTimer = setTimeout(() => {
                playerAudio.currentTime = 0;
                playerAudio.play();
                playerAudio.addEventListener('ended', onEndWaiting);
            }, 4000);
        }
    };

    const setupWait = () => {
        if (playerIsWaiting) {
            return;
        }

        playerAudio.addEventListener('ended', onEndWaiting);
        playerIsWaiting = true;
        playersBody.forEach((playerBody) =>
            playerBody.classList.add(WAITING_CLASS, PROCESSING_CLASS)
        );
        playerAudio.src = `${STATIC_MEDIAS_URL}${translate('wait')}`;
    };

    const validatePlayerData = (data) =>
        Boolean(
            data && data.status === 'DONE' && data.displayTitle && data.contentUrl
        );

    const shouldAbortPolling = (data) =>
        data.hasOwnProperty('error') || data.status === 'ERROR';

    const getPlayerData = async () => {
        const options = {
            method: 'POST',
            body: JSON.stringify({
                canonicalUrl,
                collectionId,
            }),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        };

        try {
            const printAudio = await fetch(BACKEND_URL, options).then((res) => {
                if (!res.ok) {
                    throw res.status;
                }
                return res.json();
            });

            return {
                id: printAudio.id,
                status: printAudio.status,
                contentUrl: printAudio.mediaUrl,
                displayTitle: printAudio.title,
                markers: printAudio.markers,
            };
        } catch (err) {
            return {
                error: err,
            };
        }
    };

    const prepareAudio = (event) => {
        if (playerAudio.paused) {
            return;
        }

        playersBody.forEach((playerBody) =>
            playerBody.classList.add(LOADING_CLASS, STARTED_CLASS)
        );

        sendTracking({
            event_type: 'player_start',
            event_value_string: `${event.type !== 'click' ? 'autoplay:' : ''}${event.type
                }`,
        });

        poll({
            fn: getPlayerData,
            validate: validatePlayerData,
            shouldAbort: shouldAbortPolling,
            beforeRetry: setupWait,
            interval: POLL_INTERVAL,
        })
            .then((playerData) => {
                data = playerData;
                if (!playerIsWaiting) {
                    readyPlayer();
                } else if (waitAudioHasBeenPlayed) {
                    playerAudio.removeEventListener('ended', onEndWaiting);
                    clearTimeout(waitAudioLoopTimer);
                    setupJingle();
                }
            })
            .catch((err) => {
                playersBody.forEach((playerBody) =>
                    playerBody.classList.remove(LOADING_CLASS)
                );
            });
    };

    const startPlaying = (event) => {
        console.log("inside start playing");
        if (playerAudio.paused) {
            const playPromise = playerAudio.play();
            playerAudio.autoplay = true;

            playPromise
                .then((_) => {
                    playerHasPlayed = true;
                    if (isScrollToPlay || autoPlay === 'scroll') {
                        window.removeEventListener('scroll', checkScrollBeforeAutoPlay);
                    }
                    if (autoPlay === 'visible') {
                        window.removeEventListener('scroll', checkInViewBeforeAutoPlay);
                    }
                    if (autoPlay === 'hover') {
                        playersBody.forEach((playerBody) =>
                            playerBody.removeEventListener('mouseover', tryToAutoPlay)
                        );
                    }
                })
                .catch(() => { });

            prepareAudio(event);
        }
    };

    const tryToAutoPlay = (event) => {
        if (!playerHasPlayed) {
            startPlaying(event);
        }
    };

    const setupView = () => {
        const playerTitleTags = Array.from(
            document.getElementsByClassName('audion-360-print-audio-player-tag')
        );
        const playerTitleTexts = Array.from(
            document.getElementsByClassName('audion-360-print-audio-player-titleText')
        );
        const playerPoweredBy = Array.from(
            document.getElementsByClassName('audion-360-print-audio-player-poweredBy')
        );

        const playerTitleTagsValue =
            container.dataset.label || translate('listen_to_this_article');
        const pageTitle = document.querySelector(container.dataset.title);
        const playerTitleTextsValue = (pageTitle && pageTitle.innerText) || '';
        const playerPoweredByValue = translate('powered_by');

        playerTitleTags.forEach((tag) => (tag.innerHTML = playerTitleTagsValue));
        playerTitleTexts.forEach(
            (title) => (title.innerHTML = playerTitleTextsValue)
        );
        playerPoweredBy.forEach((tag) => tag.prepend(playerPoweredByValue));
    };

    const onIntersectWindow = (entries, observer) => {
        const { isIntersecting, boundingClientRect, intersectionRect } = entries[0];

        if (isIntersecting) {
            playersBody.forEach((playerBody) =>
                playerBody.classList.remove(ABOVE_CLASS, BELOW_CLASS)
            );
            playerIsInView = true;
        } else {
            if (boundingClientRect.top < intersectionRect.top) {
                playersBody.forEach((playerBody) => {
                    playerBody.classList.add(ABOVE_CLASS);
                    playerBody.classList.remove(BELOW_CLASS);
                });
            } else {
                playersBody.forEach((playerBody) => {
                    playerBody.classList.add(BELOW_CLASS);
                    playerBody.classList.remove(ABOVE_CLASS);
                });
            }
            playerIsInView = false;
        }
    };

    const checkScrollBeforeAutoPlay = (event) => {
        if (++scrolled > 1) {
            tryToAutoPlay(event);
        }
    };

    const checkInViewBeforeAutoPlay = (event) => {
        if (playerIsInView) {
            checkScrollBeforeAutoPlay(event);
        }
    };

    const setupEventListeners = () => {
        btnPlays.forEach((btn) => btn.addEventListener('click', startPlaying));
        if (isScrollToPlay || autoPlay === 'scroll') {
            window.addEventListener('scroll', checkScrollBeforeAutoPlay);
        }
        if (autoPlay === 'visible') {
            window.addEventListener('scroll', checkInViewBeforeAutoPlay);
        }
        if (autoPlay === 'hover') {
            playersBody.forEach((playerBody) =>
                playerBody.addEventListener('mouseover', tryToAutoPlay)
            );
        }

        const thinPlayerBody = document.getElementById(
            'audion-360-print-audio-player-body-thin'
        );
        if (thinPlayerBody) {
            const observer = new IntersectionObserver(onIntersectWindow);
            observer.observe(thinPlayerBody);
        }
        window.addEventListener('beforeunload', function () {
            sendTracking({
                event_type: 'session_end',
            });
        });
    };

    const container = document.getElementById('audion-360-print-audio-player');
    let dictionary = {};
    setupLang();
    setupView();

    const playersBody = [
        document.getElementById('audion-360-print-audio-player-body-thin'),
        document.getElementById('audion-360-print-audio-player-body-sticky'),
        document.getElementById('audion-360-print-audio-player-body-float'),
    ].filter((playerBody) => playerBody !== null);
    const playerAudio = document.getElementById(
        'audion-360-print-audio-player-audio'
    );
    const btnPlays = Array.from(
        document.getElementsByClassName('audion-360-print-audio-player-btn')
    );
    let playerHasPlayed = false;
    const autoPlay = container.dataset.autoPlay;
    const isScrollToPlay = container.dataset.scrollToPlay === 'true';
    let playerIsInView = false;
    let data = null;
    let playerIsWaiting = false;
    let waitAudioHasBeenPlayed = false;
    let waitAudioLoopTimer = null;
    let scrolled = 0;
    setupEventListeners();
    playersBody.forEach((playerBody) => playerBody.classList.add(READY_CLASS));

    const sessionId = container.dataset.sessionId;
    const collectionId = container.dataset.id;
    const canonicalUrl = container.dataset.canonicalUrl;
    const referer = container.dataset.referer;
    sendTracking({
        event_type: 'session_start',
    });
})();
