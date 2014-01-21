require.config({
	paths: {
		"jquery": "lib/jquery-1.7.2.min",
		"threejs": "lib/Three",
		"valiant": "valiant.jquery"
	},
	shim: {
		"threejs": {
			exports: "THREE"
		}
	}
});

require([
	"jquery",
	"valiant"
], function($) {

	$(document).ready(function() {

		$("#valiantContainer").Valiant360();
		$("#valiantContainer").Valiant360('play');
	
	});

});