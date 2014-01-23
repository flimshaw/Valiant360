## Valiant 360 (beta)

### A browser-based video player for 360 degree panorama videos.

[Example](http://flimshaw.github.io/Valiant360) - [Development Log](https://github.com/flimshaw/Valiant360/wiki/Development-log)


#### About

The aim of this project is to provide a free, minimalist 360 degree video WebGL player for modern browsers. It is implemented as a jQuery plugin, with a limited interface for controlling video playback, and mouse/scrollwheel controls for zooming and panning.

There is currently no mobile support, but as Chrome and Safari mobile editions enable WebGL, this should be forwards-compatible with them.

#### Usage 

See the [demo folder](https://github.com/flimshaw/Valiant360/tree/master/demo) or the [example](http://flimshaw.github.io/Valiant360).  Moving the mouse will pan the camera, and the scroll wheel will zoom in and out.

**Markup**

On the HTML side, create a div to act as your container, and add a data-video-src attribute pointing to the video file you wish to play.

```
	<div class="myVideo" data-video-src="videos/my-video.mp4"></div>
```

**Javascript**

More detailed api documentation pending, for now the below explains about all you can do.

```
	// initialize plugin, default options shown
	$('.myVideo').Valiant360({
		fov: 35, 		// initial field of view
		lon: 0, 		// initial lon for camera angle
		lat: 0, 		// initial lat for camera angle
		loop: "loop", 	// video loops by default
		muted: true,	// video muted by default
		autoplay: true	// video autoplays by default
	});

	// play video
	$('.myVideo').Valiant360('play');

	// pause video
	$('.myVideo').Valiant360('pause');
```


#### 3rd party libraries and their licenses

The following libraries are used in this tool's creation.

+ JQuery 1.7.2 (MIT License)
+ Three.js + stats (MIT License)
+ Twitter Bootstrap (MIT License) (not strictly necessary at the moment)