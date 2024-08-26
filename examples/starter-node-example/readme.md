# Example Node App

## Introduction

This example is the second stepping stone of the starter examples to get familiar with developing with a BrightSign. The intention of this example is to show how to get a simple node application running on your player.

The node application is defined in `index.js` and is a simplified version of the html templates we offer. In addition to the JavaScript file, there is an `autorun.brs` file which is what tells your player to run the application.

## How to run on a player

Since this example is simplified, there are only two files which you will need to copy to the root of the player's sd card. Upon the player booting successfully, it will run the `autorun.brs` file. This file instantiates a node object which points the player to the `index.js` file to instantiate the node server.