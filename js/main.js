$(document).ready(function() {

	var ldr = $("#loading");
	ldr.data("isLoading", true);


	setInterval( function() {

		if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
			
			texture.needsUpdate = true;
			if(ldr.data("isLoading") == true) {
				ldr.fadeOut('fast');
				ldr.data("isLoading", false);
			}

		}

	}, 1000 / 30 );

	// Video Nav Functions
	$(".videoNav a").click(function(e) {
		e.preventDefault();
		video.src = $(this).attr('href');
		//video.muted = true;
		
		$(".videoNav a.active").removeClass("active");
		$(this).addClass("active");
	})

	// About area close/open scripts
	$(".about .aboutClose").click(function(e) {
		e.preventDefault();
		$(".about").slideUp();
	});

	$(".aboutOpen").click(function(e) {
		e.preventDefault();
		$(".about").slideDown();
	});

	// Video Controls Functions
	$(".playButton").click(function(e) {
		video.play();
		$(".pauseButton").removeClass('active');
		$(".playButton").addClass('active');
		e.preventDefault();
	});

	$(".pauseButton").click(function(e) {
		video.pause();
		$(".pauseButton").addClass('active');
		$(".playButton").removeClass('active');		
		e.preventDefault();
	});

	$(".muteButton").click(function(e) {
		video.muted = video.muted == false;
		if(video.muted) {
			$(".muteButton i").removeClass('icon-volume-high');
			$(".muteButton i").addClass('icon-volume-off');
		} else {
			$(".muteButton i").addClass('icon-volume-high');
			$(".muteButton i").removeClass('icon-volume-off');
		}
		e.preventDefault();
	});

	init();
	animate();

});

window.app = {};

var camera, scene, renderer;

var video, texture;

var fov = 36,
texture_placeholder,
isUserInteracting = false,

// GLOBALS FOR TRACKING MOUSE
onMouseDownMouseX = 0, onMouseDownMouseY = 0,
lon = 0, onMouseDownLon = 0,
lat = 45, onMouseDownLat = 0,
phi = 0, theta = 0;



function init() {

	var container, mesh;

	container = document.getElementById( 'container' );
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, .1, 1000 );

	video = document.createElement( 'video' );
	video.loop = "loop";
	video.muted = true;

	// Report video load complete
	video.addEventListener("ended", function(e) {
		$(".pct").text("100% loaded.");
		// DEBUG
		console.log("done");
	});

	// Progress Meter
	video.addEventListener("progress", function(e) {
		var percent = null;
		    if (video && video.buffered && video.buffered.length > 0 && video.buffered.end && video.duration) {
		        percent = video.buffered.end(0) / video.duration;
		    } 
		    // Some browsers (e.g., FF3.6 and Safari 5) cannot calculate target.bufferered.end()
		    // to be anything other than 0. If the byte count is available we use this instead.
		    // Browsers that support the else if do not seem to have the bufferedBytes value and
		    // should skip to there. Tested in Safari 5, Webkit head, FF3.6, Chrome 6, IE 7/8.
		    else if (video && video.bytesTotal != undefined && video.bytesTotal > 0 && video.bufferedBytes != undefined) {
		        percent = video.bufferedBytes / video.bytesTotal;
		    }

		   	var cpct = Math.round(percent * 100);
		   	if(cpct == 100) {
		   		$(".percentLoaded").fadeOut();
		   	} else {
		   		$(".pct").text(cpct + "% loaded.");
		   	}
		
	});

	// Video Play Listener, fires after video loads
	video.addEventListener("canplaythrough", function(e) {
		video.play();
	});



	// DEBUG
	window.v = video;

	video.src = $(".videoNav li:first-child a").attr("href");			

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	texture = new THREE.Texture( video );
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;

	mesh = new THREE.Mesh( new THREE.SphereGeometry( 500, 80, 50 ), new THREE.MeshBasicMaterial( { map: texture } ) );
	mesh.scale.x = -1;
	scene.add( mesh );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
	document.addEventListener( 'DOMMouseScroll', onDocumentMouseWheel, false);

}

function onDocumentMouseDown( event ) {

	event.preventDefault();

	isUserInteracting = true;



}

function onDocumentMouseMove( event ) {
	onPointerDownPointerX = event.clientX;
	onPointerDownPointerY = -event.clientY;

	onPointerDownLon = lon;
	onPointerDownLat = lat;
	if ( 1 ) {

		lon = ( event.clientX / window.innerWidth ) * 430 - 45
		lat = ( event.clientY / window.innerHeight ) * -180 + 90

	}
}

function onDocumentMouseUp( event ) {

	isUserInteracting = false;

}

function onDocumentMouseWheel( event ) {

	var wheelSpeed = -.01;

	// WebKit

	if ( event.wheelDeltaY ) {

		fov -= event.wheelDeltaY * wheelSpeed;

	// Opera / Explorer 9

	} else if ( event.wheelDelta ) {

		fov -= event.wheelDelta * wheelSpeed;

	// Firefox

	} else if ( event.detail ) {

		fov += event.detail * 1.0;

	}

	var fovMin = 3;
	var fovMax = 100;

	if(fov < fovMin) {
		fov = fovMin;
	} else if(fov > fovMax) {
		fov = fovMax;
	}

	camera.setLens(fov)
	//render();

}

function animate() {

	requestAnimationFrame( animate );
	render();

}

function render() {

	lat = Math.max( - 85, Math.min( 85, lat ) );
	phi = ( 90 - lat ) * Math.PI / 180;
	theta = lon * Math.PI / 180;

	var cx = 500 * Math.sin( phi ) * Math.cos( theta );
	var cy = 500 * Math.cos( phi );
	var cz = 500 * Math.sin( phi ) * Math.sin( theta );

	camera.lookAt(new THREE.Vector3(cx, cy, cz));

	// distortion
	camera.position.x = - cx;
	camera.position.y = - cy;
	camera.position.z = - cz;

	renderer.render( scene, camera );

}