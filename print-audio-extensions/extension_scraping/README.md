# extension-scraping

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

After modifying the files of the extension don't forget to press the refresh button in the extensions menu to make sure your chages are effective

## 3. How to use the extension

The popup looks like this : 

<img width="514" alt="Capture d’écran 2022-08-03 à 13 30 58" src="https://user-images.githubusercontent.com/105653206/182607476-8473af35-aa02-4c46-9ac2-5533fbe2ee83.png">


in the text boxes, enter the css selectors corresponding to what’s written next to them (same as in admin 360). Then, there are 3 buttons : 

* A button labeled "setup" which will setup the values used by the extension and color the text taken into account by the inputed selectors : always use this button when you change something in the values otherwise they won't be taken into account
* A button labeled "display selectors" which displays the selectors that were inputed last time you pressed the setup button
* A button labeled "display scraping" which displays the text taken into account by the inputed selectors


