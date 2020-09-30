$(document).ready(function () {
	// ———————————————————––————— //
	// —— BEGIN Document Ready —— //
	// —————————————————————––——— //

	// initialize city and state variables
	var city;
	var state;

	renderBtns();

	function saveSearch(cityData, stateData) {
		// get local storage items
		var currentData = JSON.parse(localStorage.getItem("saved-searches")) || [];
		// create a new object with the incoming searches
		var dataObj = {
			city: cityData,
			state: stateData,
		};
		// add the new search data to the front of the array
		currentData.unshift(dataObj);
		// show only the 10 most recent searches
		currentData = currentData.slice(0, 10);
		// set the new currentData object to local storage
		localStorage.setItem("saved-searches", JSON.stringify(currentData));
	}

	// the function that will create buttons for each recent search
	function renderBtns() {
		// get local storage
		var currentData = JSON.parse(localStorage.getItem("saved-searches")) || [];
		// the main for loop which will parse through the object and create buttons for each search
		for (var i = 0; i < currentData.length; i++) {
			// create variables that match up with the dataObj key/value pairs
			let city = currentData[i].city;
			let state = currentData[i].state;
			// append the new recent search buttons to the proper div
			$("#saved-searches").append(
				`<button class="btn btn-secondary mx-1 my-1 saved-button">${city}, ${state}</button>`
			);
		}
	}

	// click function for each of the recent searches buttons
	$(document).on("click", ".saved-button", function () {
		// set the button value to the text of the button
		let value = $(this).text();
		// split the text at the comma/space
		value = value.split(", ");
		// set the new city variable to the 0 index in the value array
		city = value[0];
		// set the new city variable to the 1 index in the value array
		state = value[1];
		// pass the new city/state variables into the search weather function on button click
		searchWeather(city, state);
	});

	// collect user input from the search form in the main header, and pass that information into the city and state variables above
	$(".submit").on("click", function (e) {
		$("#saved-searches").empty();
		renderBtns();
		e.preventDefault();
		city = $(".city-search").val();
		state = $(".state-search").val();
		searchWeather(city, state);
	});

	// the main search function
	function searchWeather(city, state) {
		$("#saved-searches").empty();
		renderBtns();
		// clear the blocks as each new search is made
		$(".weather-row-1").empty();

		// only allow searches when both a city and state is entered
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
		var queryURL = `https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${city},${state},US&appid=${apiKey}`;

		$.ajax({
			url: queryURL,
			method: "GET",
		}).then(function (response) {
			console.log(queryURL);
			console.log(response);

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

				// ————————————————————————————————————————————— //
				// ————————————————————————————————————————————— //
				// NEW DYNAMIC FUNCTION FOR CURRENT WEATHER CARD //
				// ————————————————————————————————————————————— //
				// ————————————————————————————————————————————— //

				// create and populate an h2 heading
				var cityHeading = $(".city-heading");
				cityHeading.html(
					`<p class="text-center mx-auto">Weather in <span class="underline">${response.name}, ${state}</span></p>`
				);
				cityHeading.css("color", "white");
				// create the main card container
				var currentCardContainer = $(
					`<div class="col-sm-6 col-md-4 d-flex card-container">`
				);
				// create the card itself
				var currentCardDiv = $(
					`<div class="card border-success mb-3 mx-auto flex-fill today-weather" style="max-width: 30rem">`
				);
				// ——————————————————————— //
				// create the card header
				var currentCardHeader = $(
					`<div class="card-header text-center"><span>`
				);

				// ——————————————————————— //
				// print the date elements to the dom
				currentCardHeader.text("Current Weather");
				currentCardDiv.append(currentCardHeader);
				currentCardContainer.append(currentCardDiv);
				$(".weather-row-1").append(currentCardContainer);

				// ——————————————————————— //
				// Create the card elements
				var currentCardBodyDiv = $(`<div class="card-body row">`);
				var currentCardTempDiv = $(`<div
					class="card-text col-xs-7 mx-auto my-auto current-weather">`);

				// pull in the icon from openweather and populate in the current weather field
				var currentIconCode = response.weather[0].icon;
				var currentIconURL = `http://openweathermap.org/img/wn/${currentIconCode}@2x.png`;
				var desc = forecast.current.weather[0].description;

				// ——————————————————————— //
				// collect the temperature from the api response
				var temp = response.main.temp.toFixed(0);
				// print the current temperature to the dom
				$(currentCardTempDiv).html(
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
				// append the temp div to the body
				currentCardBodyDiv.append(currentCardTempDiv);

				// ——————————————————————— //
				// weather icon
				var currentIcon = forecast.current.weather[0].icon;
				var currentIconURL = `http://openweathermap.org/img/wn/${currentIcon}@2x.png`;
				var currentCardIconDiv = $(
					`<div class="current-icon my-auto mx-auto col-xs-5">`
				);
				currentCardIconDiv.html(
					`<img class="weather-icon" src="${currentIconURL}"><br>`
				);
				// append the icon div to the card body
				currentCardBodyDiv.append(currentCardIconDiv);

				// ——————————————————————— //
				// Add footer elements below
				// ——————————————————————— //
				var currentCardFooterDiv = $(`<div class="card-body row my-3">`);

				// humidity
				var currentCardhumidityDiv = $(
					`<div class="wind my-auto mx-auto col-xs-4">`
				);
				currentCardhumidityDiv.html(
					`<h6 class="text-center">${forecast.current.humidity}%<br><span class="small">Humidity</span></h6>`
				);
				currentCardFooterDiv.append(currentCardhumidityDiv);

				// ——————————————————————— //
				// wind speed
				var currentCardWindDiv = $(
					`<div class="wind my-auto mx-auto col-xs-4">`
				);
				currentCardWindDiv.html(
					`<h6 class="text-center">${forecast.current.wind_speed} mph<br><span class="small">Wind Speed</span></h6>`
				);
				currentCardFooterDiv.append(currentCardWindDiv);

				// ——————————————————————— //
				// uv index
				var uvIndex = +forecast.current.uvi.toFixed(0);
				var currentCardUvDiv = $(
					`<div class="uv-index my-auto mx-auto col-xs-4">`
				);
				currentCardUvDiv.html(
					`<h6 class="text-center">${uvIndex}<br><span class="small">UV Index</span></h6>`
				);
				// dynamically update the uv index color based on rating
				if (uvIndex < 4) {
					currentCardUvDiv.css("color", "green");
				}
				if (uvIndex >= 4 || uvIndex <= 6) {
					currentCardUvDiv.css("color", "yellow");
				}
				if (uvIndex > 6) {
					currentCardUvDiv.css("color", "red");
				}
				currentCardFooterDiv.append(currentCardUvDiv);

				// ——————————————————————— //
				// ——————————————————————— //
				// append the card elements to the container
				currentCardDiv.append(currentCardBodyDiv);
				currentCardDiv.append(currentCardFooterDiv);

				// ————————————————————————————————————————————— //
				// ————————————————————————————————————————————— //
				// END DYNAMIC FUNCTION FOR CURRENT WEATHER CARD //
				// ————————————————————————————————————————————— //
				// ————————————————————————————————————————————— //

				// ———————————————————— //
				// ———————————————————— //
				// data comes back with a daily array within the parent object. This daily array begins with the (today) at the 0 index, so for the forecast, I need to start grabbing data from the 1 index and beyond.
				// ———————————————————— //
				// ———————————————————— //

				// ———————— DYNAMICALLY CREATE THE FORECAST BLOCKS ———————— //
				for (var i = 1; i < 6; i++) {
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
					// get the timestamp from each individual forecast object
					var timeStamp = forecast.daily[i].dt;
					// convert the timestamp to a readable string for the user
					var correctDate = moment(timeStamp * 1000).format("MMM Do[,] YYYY");
					console.log(correctDate);

					// ——————————————————————— //
					// print the date elements to the dom
					cardHeader.text(correctDate);
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
