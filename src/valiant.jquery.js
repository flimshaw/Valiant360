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
        fov: 35
    }

    var camera
      , scene
      , renderer
      , video
      , texture
      , texture_placeholder;
  
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

        // process defaults

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( options.fov, window.innerWidth / window.innerHeight, .1, 1000);
    }  
  
    //Exposed functions  
    function play() {  
      //code to play media
    }  
  
    function stop() {  
      //code to stop media  
    }

});