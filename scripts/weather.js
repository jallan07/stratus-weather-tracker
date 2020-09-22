$(document).ready(function () {
	// ———————————————————––————— //
	// —— BEGIN Document Ready —— //
	// —————————————————————––——— //

	// initialize city and state variables
	var city;
	var state;
	var weather;
	var tempF;
	var tempK;

	// collect user input from the search form in the main header, and pass that information into the city and state variables above
	$(".submit").on("click", function (e) {
		e.preventDefault();

		city = $(".city-search").val();
		state = $(".state-search").val();

		if ($(".city-search").val() === "") {
			alert("You must enter both a city AND a state name to continue.");
			return;
		} else if ($(".state-search").val() === "Select a state") {
			alert("You must enter both a city AND a state name to continue.");
			return;
		} else {
			city = $(".city-search").val();
			state = $(".state-search").val();
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
			var currentIconURL = `http://openweathermap.org/img/wn/${currentIconCode}@2x.png`;
			var desc = response.weather[0].main;

			// print the current weather icon and description to the dom
			$(".current-icon").html(
				`<img class="weather-icon" src="${currentIconURL}"><br>`
			);

			// collect the temperature from the api response
			var tempK = response.main.temp;
			// convert the temperature from the api response to Fahrenheit
			var tempF = ((tempK - 273.15) * 1.8 + 32).toFixed(0);

			// print the current temperature to the dom
			$(".current-weather").html(
				`<h4 class="temp-num">${tempF}°F </h4>
				<h6>${desc}<span class="temp-small ml-2">(current)</span></h6>`
			);

			// dynamically change the color of the weather block borders based on temp
			if (tempF <= 50) {
				$(".today-weather").removeClass("border-warning");
				$(".today-weather").removeClass("border-danger");
				$(".today-weather").addClass("border-info");
			}
			if (tempF > 50 && tempF <= 79) {
				$(".today-weather").removeClass("border-info");
				$(".today-weather").removeClass("border-danger");
				$(".today-weather").addClass("border-warning");
			}
			if (tempF > 79) {
				$(".today-weather").removeClass("border-info");
				$(".today-weather").removeClass("border-warning");
				$(".today-weather").addClass("border-danger");
			}
		});
	});
	// });

	// ———————————————————————— //
	// —— END Document Ready —— //
	// ———————————————————————— //
});
