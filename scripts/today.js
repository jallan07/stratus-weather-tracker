// Document ready?
$(document).ready(function () {
	// —————————————————————————————————————————————— //
	// display current date and time in the jumbotron //
	// —————————————————————————————————————————————— //
	var update = function () {
		$(".currentDay").text(moment().format("dddd, MMMM Do"));
		$(".localTime").text(moment().format("h:mm:ss a"));
	};
	update();
	setInterval(update, 1000);
	// —————————————————————————————————————————————— //
	// —————————————————————————————————————————————— //
	// —————————————————————————————————————————————— //
});
