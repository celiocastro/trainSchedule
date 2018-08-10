  // Initialize Firebase
  var config = {
	apiKey: "AIzaSyC4P3Fs9fpVSWrFwWdhIa0kw5L1CbZ0bYg",
	authDomain: "trainschedule-350cd.firebaseapp.com",
	databaseURL: "https://trainschedule-350cd.firebaseio.com",
	projectId: "trainschedule-350cd",
	storageBucket: "trainschedule-350cd.appspot.com",
	messagingSenderId: "70078005339"
  };
  firebase.initializeApp(config);

  var trainData = firebase.database();
// 2. Populate Firebase Database with initial data (in this case, I did this via Firebase GUI)
// 3. Button for adding trains
	
$("#add-train").on("click", function() {
		  
// user data pulling

var trainName=$("#name-input").val().trim();
var destination=$("#destination-input").val().trim();
var firstTrain=$("#first-train-time-input").val().trim();
var frequency=$("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data

var newTrain= {

	name: trainName,
	destination: destination,
	firstTrain: firstTrain,
	frequency: frequency
};

  // Uploads train data to the database

  trainData.ref().push(newTrain);

// logs to console
console.log(newTrain.name);
console.log(newTrain.destination);
console.log(newTrain.firstTrain);
console.log(newTrain.frequency);

// alert
alert("Train Succesfully Added");

//Clear all the boxes
$("#name-input").val("");
$("#destination-input").val("");
$("#first-train-time-input").val("");
$("#frequency-input").val("");

//determines when the next train arrives
return false;
});

// Create Firebase event for adding trains to the database and a row in the html when a user adds an entry

trainData.ref().on("child_added",function(childSnapshot, prevChildkey) {

	console.log(childSnapshot.val());

	//store everything into a variable

	var tName = childSnapshot.val().name;
	var tDestination = childSnapshot.val().destination;
	var tFrequency = childSnapshot.val().frequency;
	var tFirstTrain = childSnapshot.val().firstTrain;
	

	var timeArr = tFirstTrain.split(":");
	var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
	var maxMoment = moment.max(moment().trainTime);
	var tMinutes;
	var tArrival;

// If the first train is later than the current time, sent arrival to the first train time
if(maxMoment === trainTime) {
	tArrival = trainTime.format("hh:mm A");
	tMinutes = trainTime.diff(moment(),"minutes");
} else {
	var differenceTimes = moment().diff(trainTime,"minutes");
	var tRemainder = differenceTimes % tFrequency;
	tMinutes = tFrequency - tRemainder;
	tArrival = moment().add(tMinutes, "m").format("hh:mm A");
}
	console.log("tMinutes:",tMinutes);
	console.log("tArrival:",tArrival);

//ADD each train's data into the table

$(".train-schedule > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
          tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
});
