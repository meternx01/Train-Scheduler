// Initialize Firebase - set database as the firebase database link
var config = {
	apiKey: "AIzaSyBdpeq7g5seURVb4y44t2y2UMThZ4WOexs",
	authDomain: "trainsimulator-245b5.firebaseapp.com",
	databaseURL: "https://trainsimulator-245b5.firebaseio.com",
	projectId: "trainsimulator-245b5",
	storageBucket: "",
	messagingSenderId: "873356918145"
};
firebase.initializeApp(config);
var database = firebase.database();

// Object contructor for each entry on the board
function train(name, destination, frequency, firstDeparture, dateAdded){
	this.name = name;
	this.destination = destination;
	this.frequency = frequency;
	this.firstDeparture = firstDeparture;
	this.dateAdded=dateAdded;
}

// On button event to pull data from the form
$(".buttonSubmit").click(function(event){
	// stop from empty form fill
	event.preventDefault();
	// make a moment object from the train time input
	var momentTime = moment($("#inputFirstTime").val().trim(),"HH:mm");
	// input validation
	// if valid date an frequency is a number
	if(inputValid(momentTime, parseInt($("#inputFreq").val().trim()) )){
		// reset the form field style if incorrect
		$(".firstTime").removeClass("has-error");
		$(".freqTime").removeClass("has-error");
		// extract name
		var name = $("#inputName").val().trim();
		// extract destination
		var destination = $("#inputDestination").val().trim();
		// extract string of the moment
		var firstTime = momentTime.format("HH:mm");
		// extract the frequency number
		var frequency = parseInt($("#inputFreq").val().trim());
		// create a board object for loading to firebase (with current time from firebase)
		var trainTime = new train(name,destination,frequency,firstTime,firebase.database.ServerValue.TIMESTAMP);
		// console.log(trainTime);
		// push to firebase
		pushToFirebase(trainTime);
		// clear the form
		this.form.reset();
	}
	// if either the time is not a valid time or the frequency is not a number
	else {
		// if time not a valid time, change the field to red
		if(!moment($("#inputFirstTime").val().trim(),"HH:mm").isValid()){
			$(".firstTime").addClass("has-error");
		}
		// if frequency is not a number, change fireld to red
		if(isNaN(parseInt($("#inputFreq").val().trim()))){
			$(".freqTime").addClass("has-error");
		}
	}
});

// function to write a snapshot to the table
function outputToTable(sv){
	// create a moment from the string time from Firebase
	var momentTime = moment(sv.firstDeparture,"HH:mm");
	// calculate the remainer for how long since last departure
	var remainderTime = moment().diff(momentTime,"minutes") %  sv.frequency
	// calculate when the next train should arrive
	var nextTrain = sv.frequency - (remainderTime);
	// find the next arrival time
	momentTime = moment().add(nextTrain,"minutes");
	// DOM Output for the table - APPEND to existing table
	$("#schedule-table > tbody").append("<tr><td>"+ sv.name + "</td><td>" + sv.destination +
	"</td><td>" + sv.frequency + "</td><td>" + momentTime.format("HH:mm") + "</td><td>" +
	nextTrain + "</td></tr>");
}

// Function that returns if the time AND the frequency is valid
function inputValid(time, number){
	// if the time is valid (moment method) and the frequency is a number
	if(time.isValid() && !isNaN(number))
	{
		// return valid
		return true;
	}
	else    // if either one or both are false
	{
		// return not valid
		return false;
	}
}

// Function that display from Firebase when a entry is added
database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {
	// write to the table
	outputToTable(snapshot.val());
});

// Function that loads existing data from Firebase at page load
	database.ref().once("value", function(snapshot) {
		// clear the table
		$("#schedule-table > tbody").empty();
		// iterate through each entry in Firebase
		snapshot.forEach(function(childNodes){
			// write to table
			outputToTable(childNodes.val());
		})

	});

// Function to write an entry to Firebase
function pushToFirebase(trainObject)
{
	// Push the entry object as a child to Firebase
	 database.ref().push(trainObject);
}
