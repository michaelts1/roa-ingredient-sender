# roa-ingredient-sender

This script will help you wire ingredients to other players by doing a few things
* Hides ingredients you have 0 of
* Adds inputs to enter the amount of each ingredient
* Adds max for individual and a max all button to quickly send all
* Auto populates the sending commands in chat and sends it*

Auto sending is split into chunks of 10 as that is the max the game supports

TODO:
* Figure out how to set up autofill for usernames
* Fix the layout as it is a bit fugly atm
* Figure out wait for confirmation of last wire before starting the timer on next instead of setting up in 5.5 second intervals to account for any delays
* Lots of other crap that may or may not get done depending on my lazyness x.x
