PagesScripts.login = {};

PagesScripts.login.checkLogin = function() {
	HTTPManager.CheckLogin();
}

PagesScripts.login.initHandlers = function() {
	PageManager.setHeader("התחברות");
	AdManager.track("Login");
}

PagesScripts.login.onCheckLogin = function(event) {
	if (event.data != null && event.data.success && event.data.success === true) {
		console.log("LOGGED IN!");
		Config.setParam("username", event.data.username);
		PageManager.changeLocation("forums");
		PushManager.registerUsername(event.data.username);
	}
	else {
		console.log("NOT LOGGED IN!");
		PushManager.deleteTags();
		Config.removeParam("username");
		PageManager.changeLocation("login");
	}
}

PagesScripts.login.login = function() {
	PagesScripts.login.disableAllElements();
	HTTPManager.Login($("#login_username").val(), $("#login_password").val());
}

PagesScripts.login.onLogin = function(event) {
	if (event.data != null && event.data.success != null && event.data.success === true) {
		PushManager.registerUsername($("#login_username").val());
		Config.setParam("username", $("#login_username").val());
		PageManager.changeLocation("settings");
	}
	else {
		PagesScripts.login.enableAllElements();
		$("#loginError").show();
	}
}

PagesScripts.login.logout = function() {
	Config.removeParam("username");
	HTTPManager.Logout();
}

PagesScripts.login.disableAllElements = function() {
	$("#loginButton").addClass("ui-disabled");
	$("#loginError").hide();
	$("#loginProgress").show();
	$("#login_username").prop("disabled", "disabled");
	$("#login_password").prop("disabled", "disabled");
}

PagesScripts.login.enableAllElements = function() {
	$("#loginButton").removeClass("ui-disabled");
	$("#loginError").hide();
	$("#loginProgress").hide();
	$("#login_username").prop("disabled", null);
	$("#login_password").prop("disabled", null);
}

PagesScripts.login.hideAllElements = function() {
	$(".loginBlock").hide();
	$(".logoutBlock").show();
}

PagesScripts.login.showAllElements = function() {
	$(".loginBlock").show();
	$(".logoutBlock").hide();
	$("#loginError").hide();
	$("#loginProgress").hide();
}

HTTPEvents.addEventListener("onCheckLogin", PagesScripts.login.onCheckLogin);
HTTPEvents.addEventListener("onLogin", PagesScripts.login.onLogin);