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
		crossOrigin: 'anonymous',	// valid keywords: 'anonymous' or 'use-credentials'
		clickAndDrag: false,	// use click-and-drag camera controls
		flatProjection: false,	// map image to appear flat (often more distorted)
		fov: 35, 				// initial field of view
		fovMin: 3, 				// min field of view allowed
		fovMax: 100, 				// max field of view allowed
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

	// destroy Valiant360 processing/resources (however, will not remove element from the dom. That is left up to you)
	$('.valiantContainer').Valiant360('destroy');	

```

#### A note on the crossOrigin CORS option
Allows images and videos to be served from a domain separate to where Valiant360 is hosted (eg a CDN). **If a crossOrigin keyword is not specified, anonymous is used**.

This option will allow Valiant360 to grab cross-domain assets for Chrome and Firefox, however at time of writing Safari throws the error: `[Error] SecurityError: DOM Exception 18: An attempt was made to break through the security policy of the user agent.`

Cross-domain tested on Mac OSX Yosemite: Chrome v43.0.2357.130, Chrome Canary v45.0.2449.0, Firefox v39.0, Safari v8.0.6.

For further explanation on these CORS keywords, see:
* [MDN CORS settings attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes)
* [WHATWG CORS settings attributes](https://html.spec.whatwg.org/multipage/infrastructure.html#cors-settings-attribute)

#### 3rd party libraries and their licenses

The following assets are used in this tool's creation.

+ [JQuery 1.7.2+](http://jquery.com) (MIT License)
+ [Three.js](http://threejs.org/) + Detector (MIT License)
+ [Font Awesome](http://fortawesome.github.io/Font-Awesome/) (MIT License)