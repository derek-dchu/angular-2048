angular-2048  [![Build Status](https://travis-ci.org/derek-dchu/angular-2048.svg)](https://travis-ci.org/derek-dchu/angular-2048)
============
A classic 2048 game built on AngularJS. It is based on the idea of [a small clone of 1024](https://github.com/gabrielecirulli/2048).

Installation
============
This game requires [NodeJS](http://nodejs.org/) environment.

After you install NodeJS, run following command to install required dependencies, and you are ready to go.
```
$ npm install
```
Usage
=====
Running the game
----------------
Run following command to start the test server.
```
$ npm start
```
Then, open your browser and navigate to 'http://localhost:8123'

Test
----
Run following command to test it.
```
$ npm test-single-run
```

Deploy
-------
This is an AngularJS application ready for deploying to any server.

First, run following command to generate deployment ready files.
```
$ gulp
```
You will find new files in 'dist' folder.
Directly serve js and css files within that folder, and place following 'div' element which contains all contents of the game into your html file.
```html
<div class="game" ng-include="'mainId.html'"></div>
```
Remember to bootstrap the page by adding ng-app into html tag as follow.
```html
<html ... ng-app="2048App">
...
<html>
```

License
=======
This repo is licensed under the MIT license.
