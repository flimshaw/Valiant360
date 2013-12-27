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
		video.muted = true;
		
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

	init();
	animate();

});

window.app = {};

var camera, scene, renderer;

var video, texture;

var fov = 110,
texture_placeholder,
isUserInteracting = false,
onMouseDownMouseX = 0, onMouseDownMouseY = 0,
lon = 0, onMouseDownLon = 0,
lat = -90, onMouseDownLat = 0,
phi = 0, theta = 0;



function init() {

	var container, mesh;

	container = document.getElementById( 'container' );

	camera = new THREE.Camera( fov, window.innerWidth / window.innerHeight, 1, 1100 );

	scene = new THREE.Scene();

	video = document.createElement( 'video' );
	video.loop = "loop";

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

		$(".pct").text(Math.floor(percent * 100) + "% loaded.");
	});

	video.addEventListener("canplaythrough", function(e) {
		video.play();
	});

	video.addEventListener("ended", function(e) {
		$(".pct").text("100% loaded.");
		console.log("done");
	});

	window.v = video;
	video.src = $(".videoNav li:first-child a").attr("href");			

	texture = new THREE.Texture( video );
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;

	mesh = new THREE.Mesh( new THREE.SphereGeometry( 500, 80, 50 ), new THREE.MeshBasicMaterial( { map: texture } ) );
	mesh.scale.x = -1;
	scene.addObject( mesh );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( renderer.domElement );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
	document.addEventListener( 'DOMMouseScroll', onDocumentMouseWheel, false);

}

function onDocumentMouseDown( event ) {

	event.preventDefault();

	isUserInteracting = true;

	onPointerDownPointerX = event.clientX;
	onPointerDownPointerY = event.clientY;

	onPointerDownLon = lon;
	onPointerDownLat = lat;

}

function onDocumentMouseMove( event ) {

	if ( isUserInteracting ) {

		lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
		lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

	}
}

function onDocumentMouseUp( event ) {

	isUserInteracting = false;

}

function onDocumentMouseWheel( event ) {

	// WebKit

	if ( event.wheelDeltaY ) {

		fov -= event.wheelDeltaY * 0.05;

	// Opera / Explorer 9

	} else if ( event.wheelDelta ) {

		fov -= event.wheelDelta * 0.05;

	// Firefox

	} else if ( event.detail ) {

		fov += event.detail * 1.0;

	}

	console.log(fov);

	camera.projectionMatrix = THREE.Matrix4.makePerspective( fov, window.innerWidth / window.innerHeight, 1, 1100 );
	render();

}

function animate() {

	requestAnimationFrame( animate );
	render();

}

function render() {

	lat = Math.max( - 85, Math.min( 85, lat ) );
	phi = ( 90 - lat ) * Math.PI / 180;
	theta = lon * Math.PI / 180;

	camera.target.position.x = 500 * Math.sin( phi ) * Math.cos( theta );
	camera.target.position.y = 500 * Math.cos( phi );
	camera.target.position.z = 500 * Math.sin( phi ) * Math.sin( theta );

	// distortion
	camera.position.x = - camera.target.position.x;
	camera.position.y = - camera.target.position.y;
	camera.position.z = - camera.target.position.z;

	renderer.render( scene, camera );

}