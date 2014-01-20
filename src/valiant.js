/*!
 * Valiant360 panorama video player jquery plugin
 * 
 * Copyright (c) 2014 Charlie Hoey <@flimshaw>
 * 
 * Released under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 * 
 * Jquery plugin pattern by: @ajpiano
 */


// the semi-colon before the function invocation is a safety 
// net against concatenated scripts and/or other plugins 
// that are not closed properly.
;define(['jquery'], function ( $ ) {
    
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

    // CHANGE THE BELOW NAME TO REFLECT THE NAME OF THE PLUGIN ( i.e. $('#div').pluginName() )
    var pluginName = 'Valiant360',
        defaults = {
            buttons: []
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

    Plugin.prototype.init = function () {
        // Place initialization logic here
        // You already have access to the DOM element and
        // the options via the instance, e.g. this.element 
        // and this.options
        // make our container easily accessible
        var self = this;
        console.log("Valiant360 initialized.");

    };

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, 
                new Plugin( this, options ));
            }
        });
    }

});