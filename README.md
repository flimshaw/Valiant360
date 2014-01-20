## Valiant 360

### A browser-based video player for 360 degree panorama videos.

The aim of this project is to provide a reusable, free 360 degree video player for the web and mobile.  It has a ways to go in that regard.

[Example](http://valiant.flimshaw.net) - [Development Roadmap][Development Log](https://github.com/flimshaw/Valiant360/wiki/Development-log)

#### Usage (TLDR; basically don't use this yet)

This player accepts equirectangular 360 degree videos of any resolution.  Place any videos you wish to use in the ./videos folder, then add links to them in the index.html file in place of the example video links provided.  Set one to class="active" to have it play automatically.

This is still being adapted from a demo for some video I shot several years ago, so it's not really in a place where it makes sense as a generic video player, but I'm working on it and would love help if anybody wants to fork it and pitch in.

#### Planned Functionality 

- load javascript library

##### POSSIBLE INTERFACE EXAMPLES

**Generic**

var v = new Valiant360("videos/filename.mp4");
v.play();
v.pause();


** JQuery **

$("#videoPlayer").Valiant(); // instantiates player on video element, fills specified size with standard controls and mouse tracking
$("#videoPlayer").Valiant().pause(); // pauses video etc etc



#### 3rd party libraries and their licenses

The following libraries are used in this tool's creation.

+ JQuery 1.7.2 (MIT License)
+ Three.js + stats (MIT License)
+ Twitter Bootstrap (MIT License)