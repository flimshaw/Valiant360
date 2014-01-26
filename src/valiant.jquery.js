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

/* REQUIREMENTS:

jQuery 1.7.2 or greater
three.js r65 or higher

*/

// the semi-colon before the function invocation is a safety 
// net against concatenated scripts and/or other plugins 
// that are not closed properly.
;(function() {
 
    //define the commands that can be used  
    var commands = {  
        play: play,  
        stop: pause,
        fullscreen: fullscreen
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

    var controlsHTML = ' \
        <div class="controls"> \
            <a href="#" class="playButton button fa fa-pause"></a> \
            <a href="#" class="muteButton button fa fa-volume-off"></a> \
            <a href="#" class="fullscreenButton button fa fa-expand"></a> \
        </div> \
    ';

    var camera
      , scene
      , renderer
      , video
      , texture
      , texture_placeholder
      , self
      , lat
      , lon
      , fov
      , isFullscreen = false;

    var controls = {};
  
    $.fn.Valiant360 = function() {

        if (typeof arguments[0] === 'string') {  
           
            //execute string comand on mediaPlayer  
            var property = arguments[1];  
            
            //remove the command name from the arguments  
            var args = Array.prototype.slice.call(arguments);  
            args.splice(0, 1);  
  
            commands[arguments[0]].apply(this, args);  
        }  else {  
            //create mediaPlayer  
            createMediaPlayer.apply(this, arguments);
            createControls.apply(this, arguments);
        }

        // save original width of our container
        this.originalWidth = $(this).find('canvas').width();
        this.originalHeight = $(this).find('canvas').height();



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
        camera = new THREE.PerspectiveCamera( this.options.fov, this.width() / this.height(), .1, 1000);

        // create ThreeJS renderer and append it to our object
        renderer = Detector.webgl? new THREE.WebGLRenderer(): new THREE.CanvasRenderer();
        renderer.setSize( this.width(), this.height() );
        renderer.autoClear = false;
        renderer.setClearColor( 0xffffff, 1 );
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
                    // do something now that we are done
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

        // set the video src and begin loading
        video.src = this.attr('data-video-src');
    }

    // create separate webgl layer and scene for drawing onscreen controls
    function createControls(options) {
         this.append(controlsHTML, true);

        // wire up controller events to dom elements
        attachControlEvents();
    }

    function attachControlEvents() {

        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
        document.addEventListener( 'DOMMouseScroll', onDocumentMouseWheel, false);

        // CONTROLS
        $(self).find('.playButton').click(function(e) {
            e.preventDefault();
            if($(this).hasClass('fa-pause')) {
                $(this).removeClass('fa-pause').addClass('fa-play');
                pause();
            } else {
                $(this).removeClass('fa-play').addClass('fa-pause');
                play();
            }
        });

        $(self).find('.pauseButton').click(function(e) {
            e.preventDefault();
            pause();
        });

        $(self).find(".fullscreenButton").click(function(e) {
            e.preventDefault();
            if($(this).hasClass('fa-expand')) {
                
                 $(self)[0].webkitRequestFullscreen();
            } else {
                $(this).removeClass('fa-compress').addClass('fa-expand');
                document.webkitExitFullscreen();
            }
            
        });

        $(self).find(".muteButton").click(function(e) {
            e.preventDefault();
            if($(this).hasClass('fa-volume-off')) {
                $(this).removeClass('fa-volume-off').addClass('fa-volume-up');
                video.muted = false;
            } else {
                $(this).removeClass('fa-volume-up').addClass('fa-volume-off');
                video.muted = true;
            }
        });

        // attach mouse listeners
        function onDocumentMouseMove( event ) {
            onPointerDownPointerX = event.clientX;
            onPointerDownPointerY = -event.clientY;

            onPointerDownLon = lon;
            onPointerDownLat = lat;
            

            if($(self).find('canvas').is(":hover")) {
                var x = event.pageX - $(self).find('canvas').offset().left;
                var y = event.pageY - $(self).find('canvas').offset().top;
                lon = ( x / $(self).find('canvas').width() ) * 430 - 225
                lat = ( y / $(self).find('canvas').height() ) * -180 + 90                
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


            if($(self).find('canvas').is(":hover")) {
                camera.setLens(fov);
                event.preventDefault();
            }
            

        }        
    }

    function fullscreen() {

        if(!window.screenTop && !window.screenY) {
            var w = self.originalWidth;
            var h = self.originalHeight;
            isFullscreen = false;
        } else {
            var w = screen.width;
            var h = screen.height;
            isFullscreen = true;
        }

        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();

        if(isFullscreen) {
            $(self).addClass('fullscreen');
            $(self).find('a.fa-expand').removeClass('fa-expand').addClass('fa-compress');
        } else {
            $(self).removeClass('fullscreen');
            $(self).find('a.fa-compress').removeClass('fa-compress').addClass('fa-expand');
        }
    }

    $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange',fullscreen);

  
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
                if(ct - time >= 30) {
                    texture.needsUpdate = true; 
                    time = ct;
                }
            }
        }

        var c = $(self).find('canvas')[0];
        

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

        renderer.clear();
        renderer.render( scene, camera );
    }


    // TODO: wire up a custom log function to turn off if we have debug mode set to false
    function log(msg) {
        console.info(msg);
    }

})(jQuery);