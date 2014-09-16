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
;(function($, THREE, Detector, requestAnimationFrame) {

    var camera
      , scene
      , renderer
      , video = false
      , photo = false
      , texture
      , self = {}
      , lat
      , lon
      , fov
      , isFullscreen = false
      , mouseDown = false
      , dragStart = {};

    //define the commands that can be used
    var commands = {
        //play: self.play,
        //stop: self.pause,
        //fullscreen: self.fullscreen,
        //loadVideo: self.loadVideo,
        //loadPhoto: self.loadPhoto
    };

    var defaults = {
        clickAndDrag: false,
        fov: 35,
        hideControls: false,
        lon: 0,
        lat: 0,
        loop: "loop",
        muted: true,
        debug: false,
        flatProjection: false,
        autoplay: true
    };

    // store the time of the script start
    self.time = new Date().getTime();

    self.controls = {};

    // html for control elements, gets appended to container div on load
    var controlsHTML = '';

    $.fn.Valiant360 = function() {

        // if we're passing a string in, do some stuff to it.
        if (typeof arguments[0] === 'string') {

            //remove the command name from the arguments
            var args = Array.prototype.slice.call(arguments);
            args.splice(0, 1);

            commands[arguments[0]].apply(this, args);
        // but, really, we should be passing an object in, so this is all that really matters
        }  else {
            // crete a media player using the options passed into this
            createMediaPlayer.apply(this, arguments);
            createControls.apply(this, arguments);
        }

        // save original width of our container
        this.originalWidth = $(this).find('canvas').width();
        this.originalHeight = $(this).find('canvas').height();

        $(self).addClass('Valiant360_default');

        return this;
    };

    function createMediaPlayer(options){

        self = this;

        this.options = $.extend( {}, defaults, options) ;

        this.lat = this.options.lat;
        this.lon = this.options.lon;
        this.fov = this.options.fov;

        // hide controls if they need to be
        if(this.options.hideControls) {

        }

        // create ThreeJS scene
        this.scene = new THREE.Scene();

        // create ThreeJS camera
        this.camera = new THREE.PerspectiveCamera( this.options.fov, this.width() / this.height(), 0.1, 1000);

        // create ThreeJS renderer and append it to our object
        this.renderer = Detector.webgl? new THREE.WebGLRenderer(): new THREE.CanvasRenderer();
        this.renderer.setSize( this.width(), this.height() );
        this.renderer.autoClear = false;
        this.renderer.setClearColor( 0xffffff, 1 );
        this.append(renderer.domElement);

        if($(self).attr('data-photo-src')) {
            this.texture = THREE.ImageUtils.loadTexture($(self).attr('data-photo-src'));
            this.photo = true;
        } else {
            // create off-dom video player
            this.video = $(self).append(document.createElement( 'video' ));
            this.video.loop = this.options.loop;
            this.video.muted = this.options.muted;
            this.texture = new THREE.Texture( this.video );
        }

        this.texture.generateMipmaps = false;
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.magFilter = THREE.LinearFilter;
        this.texture.format = THREE.RGBFormat;

        // create ThreeJS mesh sphere onto which our texture will be drawn
        this.mesh = new THREE.Mesh( new THREE.SphereGeometry( 500, 80, 50 ), new THREE.MeshBasicMaterial( { map: texture } ) );
        this.mesh.scale.x = -1; // mirror the texture, since we're looking from the inside out
        this.scene.add(this.mesh);

        // if we have a video, attach our controls etc
        if(this.video) {

            // attach video player event listeners
            this.video.addEventListener("ended", function() {
                log("video loaded");
            });

            // Progress Meter
            this.video.addEventListener("progress", function() {
                var percent = null;
                    if (self.video && self.video.buffered && self.video.buffered.length > 0 && self.video.buffered.end && self.video.duration) {
                        percent = self.video.buffered.end(0) / self.video.duration;
                    }
                    // Some browsers (e.g., FF3.6 and Safari 5) cannot calculate target.bufferered.end()
                    // to be anything other than 0. If the byte count is available we use this instead.
                    // Browsers that support the else if do not seem to have the bufferedBytes value and
                    // should skip to there. Tested in Safari 5, Webkit head, FF3.6, Chrome 6, IE 7/8.
                    else if (self.video && self.video.bytesTotal !== undefined && self.video.bytesTotal > 0 && self.video.bufferedBytes !== undefined) {
                        percent = self.video.bufferedBytes / self.video.bytesTotal;
                    }

                    // Someday we can have a loading animation for videos
                    var cpct = Math.round(percent * 100);
                    if(cpct === 100) {
                        // do something now that we are done
                    } else {
                        // do something with this percentage info (cpct)
                    }
            });

            // Video Play Listener, fires after video loads
            this.video.addEventListener("canplaythrough", function() {

                if(self.options.autoplay === true) {
                    self.video.play();
                }

                self.animate();
                log("playing");
            });

            // set the video src and begin loading
            self.video.src = this.attr('data-video-src');
        } else if(photo !== false) {
            self.photo.onload = self.animate;
            self.photo.crossOrigin = 'anonymous';
            self.photo.src = $(self).attr('data-photo-src');
        }

    }

    // create separate webgl layer and scene for drawing onscreen controls
    function createControls() {

        var muteControl = self.options.muted ? 'fa-volume-off' : 'fa-volume-up';
        var playPauseControl = self.options.autoplay ? 'fa-pause' : 'fa-play';

        controlsHTML = ' \
            <div class="controls"> \
                <a href="#" class="playButton button fa '+ playPauseControl +'"></a> \
                <a href="#" class="muteButton button fa '+ muteControl +'"></a> \
                <a href="#" class="fullscreenButton button fa fa-expand"></a> \
            </div> \
        ';

        this.append(controlsHTML, true);

        // hide controls if option is set
        if(this.options.hideControls) {
            $(self).find('.controls').hide();
        }

        // wire up controller events to dom elements
        attachControlEvents();
    }

    function attachControlEvents() {

        document.addEventListener( 'mousemove', self.onDocumentMouseMove, false );
        document.addEventListener( 'mousewheel', self.onDocumentMouseWheel, false );
        document.addEventListener( 'mousedown', self.onDocumentMouseDown, false);
        document.addEventListener( 'mouseup', self.onDocumentMouseUp, false);
        document.addEventListener( 'DOMMouseScroll', self.onDocumentMouseWheel, false);

        // CONTROLS
        $(self).find('.playButton').click(function(e) {
            e.preventDefault();
            if($(this).hasClass('fa-pause')) {
                $(this).removeClass('fa-pause').addClass('fa-play');
                self.pause();
            } else {
                $(this).removeClass('fa-play').addClass('fa-pause');
                self.play();
            }
        });

        $(self).find('.pauseButton').click(function(e) {
            e.preventDefault();
            self.pause();
        });

        $(self).find(".fullscreenButton").click(function(e) {
            e.preventDefault();
            var elem = $(self)[0];
            if($(this).hasClass('fa-expand')) {
                if (elem.requestFullscreen) {
                  elem.requestFullscreen();
                } else if (elem.msRequestFullscreen) {
                  elem.msRequestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                  elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullscreen) {
                  elem.webkitRequestFullscreen();
                }
            } else {
                if (elem.requestFullscreen) {
                  document.exitFullscreen();
                } else if (elem.msRequestFullscreen) {
                  document.msExitFullscreen();
                } else if (elem.mozRequestFullScreen) {
                  document.mozCancelFullScreen();
                } else if (elem.webkitRequestFullscreen) {
                  document.webkitExitFullscreen();
                }
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

        self.onDocumentMouseUp = function( ) {
            mouseDown = false;
        };

        self.onDocumentMouseDown = function( event ) {
            mouseDown = true;
            dragStart.x = event.pageX;
            dragStart.y = event.pageY;
        };

        // attach mouse listeners
        self.onDocumentMouseMove = function( event ) {
            self.onPointerDownPointerX = event.clientX;
            self.onPointerDownPointerY = -event.clientY;

            self.onPointerDownLon = self.lon;
            self.onPointerDownLat = self.lat;

            var x, y;

            if(self.options.clickAndDrag) {
                if(self.mouseDown) {
                    x = event.pageX - self.dragStart.x;
                    y = event.pageY - self.dragStart.y;
                    self.dragStart.x = event.pageX;
                    self.dragStart.y = event.pageY;
                    self.lon += x;
                    self.lat -= y;
                }
            } else {
                if($(self).is(":hover")) {
                    x = event.pageX - $(self).find('canvas').offset().left;
                    y = event.pageY - $(self).find('canvas').offset().top;
                    lon = ( x / $(self).find('canvas').width() ) * 430 - 225;
                    lat = ( y / $(self).find('canvas').height() ) * -180 + 90;
                }
            }
        };

        self.onDocumentMouseWheel = function( event ) {

            var wheelSpeed = -0.01;

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

            if($(self).is(":hover")) {
                camera.setLens(fov);
                event.preventDefault();
            }
        };

    }

    $(window).resize(function() {
        self.resizeGL($(self).width(), $(self).height());
    });

    self.fullscreen = function() {
        if(!window.screenTop && !window.screenY && $(self).find('a.fa-expand').length > 0) {
            self.resizeGL(screen.width, screen.height);

            $(self).addClass('fullscreen');
            $(self).find('a.fa-expand').removeClass('fa-expand').addClass('fa-compress');

            isFullscreen = true;
        } else {
            self.resizeGL(self.originalWidth, self.originalHeight);

            $(self).removeClass('fullscreen');
            $(self).find('a.fa-compress').removeClass('fa-compress').addClass('fa-expand');

            self.isFullscreen = false;
        }
    };

    self.resizeGL = function(w, h) {
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    };

    $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange',self.fullscreen);

    //Exposed functions
    self.play = function() {
      //code to play media
      self.video.play();
    };

    self.pause = function() {
      //code to stop media
      self.video.pause();
    };

    self.loadVideo = function(videoFile) {
      self.video.src = videoFile;
    };

    self.loadPhoto = function(photoFile) {
        self.photo.src = photoFile;
    };


    self.render = function() {

        self.lat = Math.max( - 85, Math.min( 85, self.lat ) );
        self.phi = ( 90 - self.lat ) * Math.PI / 180;
        self.theta = self.lon * Math.PI / 180;

        var cx = 500 * Math.sin( self.phi ) * Math.cos( self.theta );
        var cy = 500 * Math.cos( self.phi );
        var cz = 500 * Math.sin( self.phi ) * Math.sin( self.theta );

        self.camera.lookAt(new THREE.Vector3(cx, cy, cz));

        // distortion
        if(self.options.flatProjection) {
            self.camera.position.x = 0;
            self.camera.position.y = 0;
            self.camera.position.z = 0;
        } else {
            self.camera.position.x = - cx;
            self.camera.position.y = - cy;
            self.camera.position.z = - cz;
        }

        self.renderer.clear();
        self.renderer.render( scene, camera );
    };

    self.animate = function() {
        // set our animate function to fire next time a frame is ready
        requestAnimationFrame( self.animate );

        if ( self.video.readyState === self.video.HAVE_ENOUGH_DATA && !self.photo) {
            if(typeof(texture) !== "undefined" ) {
                var ct = new Date().getTime();
                if(ct - self.time >= 30) {
                    self.texture.needsUpdate = true;
                    self.time = ct;
                }
            }
        }

        self.render();

    };


    // TODO: wire up a custom log function to turn off if we have debug mode set to false
    function log(msg) {
        console.info(msg);
    }

})(jQuery);
