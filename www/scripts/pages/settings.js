PagesScripts.settings = {};

PagesScripts.settings.initHandlers = function() {
	PagesScripts.settings.drawLogin();
	PagesScripts.settings.loadSettings();
	PageManager.setHeader("הגדרות");
	PageManager.setSelectedFooter("main");
	AdManager.track("Settings");
}

PagesScripts.settings.drawLogin = function() {
	if (Config.getParam("username") != null) {
		$("#loginBlock").hide();
		$("#logoutBlock").show();
		$("#loginUsername").html(Config.getParam("username"));
	}
	else {
		$("#loginBlock").show();
		$("#logoutBlock").hide();
	}
}

PagesScripts.settings.onLogout = function() {
	PagesScripts.settings.drawLogin();
}

PagesScripts.settings.setShowImages = function() {
	Config.setParam("showImages", $("#showImagesContainer").find("input[name='showImages']:checked").val());
}

PagesScripts.settings.setPrivateMessages = function() {
	Config.setParam("checkPrivateMessages", $("#checkPrivateMessagesContainer").find("input[name='checkPrivateMessages']:checked").val());
	Config.setParam("checkPrivateMessagesInterval", $("#privateMessageInterval").val());
	PagesScripts.inbox.setInterval($("#checkPrivateMessagesContainer").find("input[name='checkPrivateMessages']:checked").val(), $("#privateMessageInterval").val());
}

PagesScripts.settings.loadSettings = function() {
	$("#showImagesContainer").find("input[name='showImages']").attr("checked", false);
	if (Config.getParam("showImages") != null) {
		$("#showImagesContainer").find("input[name='showImages'][value='" + Config.getParam("showImages") + "']").attr("checked", true);
	}
	else {
		$("#showImagesContainer").find("input[name='showImages'].eq(0)").attr("checked", true);
	}

	if (Config.getParam("checkPrivateMessages") != null) {
		$("#checkPrivateMessagesContainer").find("input[name='checkPrivateMessages'][value='" + Config.getParam("checkPrivateMessages") + "']").attr("checked", true);
		if (Config.getParam("checkPrivateMessagesInterval") != null && !isNaN(parseInt(Config.getParam("checkPrivateMessagesInterval")))) {
			$("#privateMessageInterval").val(Config.getParam("checkPrivateMessagesInterval"));
		}
		else {
			$("#privateMessageInterval").val(0);
		}
	}
	else {
		$("#checkPrivateMessagesContainer").find("input[name='checkPrivateMessages'].eq(0)").attr("checked", true);
	}
	
	$("#postFontSize").val(Config.getParam("postFontSize"));
	PagesScripts.settings.setPostFontSize();
}

PagesScripts.settings.setPostFontSize = function(size) {
	Config.setParam("postFontSize", $("#postFontSize").val());
	$("#postFontSizeExample").css("fontSize", $("#postFontSize").val() + "px");
}

HTTPEvents.addEventListener("onLogout", PagesScripts.settings.onLogout);