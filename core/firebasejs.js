const config = {
	domain : "http://localhost/firebasejs",
	// domain : "https://fir-js-999a0.firebaseapp.com",
    apiKey: "AIzaSyCSBpap-lzwTqTiJzisuXU9fSqi1W7PJE8",
    authDomain: "fir-js-ebb4f.firebaseapp.com",
    databaseURL: "https://fir-js-ebb4f.firebaseio.com",
    storageBucket: "fir-js-ebb4f.appspot.com"
};

function FirebaseJS(config){
	"use strict";
	let _FirebaseJS = this;
	function EventWrapper(/* eventnames,... */){
		let Events = {};
		for(let i=0;i<arguments.length;i++)
			Events[arguments[i]] = [];
		return {
			Call : ((eventname) => {
				for(let i=0;i<Events[eventname].length;i++)
					Events[eventname][i]();
			}),
			On : ((eventname,callback) => {
				Events[eventname].push(callback);
			}),
			Queue : ((eventname) => {
				return Events[eventname];
			})
		}
	}
	this.FirebaseObject = function(path) {
		"use strict";
		const EventHandler = EventWrapper("get","changed");
		this.Path = path;
		this.Value = null;
		this.On = (eventname,callback) => EventHandler.On(eventname,callback);
		this.Get = () => {
			_FirebaseJS.Connection.Ref.child(path).on("value", (snapshot) => {
				if(this.Value == null) {
					this.Value = snapshot.val();
					this.Call("get");
				}else{
					this.Value = snapshot.val();
					this.Call("changed");
				}
				
				
			});
		}
		this.Call = (eventname) => EventHandler.Call(eventname);
	}
	this.Connection = {
		App : null,
		Ref : null
	}
	this.Get = (path,callback) => {
		this.Connection.Ref.child(path).on("value", (snapshot) => {
			callback(snapshot.val());
		}, (errorObject) => {
			callback(null);
		});
	}
	this.Initialize = () => {
		this.Connection.App = firebase.initializeApp(config);
		this.Connection.Ref = this.Connection.App.database().ref();
	}
	this.Initialize();
}

var fb = new FirebaseJS(config);
var obj = new fb.FirebaseObject("configs/page_url");
obj.On("get", () => {
	console.log(+new Date() + " : (get) => " + obj.Value);
});
obj.On("changed", () => {
	console.log(+new Date() + " : (changed) => " + obj.Value);
});
obj.Get();
