# Example HTML App

## Introduction

This example is the first stepping stone of the starter examples to get familiar with developing with a BrightSign. The intention of this example is to show how to get a simple HTML application running on your player.

The HTML application is defined in `index.html` and is a simplified version of the html templates we offer. In addition to the html file, there is an `autorun.brs` file which is what tells your player to run the application and a `static` directory which contains images displayed by the html.

## How to run on a player

Since this example is simplified, there are only two files and one directory which you will need to copy to the root of the player's sd card. Upon the player booting successfully, it will run the `autorun.brs` file. This file instantiates an html object which points the player to the `index.html` file to display the images in the `static` directory.
