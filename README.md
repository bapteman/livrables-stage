# extension-player-integration

## 1. how to import the extension into google chrome

First, clone the repository containing the extension in your computer 

Then, go to the parameters of google chrome and open the extension menu and turn on developer mode.
You should have a page like this one :

<img width="1680" alt="Capture d’écran 2022-07-19 à 11 26 34" src="https://user-images.githubusercontent.com/105653206/182556785-84211bab-d0fd-4e51-9fcd-28df563fab22.png">

If you already have extensions on your navigator they will be displayed there.
Now click on the "load unpacked" button which should open your computer files navigator. Select the folder you copied from github and validate.
The page should now appear like that : 

<img width="1680" alt="Capture d’écran 2022-07-19 à 11 33 00" src="https://user-images.githubusercontent.com/105653206/182557833-fd3a26d2-89de-46b8-99f2-3779635cbdff.png">

Now, by clicking the extension button on the top right corner (underlined in red) it will display the extensions you loaded and by clicking on them you will be able to use them. You can also pin them so that they appear directly next to the extension button by clicking the pin button next to the extension’s name.

You will also be able to see if any errors occurred and have some details on these errors.

## 2. How to develop on this extension?

I will explain what the differents files in the folder are used to and what will change if you modify them :


* manifest.json : this is the core of the extension it is the file the computer will read first when you load the extension and it will tell the computer which files are to be used in which cases

* options (html/css/javascript) : this is used to display the options page you can access by clicking the three dots next to the pinning button. This is currently not used by this extension so the files are empty but it can still be used to develop new features.

* popup (html/css/javascript) : this is used for the popup that appears when you launch the extension. Currently everything that happens in the extensions is done in these documents so if you need to modify already existing features you will need to modify them.	

* script-player.js : this file is called by popup.js every time the extension needs to modify the current web page.

After modifying the files of the extension don't forget to press the refresh button in the extensions menu to make sure your chages are effective
## 3. How to use this extension

The popup looks like this : 

<img width="517" alt="Capture d’écran 2022-07-19 à 15 39 12" src="https://user-images.githubusercontent.com/105653206/182565438-06191688-b03c-4ce2-b509-97740ff3b5b7.png">

The popup is divided in two parts : 

-The first one is used to integrate a copy of a Print Audio player in the current page : enter css selectors corresponding to where you want the player to be and the position of the player compared to the tag selectedand the selector corresponding to what will be the title. Then press the "creation-player" button and it will add a player into the page

note that if there is an already existing Print Audio player in the page it will be replaced by the one created from the extension but the already existing style will still be applied to the newer player however style added from the extension will have priority over it.

-The second part is used to add style to the player thanks to the use of css. The areas are pretty self-explanatory but the tag-dark one is to be used when the site has a dark theme since the title is displayed in black by default. Picking yes will automatically change it to white and, by filling with a selector that only exists if the theme is dark, you can make it change whether it’s light theme or dark theme without refreshing or anything.
You then have a larger textarea if you want to add some style that doesn’t fit in the already existing options.

note that the style from this extension will be applied regardless if the player was added with. the extension or already existing

The buton "theme" will apply entered theme, the button "generate scss" will generate the scss code corresponding to the style you entered and the button "remove-theme" removes all theme applied by this extension.

