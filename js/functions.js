var panorama;

jQuery( function( $ ) {
	
	// make a panorama
    panorama = new Panorama($('h2.clip_name').text());
	
	// define the cameras we need
	// TODO: this should be defined on a per panorama basis eventually
	var cameras = ['left', 'front', 'right', 'rear', 'up'];
	
	// loop through and add our cameras to the panorama
	for (camera in cameras) {
	    panorama.addCamera(cameras[camera]);
	}
	
	$("a.pano-rough-stitch").click(function() {
	    panorama.renderPanorama(parseInt($(this).attr('href').substring(4), 10));
	    return false;
	});
	
	$("#control_buttons a").click(function() {
	    var offset = panorama.cameras[$(this).parent().attr('name')].addOffset(parseInt($(this).attr('href')));
	    $(this).parent().find('.offset').text(offset.toString());
	    panorama.renderPanorama();
	    return false;
	});
	
	$(".master a").click(function() {
            panorama.renderPanorama(panorama.frame + parseInt($(this).attr('href')));
            return false;
	});
	
	$("a.stitch_preview").click(function() {
	    // computers are so awesome
	    var camera_settings = {};
	    camera_settings['left'] = panorama.cameras['left'].offset;
	    camera_settings['front'] = panorama.cameras['front'].offset;
	    camera_settings['right'] = panorama.cameras['right'].offset;
	    camera_settings['rear'] = panorama.cameras['rear'].offset;
	    camera_settings['up'] = panorama.cameras['up'].offset;
	    camera_settings['frame'] = panorama.frame;
	    
	    $.post("/stitch_preview/", { 'camera_settings': JSON.stringify(camera_settings), 'csrfmiddlewaretoken':$("#csrfmiddlewaretoken").val() }, function(data) {
	        $("#console").html(data);
	    });
	    return false;
	});

});

function Camera(name) {
    this.name = name;
    this.offset = 0;
    this.addOffset = function(offset) {
        this.offset += offset;
        return this.offset;
    }
    $("#console").text("camera " + name + " initialized.");
}

function Panorama(name) {
    this.name = name;
    this.source_path = '/assets/media/source_clips/' + this.name;
    this.frame = 1;
    // array of cameras in this panorama
    this.cameras = {};
    
    // function for appending panoramas to our list
    this.addCamera = function(camera) {
        this.cameras[camera] = new Camera(camera);
        $("#console").text("camera " + camera + " added.");
    }
    
    // function for rendering a panorama
    // TODO: automate the way cameras are positioned, for now let's just hardset it
    this.renderPanorama = function(frame) {
        if(!frame) {
            frame = this.frame;
        } else {
            this.frame = frame;
        }
        for(camera in this.cameras) {
            var c = this.cameras[camera];
            var frame_string = 'pano' + zeroPad(parseInt(this.frame + c.offset), 5);
            var im = $("#previewPanel img." + c.name + "_image");
            im.attr('src', this.source_path + '/' + frame_string + '/' + frame_string + '-' + c.name + '.jpg');
            if(camera != "up") im.rotate(90);
        }
    }

}

function zeroPad(num, numZeros) {
    var n = Math.abs(num);
    var zeros = Math.max(0, numZeros - Math.floor(n).toString().length );
    var zeroString = Math.pow(10,zeros).toString().substr(1);
    if( num < 0 ) {
        zeroString = '-' + zeroString;
    }

    return zeroString+n;
}

