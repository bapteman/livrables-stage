# Chrome extensions

## Links to the readme of the extensions
### Extension for player integration

You can find the readme of this extension [here](https://github.com/bapteman/livrables-stage/tree/master/print-audio-extensions/extension_player-integration#readme)


### Extension for scraping configuration

you can find the readme of this extension [here](https://github.com/audi-on/printaudio-integration-extensions/blob/master/print-audio-extensions/extension_player-integration/README.md)

## 1. how to import an extension into Google Chrome

Clone the repository containing the extensions in your computer 

Go to the parameters of Google Chrome and open the extension menu and turn on developer mode.
You should have a page like this one:

<img width="830" alt="Capture d’écran 2022-08-10 à 15 30 51" src="https://user-images.githubusercontent.com/105653206/183914322-ecbecd13-fec8-40c1-8183-96ff3b87a29d.png">

Click on the "load unpacked" button which should open your computer files navigator. Select the folder you copied from github corresponding to the extension you want to use (don't select the print-audio-extensions folder but either extension-player-integration or extension-scraping) and validate.
The page should now appear like that: 

<img width="837" alt="Capture d’écran 2022-08-10 à 15 33 40" src="https://user-images.githubusercontent.com/105653206/183914745-7e52a5d6-c828-43b8-9f33-cbd325aebdf8.png">

By clicking the extension button on the top right corner (underlined in red) it will display the extensions you loaded and by clicking on them you will be able to use them. You can also pin them.

You will also be able to see if any errors occurred and have some details on these errors.

## 2. How to develop on this extension?

First, you must know that these extensions are developped mostly in HTML/CSS/JavaScript with some exceptions (like the manifest for example)

What are the different files used for:

* manifest.json: this is the core of the extension, it is the file the computer will read first when you load the extension and it will tell the computer which files are to be used in which cases

* options (html/css/javascript): This is used to display the options page. You can access by clicking the three dots next to the pinning button. This is currently not used by this extension so the files are empty but it can still be used to develop new features.

* popup (html/css/javascript): This is used for the popup that appears when you launch the extension. Currently everything that happens in the extensions is done in these documents so if you need to modify already existing features you will need to modify them.	

* script-player.js (only in the extension for the player extension): This file is called by popup.js every time the extension needs to modify or access the current web page.

Keep in mind that the extension will refresh every time the code comes to end. To prevent value loss you can use the [chrome.storage.sync.set/get](https://developer.chrome.com/docs/extensions/reference/storage/) functions that will store the values in the navigator. You can also make the code stop yourself (taht's why in the scraping extension there is an invisible box that is used to stop the code from finishing if it is not filled)

After modifying the files of the extension don't forget to press the refresh button in the extensions menu to make sure your changes are effective
