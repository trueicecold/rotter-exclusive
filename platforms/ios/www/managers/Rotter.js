var Rotter = {};

Rotter.init = function() {
	HTTPManager.init();
	PageManager.init();

	if (Config.getParam("showImages") == null) {
		Config.setParam("showImages", 0);
	}

	if (Config.getParam("showImages") == null) {
		Config.setParam("showImages", 0);
	}
	
	if (Config.getParam("postFontSize") == null) {
		Config.setParam("postFontSize", 16);
	}

	if (Config.getParam("checkPrivateMessages") == null) {
		Config.setParam("checkPrivateMessages", 0);
	}
	else {
		PagesScripts.inbox.setInterval(Config.getParam("checkPrivateMessages"), Config.getParam("checkPrivateMessagesInterval"));
	}
	
	TemplateEvents.addEventListener("templateLoadComplete", Rotter.onTemplateLoadComplete);
	TemplateManager.initTemplates();
}

Rotter.onTemplateLoadComplete = function() {
	PageManager.parseHash();
	PagesScripts.inbox.checkNewMessages();
}