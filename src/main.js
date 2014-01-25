require.config({
	paths: {
		"jquery": "lib/jquery-1.7.2.min",
		"threejs": "lib/Three",
		"detector": "lib/Detector",
		"valiant": "valiant.jquery",
		"modernizr": "lib/modernizr-latest"
	},
	shim: {
		"threejs": {
			exports: "THREE"
		},
		"detector": {
			deps: ['threejs']
		}
	}
});

require([
	"jquery",
	"valiant"
], function($) {

	$(document).ready(function() {

		$(".Valiant360").Valiant360();
	
	});

});