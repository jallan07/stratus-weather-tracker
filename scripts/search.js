$(document).ready(function () {
	// ———————————————————––————— //
	// —— BEGIN Document Ready —— //
	// —————————————————————––——— //

	// initialize city and state variables
	var city;
	var state;

	function saveSearch(cityData, stateData) {
		var currentData = JSON.parse(localStorage.getItem("saved-searches")) || [];
		var dataObj = {
			city: cityData,
			state: stateData,
		};
		currentData.push(dataObj);
		currentData = currentData.slice(0, 10);
		localStorage.setItem("saved-searches", JSON.stringify(currentData));
	}

	// collect user input from the search form in the main header, and pass that information into the city and state variables above

	function renderBtns() {
		var currentData = JSON.parse(localStorage.getItem("saved-searches")) || [];
		for (var i = 0; i < currentData.length; i++) {
			let city = currentData[i].city;
			let state = currentData[i].state;
			$("#saved-searches").append(
				`<button class="btn btn-secondary mx-1 my-1 saved-button">${city}, ${state}</button>`
			);
		}
	}

	$(document).on("click", ".saved-button", function () {
		let value = $(this).text();
		value = value.split(", ");
		city = value[0];
		state = value[1];
		searchWeather(city, state);
	});

	$(".submit").on("click", function (e) {
		$("#saved-searches").empty();
		e.preventDefault();
		city = $(".city-search").val();
		state = $(".state-search").val();
		searchWeather(city, state);
		renderBtns();
	});

	function searchWeather(city, state) {
		// Will need to use the following code in order to clear the blocks as each new search is made -- but first need to create the js code that will dynamically create the current weather card
		// $(".weather-row-1").empty();

		if (city === "") {
			alert("You must enter both a city AND a state name to continue.");
			return;
		} else if (state === "Select a state") {
			alert("You must enter both a city AND a state name to continue.");
			return;
		} else {
			saveSearch(city, state);
		}

		var apiKey = "63f6253feb7c1af59a49c4232d8efc07";
		var queryURL = `https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${city},${state}&appid=${apiKey}`;

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

				// define the uv index variable
				var uvIndex = +forecast.current.uvi.toFixed(0);
				console.log(uvIndex);

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

				// print the uv index for the current day to the dom
				$(".uv-index").html(
					`<h6 class="text-center">${uvIndex}<br><span class="small">UV Index</span></h6>`
				);
				// ———————————————————— //
				// ———————————————————— //
				// data comes back with a daily array within the parent object. This daily array begins with the (today) at the 0 index, so for the forecast, I need to start grabbing data from the 1 index and beyond.
				// ———————————————————— //
				// ———————————————————— //

				// set count = 1 so that we can use this to increment our forecast day count
				var count = 1;
				// ———————— DYNAMICALLY CREATE THE FORECAST BLOCKS ———————— //
				for (var i = 0; i < 5; i++) {
					// create the main card container
					var cardContainer = $(
						`<div class="col-sm-6 col-md-4 d-flex card-container">`
					);

					// create the card itself
					var cardDiv = $(
						`<div class="card border-success mb-3 mx-auto flex-fill today-weather" style="max-width: 30rem">`
					);

					// ——————————————————————— //
					// create the card header
					var cardHeader = $(`<div class="card-header text-center"><span>`);

					// ——————————————————————— //
					// get today's date
					var getDate = new Date();
					// convert today's date to a string
					var date = getDate.toDateString();
					// split today's date
					var dateArr = date.split(" ");
					// set the day number equal to the day + the current count
					dayNum = moment().add(count, "days").date();
					// set the day variable so that it reads like Sep 24, 2020
					var day = dateArr[1] + " " + dayNum + ", " + dateArr[3];

					// ——————————————————————— //
					// print the date elements to the dom
					cardHeader.text(day);
					cardDiv.append(cardHeader);
					cardContainer.append(cardDiv);
					$(".weather-row-1").append(cardContainer);

					// ——————————————————————— //
					// Create the card elements
					var cardBodyDiv = $(`<div class="card-body row">`);
					var cardTempDiv = $(`<div
					class="card-text col-xs-7 mx-auto my-auto current-weather">`);

					// ——————————————————————— //
					// temperature/description
					var maxTemp = forecast.daily[i].temp.max.toFixed(0);
					var minTemp = forecast.daily[i].temp.min.toFixed(0);
					var forecastDesc = forecast.daily[i].weather[0].description;

					cardTempDiv.html(
						`<h4 class="temp-num text-center">${maxTemp}°F <span class="small">${minTemp}°F</span></h4>
						<h6>${forecastDesc}</h6>`
					);
					cardBodyDiv.append(cardTempDiv);

					// dynamically change the color of the weather block borders based on temp
					if (maxTemp <= 50) {
						$(cardDiv).removeClass("border-warning");
						$(cardDiv).removeClass("border-danger");
						$(cardDiv).addClass("border-info");
					}
					if (maxTemp > 50 && maxTemp <= 79) {
						$(cardDiv).removeClass("border-info");
						$(cardDiv).removeClass("border-danger");
						$(cardDiv).addClass("border-warning");
					}
					if (maxTemp > 79) {
						$(cardDiv).removeClass("border-info");
						$(cardDiv).removeClass("border-warning");
						$(cardDiv).addClass("border-danger");
					}

					// ——————————————————————— //
					// weather icon
					var icon = forecast.daily[i].weather[0].icon;
					var iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

					var cardIconDiv = $(
						`<div class="current-icon my-auto mx-auto col-xs-5">`
					);
					cardIconDiv.html(`<img class="weather-icon" src="${iconURL}"><br>`);
					cardBodyDiv.append(cardIconDiv);

					// ——————————————————————— //
					// Add footer elements below
					// ——————————————————————— //
					var cardFooterDiv = $(`<div class="card-body row my-3">`);
					// ——————————————————————— //
					// humidity
					var cardhumidityDiv = $(
						`<div class="wind my-auto mx-auto col-xs-4">`
					);
					cardhumidityDiv.html(
						`<h6 class="text-center">${forecast.daily[i].humidity}%<br><span class="small">Humidity</span></h6>`
					);
					cardFooterDiv.append(cardhumidityDiv);

					// ——————————————————————— //
					// wind speed
					var cardWindDiv = $(`<div class="wind my-auto mx-auto col-xs-4">`);
					cardWindDiv.html(
						`<h6 class="text-center">${forecast.daily[i].wind_speed} mph<br><span class="small">Wind Speed</span></h6>`
					);
					cardFooterDiv.append(cardWindDiv);

					// ——————————————————————— //
					// uv index
					var cardUvDiv = $(`<div class="uv-index my-auto mx-auto col-xs-4">`);
					cardUvDiv.html(
						`<h6 class="text-center">${forecast.daily[i].uvi.toFixed(
							0
						)}<br><span class="small">UV Index</span></h6>`
					);
					cardFooterDiv.append(cardUvDiv);

					// dynamically update the uv index color based on rating
					if (forecast.daily[i].uvi.toFixed(0) < 4) {
						$(cardUvDiv).css("color", "green");
					}
					if (forecast.daily[i].uvi.toFixed(0) >= 4 || uvIndex <= 6) {
						$(cardUvDiv).css("color", "yellow");
					}
					if (forecast.daily[i].uvi.toFixed(0) > 6) {
						$(cardUvDiv).css("color", "red");
					}

					// ——————————————————————— //
					// ——————————————————————— //
					// append the footer to the main card itself
					cardDiv.append(cardBodyDiv);
					cardDiv.append(cardFooterDiv);

					// ——————————————————————— //
					// ——————————————————————— //
					// increment the count by 1 so next time we come through the dates are correct
					count++;

					// unhide the corresponding elements once all data has been retreived from the api
					$(".weather-row-1").removeClass("d-none");
					$("#recent-searches").removeClass("d-none");
					$("#icon-list").removeClass("d-none");
				}
			});
		});
	}

	// ———————————————————————— //
	// —— END Document Ready —— //
	// ———————————————————————— //
});
