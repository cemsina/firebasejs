function FirebaseJS(cfg){
	/* Properties */
	this.activeRoute = null;
	this.domain = new URL(cfg.domain);
	this.GetParams = {};
	this.GetParams.obj = [];
	this.config = cfg;
	this.activeThemePath = null;
	this.app = firebase.initializeApp(this.config);
	this.ref = new Firebase(this.config.databaseURL);
	this.root = this.app.database().ref();
	this.HeadObject = {};
	this.BodyObject = {};
	var _FirebaseJS = this;
	this.ErrorPage = function(){
		// _FirebaseJS.config.OnErrorPage();
	}
	document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
		function decode(d) {
			return decodeURIComponent(d.split("+").join(" "));
		}
		_FirebaseJS.GetParams[decode(arguments[1])] = decode(arguments[2]);
	});
	this.get = function(path,callback){
		_FirebaseJS.root.child(path).on("value", function(snapshot) {
			callback(snapshot.val());
		}, function (errorObject) {
			callback(null);
		});
	}
	this.set = function(path,value){
		_FirebaseJS.root.child(path).set(value);
	}
	this.Run = function(){
		_FirebaseJS.FindRoute();
	}
	this.FindRoute = function(){
		var pathName = window.location.pathname.replace(_FirebaseJS.domain.pathname,"");
		if(pathName == "/" || pathName == ""){_FirebaseJS.activeRoute = "index";}else{
			var match = window.location.pathname.match(/\/(\w+).html/);
			if(match == null){_FirebaseJS.ErrorPage();}else{
				_FirebaseJS.activeRoute = match[1];
			}
		}
		_FirebaseJS.CheckNeed();
	}
	this.CheckNeed = function(){
		var need = _FirebaseJS.config.routes[_FirebaseJS.activeRoute].needData;
		if(need != null && need.length !== 0){
			var needStr = need[0].replace("%id%",_FirebaseJS.GetParams["id"]);
			_FirebaseJS.get(needStr,function(cb){
				if(cb == null){_FirebaseJS.ErrorPage();}else{
					_FirebaseJS.GetParams.obj.push(cb);
					_FirebaseJS.config.routes[_FirebaseJS.activeRoute].needData.splice(0,1);
					_FirebaseJS.CheckNeed();
				}
			});
		}else{
			_FirebaseJS.LoadRoute();
		}
	}
	this.LoadRoute = function(){
		var routeHref = (_FirebaseJS.domain.href + "/routes/"+_FirebaseJS.activeRoute+".js").replace("//","/").replace(_FirebaseJS.domain.protocol+"/",_FirebaseJS.domain.protocol+"//");
		$.getScript(routeHref).fail(function( jqxhr, settings, exception ) {
			_FirebaseJS.ErrorPage();
		});
	}
	this.Compile_HEAD = function(){
		var scope = angular.element(document.head).scope();
		scope.$apply(function(){
			scope.obj = _FirebaseJS.HeadObject;
		});
	}
	this.Compile_BODY = function(){
		var scope = angular.element(document.body).scope();
		scope.$apply(function(){
			scope.obj = _FirebaseJS.BodyObject;
		});
	}
	this.Compile = function(){
		_FirebaseJS.Compile_HEAD();
		_FirebaseJS.Compile_BODY();
		_FirebaseJS.PageLoaded();
	}
	
	this.PageLoaded = function(){
		var finished = new Date(Date.now());
		alert("Page Loaded : " + (finished - testTime)/1000 + "sec");
	}
}