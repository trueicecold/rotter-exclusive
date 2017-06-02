PagesScripts.splash = {};

PagesScripts.splash.initHandlers = function() {
	PageManager.setSelectedFooter("main");
	PageManager.setHeader("תפריט ראשי");
	if (Utils.isAndroid()) {
		$("#exitAppContainer").show();
	}
}