$(document).ready(function () {
	// ———————————————————––————— //
	// —— BEGIN Document Ready —— //
	// —————————————————————––——— //

	// initialize city and state variables
	var city;
	var state;

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

		var apiKey = "63f6253feb7c1af59a49c4232d8efc07";
		var queryURL = `https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${city},${state}&appid=${apiKey}`;
		console.log(queryURL);

		$.ajax({
			url: queryURL,
			method: "GET",
		}).then(function (response) {
			console.log(response);
			// create and populate an h2 heading
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
			var temp = response.main.temp.toFixed(0);

			// print the current temperature to the dom
			$(".current-weather").html(
				`<h4 class="temp-num text-center">${temp}°F </h4>
				<h6>${desc}<span class="small ml-2">(current)</span></h6>`
			);

			// dynamically change the color of the weather block borders based on temp
			if (temp <= 50) {
				$(".today-weather").removeClass("border-warning");
				$(".today-weather").removeClass("border-danger");
				$(".today-weather").addClass("border-info");
			}
			if (temp > 50 && temp <= 79) {
				$(".today-weather").removeClass("border-info");
				$(".today-weather").removeClass("border-danger");
				$(".today-weather").addClass("border-warning");
			}
			if (temp > 79) {
				$(".today-weather").removeClass("border-info");
				$(".today-weather").removeClass("border-warning");
				$(".today-weather").addClass("border-danger");
			}

			// define variables for high/low, humidity, wind, and ux index
			var humidity = response.main.humidity;
			var wind = response.wind.speed;
			// var uvIndex = response.wind.speed;

			$(".humidity").html(
				`<h6 class="text-center">${humidity}%<br><span class="small">Humidity</span></h6>`
			);
			$(".wind").html(
				`<h6 class="text-center">${wind} mph<br><span class="small">Wind Speed</span></h6>`
			);

			// define lat lon coordinate variables so that we can pull the uv index with a secondary api call
			var lat = response.coord.lat;
			var lon = response.coord.lon;

			// Create a variable to store our forecast query which we will use in the tertiary api call that pulls in a forecast response from openweathermap. Filters out any minutely, hourly, or alert data from the response object
			var forecastQueryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`;

			// run another secondary api call to grab the forecast
			$.ajax({
				url: forecastQueryURL,
				method: "GET",
			}).then(function (forecast) {
				console.log(forecast);
				// data comes back with a daily array within the parent object. This daily array begins with the (today) at the 0 index, so for the forecast, I need to start grabbing data from the 1 index and beyond.

				//define the uv index variable
				var uvIndex = forecast.current.uvi.toFixed(0);

				// print the uv index to the dom
				$(".uv-index").html(
					`<h6 class="text-center">${uvIndex}<br><span class="small">UV Index</span></h6>`
				);

				// dynamically update the uv index color based on rating
				if (uvIndex < 4) {
					$(".uv-index").css("color", "green");
				}
				if (uvIndex >= 4 || uvIndex <= 6) {
					$(".uv-index").css("color", "yellow");
				}
				if (uvIndex > 6) {
					$(".uv-index").css("color", "red");
				}

				// unhide the corresponding elements once all data has been retreived from the api
				$(".weather-row").removeClass("d-none");
				$("#recent-searches").removeClass("d-none");
				$("#icon-list").removeClass("d-none");
			});
		});
	});

	// ———————————————————————— //
	// —— END Document Ready —— //
	// ———————————————————————— //
});
