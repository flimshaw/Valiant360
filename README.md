## Valiant 360 (beta)

### A browser-based video player for 360 degree panorama videos and photos.

[Example](http://flimshaw.github.io/Valiant360) - [Development Log](https://github.com/flimshaw/Valiant360/wiki/Development-log)


#### About

The aim of this project is to provide a free, minimalist 360 degree video WebGL player for modern browsers. It is implemented as a jQuery plugin, with a limited interface for controlling video playback, and mouse/scrollwheel controls for zooming and panning.

There is currently no mobile support, but as Chrome and Safari mobile editions enable WebGL, this should be forwards-compatible with them.

#### Usage 

See the [demo folder](https://github.com/flimshaw/Valiant360/tree/master/demo) or the [example](http://flimshaw.github.io/Valiant360).  Moving the mouse will pan the camera, and the scroll wheel will zoom in and out.

**Markup**

On the HTML side, create a div to act as your container, and add a data-video-src attribute pointing to the video file you wish to play.

```
	<div class="valiantContainer" data-video-src="videos/my-video.mp4"></div>
```

Or, if you wish to use it to view a photo (note: currently must be powers-of-2 resolution (ie. 2048x1024):
```
	<div class="valiantContainer" data-photo-src="videos/my-photo.jpg"></div>
```

**Javascript**

More detailed api documentation pending, for now the below explains about all you can do.

```
	// initialize plugin, default options shown
	$('.valiantContainer').Valiant360({
		clickAndDrag: false,	// use click-and-drag camera controls
		flatProjection: false,	// map image to appear flat (often more distorted)
		fov: 35, 				// initial field of view
		hideControls: false,	// hide player controls
		lon: 0, 				// initial lon for camera angle
		lat: 0, 				// initial lat for camera angle
		loop: "loop", 			// video loops by default
		muted: true,			// video muted by default
		autoplay: true			// video autoplays by default
	});

	// play video
	$('.valiantContainer').Valiant360('play');

	// pause video
	$('.valiantContainer').Valiant360('pause');

	// load new video file
	$('.valiantContainer').Valiant360('loadVideo', 'path/to/file.mp4');

	// load new photo file
	$('.valiantContainer').Valiant360('loadPhoto', 'path/to/file.jpg');

```


#### 3rd party libraries and their licenses

The following assets are used in this tool's creation.

+ [JQuery 1.7.2+](http://jquery.com) (MIT License)
+ [Three.js](http://threejs.org/) + Detector (MIT License)
+ [Font Awesome](http://fortawesome.github.io/Font-Awesome/) (MIT License)