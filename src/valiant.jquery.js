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
;define(['jquery', 'threejs'], function ( $, THREE ) {
 
    //define the commands that can be used  
    var commands = {  
        play: play,  
        stop: stop  
    };

    var defaults = {
        fov: 35,
        loop: "loop",
        muted: true,
        debug: false
    }

    var camera
      , scene
      , renderer
      , video
      , texture
      , texture_placeholder
      , self;
  
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

        self = this;

        return this;  
    };  
  
    function createMediaPlayer(options){

        this.options = $.extend( {}, defaults, options) ;

        // create ThreeJS scene and camera
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( this.options.fov, window.innerWidth / window.innerHeight, .1, 1000);

        // create off-dom video player
        video = document.createElement( 'video' );
        video.loop = this.options.loop;
        video.muted = this.options.muted;

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
                    log(cpct);
                }
            
        });

        // Video Play Listener, fires after video loads
        video.addEventListener("canplaythrough", function(e) {
            video.play();
        });

        video.src = this.attr('data-video-src');
    }  
  
    //Exposed functions  
    function play() {  
      //code to play media
    }  
  
    function stop() {  
      //code to stop media  
    }


    // TODO: wire up a custom log function to turn off if we have debug mode set to false
    function log(msg) {
        console.info(msg);
    }

});