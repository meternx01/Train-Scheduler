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

function train(name,destination,frequency, firstDeparture){
    this.name = name;
    this.destination = destination;
    this.frequency = frequency;
    this.firstDeparture = firstDeparture;
}

//extract from form
$(".buttonSubmit").click(function(event){
    event.preventDefault();
    if(moment($("#inputFirstTime").val().trim(),"HH:mm").isValid()){
        $(".firstTime").removeClass("has-error");
        var name = $("#inputName").val().trim();
        var destination = $("#inputDestination").val().trim();
        var firstTime = moment($("#inputFirstTime").val().trim(),"HH:mm");
        console.log(firstTime.format("HH:mm"));
        var frequency = $("#inputFreq").val().trim();
    }
    else {
        $(".firstTime").addClass("has-error");
    }
    this.form.reset();

    // var trainTime = new train(name,
});
//display from firebase

//load to firebase
