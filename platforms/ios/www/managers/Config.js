var Config = {};
var Properties = {};

Config.DEBUG = false;

Config.setParam = function (name, value, format) {
	if (!format) format = "text";
	switch (format) {
	case "json":
		window.localStorage.setItem(name, Utils.stringify(value));
		break;
	default:
		window.localStorage.setItem(name, value);
	}	
};

Config.getParam = function (name, format) {
	if (!format) format = "text";
	switch (format) {
	case "json":
		return eval(window.localStorage.getItem(name));
	default:
		return window.localStorage.getItem(name);
	}
}

Config.setTempParam = function (name, value, format) {
	if (!format) format = "text";
	switch (format) {
	case "json":
		Properties[name] = Utils.stringify(value);
		break;
	default:
		Properties[name] = value;
	}	
};

Config.getTempParam = function (name, format) {
	if (!format) format = "text";
	switch (format) {
	case "json":
		return eval(Properties[name]);
	default:
		return Properties[name];
	}
}

Config.removeParam = function (name) {
	window.localStorage.removeItem(name);
}

Config.createCookie = function (name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	} else var expires = "";
	document.cookie = name + "=" + escape(value) + expires + "; path=/";
}
Config.readCookie = function (name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length, c.length));
	}
	return null;
};

Config.eraseCookie = function (name) {
	Config.createCookie(name, "", - 1);
}

Config.GetCurrentForum = function() {
	return Config.CurrentForum;
}

Config.SetCurrentPost = function(evt) {
	Config.CurrentPost = $.tmplItem(evt.target).data;
}

Config.GetCurrentPost = function() {
	return Config.CurrentPost;
}

Config.SetForumsList = function(list) {
	Config.ForumsList = list;
}

Config.GetForumsList = function() {
	return Config.ForumsList;
}

Config.SetPostsList = function(list) {
	Config.PostsList = list;
}

Config.GetPostsList = function() {
	return Config.PostsList;
}

Config.SetPostsFromCache =  function(value) {
	Config.PostsFromCache = value;
}

Config.GetPostsFromCache =  function() {
	return Config.PostsFromCache;
}