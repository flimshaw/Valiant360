/*!
 * Valiant360 panorama video player jquery plugin
 * 
 * Copyright (c) 2014 Charlie Hoey <@flimshaw>
 * 
 * Released under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 * 
 * Jquery plugin pattern by @ianjmitchell (http://iainjmitchell.com/blog/?p=360)
 */


// the semi-colon before the function invocation is a safety 
// net against concatenated scripts and/or other plugins 
// that are not closed properly.
;define(['jquery', 'threejs', 'detector'], function ( $, THREE ) {
 
    //define the commands that can be used  
    var commands = {  
        play: play,  
        stop: pause  
    };

    var defaults = {
        fov: 35,
        lon: 0,
        lat: 0,
        loop: "loop",
        muted: true,
        debug: false,
        autoplay: true
    }

    var camera
      , scene
      , renderer
      , video
      , texture
      , texture_placeholder
      , self
      , lat
      , lon
      , fov;
  
    $.fn.Valiant360 = function() {

        if (typeof arguments[0] === 'string') {  
            //execute string comand on mediaPlayer  
            var property = arguments[1];  
            //remove the command name from the arguments  
            var args = Array.prototype.slice.call(arguments);  
            args.splice(0, 1);  
  
            commands[arguments[0]].apply(this, args);  
        }  
        else {  
            //create mediaPlayer  
            createMediaPlayer.apply(this, arguments);  
        }



        return this;  
    };  
  
    function createMediaPlayer(options){

        self = this;

        this.options = $.extend( {}, defaults, options) ;

        lat = this.options.lat;
        lon = this.options.lon;
        fov = this.options.fov;

        // create ThreeJS scene
        scene = new THREE.Scene();

        // create ThreeJS camera
        camera = new THREE.PerspectiveCamera( this.options.fov, window.innerWidth / window.innerHeight, .1, 1000);

        // create ThreeJS renderer and append it to our object
        renderer = Detector.webgl? new THREE.WebGLRenderer(): new THREE.CanvasRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        this.append(renderer.domElement);

        // create off-dom video player
        video = document.createElement( 'video' );
        video.loop = this.options.loop;
        video.muted = this.options.muted;

        // create ThreeJS texture and high performance defaults
        texture = new THREE.Texture( video );
        texture.generateMipmaps = false;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;

        // create ThreeJS mesh sphere onto which our texture will be drawn
        mesh = new THREE.Mesh( new THREE.SphereGeometry( 500, 80, 50 ), new THREE.MeshBasicMaterial( { map: texture } ) );
        mesh.scale.x = -1; // mirror the texture, since we're looking from the inside out
        scene.add(mesh);

        // attach video player event listeners
        video.addEventListener("ended", function(e) {
            log("video loaded");
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
                    
                } else {
                    // do something with this percentage info (cpct)
                }
        });

        // Video Play Listener, fires after video loads
        video.addEventListener("canplaythrough", function(e) {

            if(self.options.autoplay == true) {
                video.play(); 
            }
            
            animate();
            log("playing");
        });

        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
        document.addEventListener( 'DOMMouseScroll', onDocumentMouseWheel, false);

        // attach mouse listeners
        function onDocumentMouseMove( event ) {
            onPointerDownPointerX = event.clientX;
            onPointerDownPointerY = -event.clientY;

            onPointerDownLon = lon;
            onPointerDownLat = lat;
            if ( 1 ) {

                lon = ( event.clientX / window.innerWidth ) * 430 - 225
                lat = ( event.clientY / window.innerHeight ) * -180 + 90

            }
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

        // set the video src and begin loading
        video.src = this.attr('data-video-src');
    }  
  
    //Exposed functions  
    function play() {  
      //code to play media
      video.play()
    }  
  
    function pause() {  
      //code to stop media  
      video.pause();
    }


    // store the time of the script start
    var time = new Date().getTime();

    function animate() {
        // set our animate function to fire next time a frame is ready
        requestAnimationFrame( animate );

        if ( video.readyState === video.HAVE_ENOUGH_DATA) {
            if(typeof(texture) != "undefined" ) {
                var ct = new Date().getTime();
                if(ct - time >= 33) {
                    texture.needsUpdate = true; 
                    time = ct;
                }
            }
        }



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


    // TODO: wire up a custom log function to turn off if we have debug mode set to false
    function log(msg) {
        console.info(msg);
    }

});