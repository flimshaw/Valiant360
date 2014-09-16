/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function ( $, THREE, Detector, window, document, undefined ) {

    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "Valiant360",
        defaults = {
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

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).

            // instantiate some local variables we're going to need
            this._time = new Date().getTime();
            this._controls = {};

            this._isVideo = false;
            this._isPhoto = false;
            this._isFullscreen = false;
            this._mouseDown = false;
            this._dragStart = {};

            this._lat = this.options.lat;
            this._lon = this.options.lon;
            this._fov = this.options.fov;

            this.createMediaPlayer();

        },

        createMediaPlayer: function() {

            // create a local THREE.js scene
            this._scene = new THREE.Scene();

            // create ThreeJS camera
            this._camera = new THREE.PerspectiveCamera( this.options.fov, $(this.element).width() / $(this.element).height(), 0.1, 1000);

            // create ThreeJS renderer and append it to our object
            this._renderer = Detector.webgl? new THREE.WebGLRenderer(): new THREE.CanvasRenderer();
            this._renderer.setSize( $(this.element).width(), $(this.element).height() );
            this._renderer.autoClear = false;
            this._renderer.setClearColor( 0x333333, 1 );

            // append the rendering element to this div
            $(this.element).append(this._renderer.domElement);

            // figure out our texturing situation, based on what our source is
            if( $(this.element).attr('data-photo-src') ) {
                this._isPhoto = true;
                this._texture = THREE.ImageUtils.loadTexture( $(this.element).attr('data-photo-src') );
            } else {
                this._isVideo = true;
                // create off-dom video player
                this._video = document.createElement( 'video' );
                this._video.style.display = 'none';
                $(this.element).append( this._video );
                this._video.loop = this.options.loop;
                this._video.muted = this.options.muted;
                this._texture = new THREE.Texture( this._video );

                // make a self reference we can pass to our callbacks
                var self = this;

                // attach video player event listeners
                this._video.addEventListener("ended", function() {

                });

                // Progress Meter
                this._video.addEventListener("progress", function() {
                    var percent = null;
                        if (self._video && self._video.buffered && self._video.buffered.length > 0 && self._video.buffered.end && self._video.duration) {
                            percent = self._video.buffered.end(0) / self._video.duration;
                        }
                        // Some browsers (e.g., FF3.6 and Safari 5) cannot calculate target.bufferered.end()
                        // to be anything other than 0. If the byte count is available we use this instead.
                        // Browsers that support the else if do not seem to have the bufferedBytes value and
                        // should skip to there. Tested in Safari 5, Webkit head, FF3.6, Chrome 6, IE 7/8.
                        else if (self._video && self._video.bytesTotal !== undefined && self._video.bytesTotal > 0 && self._video.bufferedBytes !== undefined) {
                            percent = self._video.bufferedBytes / self._video.bytesTotal;
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
                this._video.addEventListener("canplaythrough", function() {

                    if(self.options.autoplay === true) {
                        self._video.play();
                        self._videoReady = true;
                    }
                });

                // set the video src and begin loading
                this._video.src = $(this.element).attr('data-video-src');

            }

            this._texture.generateMipmaps = false;
            this._texture.minFilter = THREE.LinearFilter;
            this._texture.magFilter = THREE.LinearFilter;
            this._texture.format = THREE.RGBFormat;

            // create ThreeJS mesh sphere onto which our texture will be drawn
            this._mesh = new THREE.Mesh( new THREE.SphereGeometry( 500, 80, 50 ), new THREE.MeshBasicMaterial( { map: this._texture } ) );
            this._mesh.scale.x = -1; // mirror the texture, since we're looking from the inside out
            this._scene.add(this._mesh);

            this.animate();
        },

        animate: function() {
            // set our animate function to fire next time a frame is ready
            requestAnimationFrame( this.animate.bind(this) );
            
            if( this._isVideo ) {
                if ( this._video.readyState === this._video.HAVE_ENOUGH_DATA) {
                    if(typeof(this._texture) !== "undefined" ) {
                        var ct = new Date().getTime();
                        if(ct - this._time >= 30) {
                            this._texture.needsUpdate = true;
                            this._time = ct;
                        }
                    }
                }                
            }
            
            this.render();
        },

        render: function() {
            this._lat = Math.max( - 85, Math.min( 85, this._lat ) );
            this._phi = ( 90 - this._lat ) * Math.PI / 180;
            this._theta = this._lon * Math.PI / 180;

            var cx = 500 * Math.sin( this._phi ) * Math.cos( this._theta );
            var cy = 500 * Math.cos( this._phi );
            var cz = 500 * Math.sin( this._phi ) * Math.sin( this._theta );

            this._camera.lookAt(new THREE.Vector3(cx, cy, cz));

            // distortion
            if(this.options.flatProjection) {
                this._camera.position.x = 0;
                this._camera.position.y = 0;
                this._camera.position.z = 0;
            } else {
                this._camera.position.x = - cx;
                this._camera.position.y = - cy;
                this._camera.position.z = - cz;
            }

            this._renderer.clear();
            this._renderer.render( this._scene, this._camera );
        },

        createControls: function() {

        }

    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, THREE, Detector, window, document );