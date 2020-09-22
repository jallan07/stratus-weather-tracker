$(document).ready(function () {
	// ———————————————————––————— //
	// —— BEGIN Document Ready —— //
	// —————————————————————––——— //

	// initialize city and state variables
	var city;
	var state;
	var weather;

	// collect user input from the search form in the main header, and pass that information into the city and state variables above
	$(".submit").on("click", function (e) {
		e.preventDefault();

		city = $(".city-search").val();
		state = $(".state-search").val();

		if (city != "" && state != "") {
			city = $(".city-search").val();
			state = $(".state-search").val();
		} else {
			alert("You must enter both a city AND a state name to continue.");
			return;
		}
		console.log(city);
		console.log(state);

		var apiKey = "63f6253feb7c1af59a49c4232d8efc07";
		var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state}&appid=${apiKey}`;

		$.ajax({
			url: queryURL,
			method: "GET",
		}).then(function (response) {
			// create and populate an h2 heading
			console.log(response);
			var cityHeading = $(".city-heading");
			cityHeading.html(
				`<p class="text-center mx-auto">Weather in <span class="underline">${response.name}, ${state}</span></p>`
			);
			cityHeading.css("color", "white");

			// pull in the icon from openweather and populate in the current weather field
			var currentIconCode = response.weather[0].icon;
			console.log(currentIconCode);
			var currentIconURL = `http://openweathermap.org/img/wn/${currentIconCode}@2x.png`;
			console.log(currentIconURL);

			$(".current-icon").html(
				`<img class="weather-icon" src="${currentIconURL}">`
			);
		});
	});

	// ———————————————————————— //
	// —— END Document Ready —— //
	// ———————————————————————— //
});
