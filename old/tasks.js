var fakeTasks = [
	"You take this home, throw it in a pot, add some broth, a potato—baby, you got a stew going!",
	"It's so watery and yet, there's a smack of ham to it!",
	"Unlimited juice? This party is going to be off the hook!",
	"I'm not sure how 'Solid As a Rock' helps people forget that we built houses in Iraq.",
	"I've made a huge mistake.",
	"It's as Ann as the nose on plain's face.",
	"I know you're the big marriage expert. Oh, I'm sorry, I forgot: your wife is dead.",
	"I don't know what I expected.",
	"Did you enjoy your meal, mom? You drank it fast enough!",
	"I mean, it's one banana, Michael. What could it cost? 10 dollars?",
	"She thinks I'm too critical—that's another fault of hers.",
	"Here's some money. Go see a Star War.",
	"And that's why you always leave a note!",
	"I don’t understand the question and I won’t respond to it.",
	"If you weren’t all the way on the other side of the room, I’d slap your face.",
	"In this business of show, you have to have the heart of an angel and the hyde of an elephant.",
	"There are dozens of us. Dozens!",
	"Has anyone in this family even seen a chicken?",
	"These are my awards, mother. From Army.",
	"I was made to understand that there would be grilled cheese sandwiches here.",
	"I'm a monster!",
];

for (var i = 0; i < fakeTasks.length; i++) {
	var id = $(".card-text")[i];
	var rndNum = Math.floor(Math.random() * fakeTasks.length);
	$(id).text(fakeTasks[rndNum]);
	$(id).css("color", "rgb(255, 255, 255, 0.35)");
}

// create an event listener for the edit button
$(".fa-edit, .card-text").on("click", function (e) {
	console.log("hi");

	// grab the data-hour attribute so we can use that to print the userinput in the correct textarea upon save
	var id = $(this).data("hour");
	var updatedCard = $("#card" + id);
	var updatedIcon = $("#icon" + id);

	$("#exampleModalCenter").modal("show");
});

$(".save-task").on("click", function (e) {
	$(e.relatedTarget).data("id");
	// save the user input in a unique variable
	var task = {
		hour: id,
		message: $("#taskArea").val(),
	};
	console.log(task.hour);
	console.log(task.message);

	if (id === 9) {
		console.log("this is 9");
	}
});
