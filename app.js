var config = {
	domain : "http://localhost/firebasejs/public",
	// domain : "https://fir-js-999a0.firebaseapp.com",
    apiKey: "AIzaSyCXU9zOyhTeJUqiVo6-VmxGFAw4suC56AI",
    authDomain: "fir-js-999a0.firebaseapp.com",
    databaseURL: "https://fir-js-999a0.firebaseio.com",
    storageBucket: "fir-js-999a0.appspot.com",
	OnErrorPage: function(){
		window.location = "404.html";
	},
	routes:{
		index:{
			needData:null
		},
		page:{
			needData:[
				"pages/%id%"
			]
		},
		user:{
			needData:[
				"users/%id%"
			]
		},
		category:{
			needData:[
				"categories/%id%"
			]
		},
		post:{
			needData:[
				"posts/%id%"
			]
		}
	}
};
var $FirebaseJS = new FirebaseJS(config);

var testTime = new Date(Date.now());
var x = document.location;
angular.module("firebasejs", []).controller("bodyController", bodyController).controller("headController", headController);
function bodyController($scope, $injector) {
	$scope.obj = {};
}
function headController($scope, $injector) {
	$scope.obj = {};
}
$FirebaseJS.Run();