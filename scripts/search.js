var city;
var state;

$(".submit").on("click", function (event) {
	event.preventDefault();
	city = $("#city-search").val();
	state = $("#state-search").val();
	if ($("#city-search").val() != "" && $("#state-search").val() != "") {
		city = $("#city-search").val();
		state = $("#state-search").val();
	} else {
		alert("Please enter a city name to view weather data.");
	}
	console.log(city);
	console.log(state);
});
