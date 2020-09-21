for (var i = 0; i < 9; i++) {
	// define the row elements
	var card = $(".card")[i];
	// define the current hour (should stay the same each time the for loop iterates)
	var currentHour = moment().format("H");
	currentHour = +currentHour;
	// iterate through each row to find each row hour
	var cardHour = $(card).data("hour");
	cardHour = parseInt(cardHour);
	// past hours styling
	if (cardHour < currentHour) {
		$(card).addClass("border-danger");
		$(card).removeClass("border-primary");
	}
	// present hour styling
	if (cardHour === currentHour) {
		$(card).addClass("border-warning");
		$(card).removeClass("border-primary");
	}
	// future hours styling
	if (cardHour > currentHour) {
		$(card).addClass("border-success");
		$(card).removeClass("border-primary");
	}
}
