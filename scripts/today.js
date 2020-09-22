// Document ready?
$(document).ready(function () {
	// —————————————————————————————————————————————— //
	// display current date and time in the jumbotron //
	// —————————————————————————————————————————————— //
	var update = function () {
		$(".currentDay").text("Today is " + moment().format("dddd, MMMM Do"));
	};
	update();
	setInterval(update, 1000);
	// —————————————————————————————————————————————— //
	// —————————————————————————————————————————————— //
	// —————————————————————————————————————————————— //
});
