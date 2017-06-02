PagesScripts.forums = {};
PagesScripts.forums.items = {};

PagesScripts.forums.initHandlers = function() {
	PageManager.setHeader("רשימת הפורומים");
	PagesScripts.forums.loadForums();
	PageManager.setSelectedFooter("forums");
	AdManager.track("Forums");
}

PagesScripts.forums.setCurrentForum = function(forum_id) {
	PagesScripts.forum_posts.lastURL = "";
	PageManager.changeLocation("forum_posts", {forum:forum_id});
}

PagesScripts.forums.loadForums = function() {
	PagesScripts.forums.items = Config.GetForumsList();
	if (PagesScripts.forums.items == null) {
		PageManager.showLoader();
		HTTPManager.GetForumList();
	}
	else {
		PagesScripts.forums.populateForums(PagesScripts.forums.items);
	}
}

PagesScripts.forums.onForumList = function(event) {
	PageManager.hideLoader();
	if (event.data && event.data.success != null && event.data.success === true && event.data.forums && event.data.forums.length > 0) {
		PagesScripts.forums.populateForums(event.data.forums);
		Config.SetForumsList(event.data.forums);
	}
}

PagesScripts.forums.populateForums = function(source) {
	for (var i=0;i<source.length;i++) {
		$("#forum_list").append(Utils.replaceVar(TemplateManager.GetTemplate("forum_item"), {"FORUM_LOGO":source[i].logo, "FORUM_TITLE":source[i].title, "FORUM_DESCRIPTION":source[i].description, "FORUM_ID":source[i].name}));
	}
	PagesScripts.forums.resizeContent();
	var bookmarksArray = Config.getParam("forumBookmarks", "json");
	bookmarksArray = eval(bookmarksArray);
	if (bookmarksArray != null) {
		for (var i=0;i<bookmarksArray.length;i++) {
			$("#forum_list div.bookmark_icon").each(function() {
				if ($(this).attr("forum") == bookmarksArray[i].id) {
					$(this).addClass("bookmark_icon_on");
				}
			});
		}
	}
}

PagesScripts.forums.resizeContent = function() {
	$("#forum_list li span").css("width", $(window).width()-80);
}


HTTPEvents.addEventListener("onForumList", PagesScripts.forums.onForumList);