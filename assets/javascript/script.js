// Initialize Firebase
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

function train(name, destination, frequency, firstDeparture, dateAdded){
	this.name = name;
	this.destination = destination;
	this.frequency = frequency;
	this.firstDeparture = firstDeparture;
	this.dateAdded=dateAdded;
}

//extract from form
$(".buttonSubmit").click(function(event){
	event.preventDefault();
	var momentTime = moment($("#inputFirstTime").val().trim(),"HH:mm");
	if(inputValid(momentTime, parseInt($("#inputFreq").val().trim()) )){
		$(".firstTime").removeClass("has-error");
		$(".freqTime").removeClass("has-error");
		var name = $("#inputName").val().trim();
		var destination = $("#inputDestination").val().trim();
		var firstTime = momentTime.format("HH:mm");
		var frequency = parseInt($("#inputFreq").val().trim());
		var trainTime = new train(name,destination,frequency,firstTime,firebase.database.ServerValue.TIMESTAMP);
		console.log(trainTime);
		pushToFirebase(trainTime);
		this.form.reset();
	}
	else {
		if(!moment($("#inputFirstTime").val().trim(),"HH:mm").isValid()){
			$(".firstTime").addClass("has-error");
		}
		if(isNaN(parseInt($("#inputFreq").val().trim()))){
			$(".freqTime").addClass("has-error");
		}
	}


	//
});

function outputToTable(sv){
	var momentTime = moment(sv.firstDeparture,"HH:mm");
	var remainderTime = moment().diff(momentTime,"minutes") %  sv.frequency
	var nextTrain = sv.frequency - (remainderTime);
	momentTime = moment().add(nextTrain,"minutes");
	$("#schedule-table > tbody").append("<tr><td>"+ sv.name + "</td><td>" + sv.destination +
	"</td><td>" + sv.frequency + "</td><td>" + momentTime.format("HH:mm") + "</td><td>" +
	nextTrain + "</td></tr>");
}

function inputValid(time, number){
	if(time.isValid() && !isNaN(number))
	{
		return true;
	}
	else
	{
		return false;
	}
}
//display from firebase
database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {
	// $("#schedule-table > tbody").empty();
	outputToTable(snapshot.val());
});

	database.ref().once("value", function(snapshot) {
		$("#schedule-table > tbody").empty();
		snapshot.forEach(function(childNodes){
			outputToTable(childNodes.val());
		})

	});

//load to firebase
function pushToFirebase(trainObject)
{
	 database.ref().push(trainObject);
}
