PagesScripts.bookmarks = {};
PagesScripts.bookmarks.postItems = {};
PagesScripts.bookmarks.forumItems = {};
PagesScripts.bookmarks.bookmarkForDeletion = {};

PagesScripts.bookmarks.initHandlers = function() {
	PageManager.setHeader("מועדפים");
	PageManager.setSelectedFooter("bookmarks");
	PagesScripts.bookmarks.loadBookmarks();
	AdManager.track("Bookmarks-View");
}

PagesScripts.bookmarks.loadBookmarks = function() {
	$("#bookmark_list").html("");
	$("#bookmark_forums_list").html("");
	PagesScripts.bookmarks.postItems = Config.getParam("bookmarks", "json");
	if (PagesScripts.bookmarks.postItems != null) {
		PagesScripts.bookmarks.postItems = eval(PagesScripts.bookmarks.postItems);
		for (var i=0;i<PagesScripts.bookmarks.postItems.length;i++) {
			$("#bookmark_list").append(Utils.replaceVar(TemplateManager.GetTemplate("bookmark_item"), {"POST_TITLE":PagesScripts.bookmarks.postItems[i].post_title, "POST_ID":PagesScripts.bookmarks.postItems[i].post_id, "FORUM_NAME":PagesScripts.bookmarks.postItems[i].forum_name, "FORUM_ID":PagesScripts.bookmarks.postItems[i].forum_id}));
		}
	}

	PagesScripts.bookmarks.forumItems = Config.getParam("forumBookmarks", "json");
	if (PagesScripts.bookmarks.forumItems != null) {
		PagesScripts.bookmarks.forumItems = eval(PagesScripts.bookmarks.forumItems);
		for (var i=0;i<PagesScripts.bookmarks.forumItems.length;i++) {
			$("#bookmark_forums_list").append(Utils.replaceVar(TemplateManager.GetTemplate("forum_bookmark_item"), {"FORUM_NAME":PagesScripts.bookmarks.forumItems[i].name, "FORUM_ID":PagesScripts.bookmarks.forumItems[i].id}));
		}
	}
	PagesScripts.bookmarks.resizeContent();
}

PagesScripts.bookmarks.savePostBoookmark = function(obj, forum_name, forum_id, post_title, post_id) {
	var bookmarksArray = Config.getParam("bookmarks", "json");
	if (bookmarksArray != null) {
		bookmarksArray = eval(bookmarksArray);
		var bookmarkFound = false;
		for (var i=0;i<bookmarksArray.length;i++) {
			if (bookmarksArray[i].forum_id == forum_id && bookmarksArray[i].post_id == post_id) {
				bookmarkFound = true;
				bookmarksArray.splice(i, 1);
				$(obj).removeClass("bookmark_icon_on");
				break;
			}
		}
	}
	else {
		bookmarksArray = new Array();
	}
	if (!bookmarkFound) {
		$(obj).addClass("bookmark_icon_on");
		bookmarksArray.push({forum_name:forum_name, forum_id:forum_id, post_title:post_title, post_id:post_id});
	}
	Config.setParam("bookmarks", bookmarksArray, "json");
	AdManager.track("Bookmarks-Post-Add");
}

PagesScripts.bookmarks.saveForumBoookmark = function(obj, forum_name, forum_id) {
	var bookmarksArray = Config.getParam("forumBookmarks", "json");
	var bookmarkFound = false;
	if (bookmarksArray != null) {
		bookmarksArray = eval(bookmarksArray);
		for (var i=bookmarksArray.length-1;i>-1;i--) {
			if (forum_id == bookmarksArray[i].id) {
				bookmarkFound = true;
				bookmarksArray.splice(i, 1);
				$(obj).removeClass("bookmark_icon_on");
				break;
			}
		}
	}
	else {
		bookmarksArray = new Array();
	}
	if (!bookmarkFound) {
		$(obj).addClass("bookmark_icon_on");
		bookmarksArray.push({name:forum_name, id:forum_id});
	}
	Config.setParam("forumBookmarks", bookmarksArray, "json");
	AdManager.track("Bookmarks-Forum-Add");
}

PagesScripts.bookmarks.deleteForumBookmark = function(forum_id) {
	var bookmarksArray = Config.getParam("forumBookmarks", "json");
	var bookmarkFound = false;
	if (bookmarksArray != null) {
		bookmarksArray = eval(bookmarksArray);
		for (var i=bookmarksArray.length-1;i>-1;i--) {
			if (forum_id == bookmarksArray[i].id) {
				bookmarksArray.splice(i, 1);
				break;
			}
		}
	}
	Config.setParam("forumBookmarks", bookmarksArray, "json");
	PagesScripts.bookmarks.loadBookmarks();
	AdManager.track("Bookmarks-Forum-Delete");
}

PagesScripts.bookmarks.deleteBookmark = function(forum_id, post_id) {
	var bookmarksArray = Config.getParam("bookmarks", "json");
	var bookmarkFound = false;
	if (bookmarksArray != null) {
		bookmarksArray = eval(bookmarksArray);
		for (var i=bookmarksArray.length-1;i>-1;i--) {
			if (forum_id == bookmarksArray[i].forum_id && post_id == bookmarksArray[i].post_id) {
				bookmarksArray.splice(i, 1);
				break;
			}
		}
	}
	Config.setParam("bookmarks", bookmarksArray, "json");
	PagesScripts.bookmarks.loadBookmarks();
	AdManager.track("Bookmarks-Post-Delete");
}

PagesScripts.bookmarks.setForumBookmarkForDeletion = function(evt) {
	PagesScripts.bookmarks.forumBookmarkForDeletion = $.tmplItem(evt.target).data;
}

PagesScripts.bookmarks.resizeContent = function() {
	$("#bookmark_list li h3").css("width", $(window).width()-50);
	$("#bookmark_list li h3").each(function() {
		if ($(this).html().indexOf(" ") == -1) {
			$(this).css("wordBreak", "break-all");
			$(this).dotdotdot({
				wrap:"letter"
			});
		}
		else {
			$(this).dotdotdot();
		}
	});	
}