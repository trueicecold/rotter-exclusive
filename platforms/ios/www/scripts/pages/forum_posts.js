PagesScripts.forum_posts = {};

PagesScripts.forum_posts.initHandlers = function() {
	if (PageManager.hashParams["forum"] == null || Utils.trim(PageManager.hashParams["forum"]) == "") {
		PageManager.changeLocation("forums", null);
		return;
	}
	
	if (PageManager.hashParams["page"] != null && !isNaN(PageManager.hashParams["page"]))
		PagesScripts.forum_posts.page = parseInt(PageManager.hashParams["page"]);
	else
		PagesScripts.forum_posts.page = 1;

	PageManager.setSelectedFooter("forums");
	PagesScripts.forum_posts.headerOptionsSet = false;
	PagesScripts.forum_posts.loadForumPosts();
	AdManager.track("Forum-Posts");
}

PagesScripts.forum_posts.refresh = function() {
	if (PagesScripts.forum_posts.page != 1) {
		PagesScripts.forum_posts.page = 1;
		PageManager.changeLocation("forum_posts", {forum:PageManager.hashParams["forum"], page:PagesScripts.forum_posts.page});
	}
	else {
		PagesScripts.forum_posts.lastURL = "";
		PagesScripts.forum_posts.loadForumPosts();
	}
}

PagesScripts.forum_posts.incPage = function(value) {
	PagesScripts.forum_posts.page = PagesScripts.forum_posts.page + value;
	PageManager.changeLocation("forum_posts", {forum:PageManager.hashParams["forum"], page:PagesScripts.forum_posts.page});
}

PagesScripts.forum_posts.setLastScroll = function() {
	PagesScripts.forum_posts.lastScroll = $("body").scrollTop();	
}

PagesScripts.forum_posts.setCurrentPost = function(forum_id, post_id) {
	PageManager.changeLocation("post", {forum:forum_id, post:post_id});
}

PagesScripts.forum_posts.lastURL = "";
PagesScripts.forum_posts.lastScroll = 0;
PagesScripts.forum_posts.loadForumPosts = function(page) {
	if (PagesScripts.forum_posts.lastURL != location.href) {
		PageManager.showLoader();
		HTTPManager.GetForumPosts(PageManager.hashParams["forum"], PagesScripts.forum_posts.page);
	}
	else {
		PageManager.setHeader(PagesScripts.forum_posts.forum_title);
		PagesScripts.forum_posts.populatePostsList(Config.GetPostsList(), true);
	}
	PagesScripts.forum_posts.lastURL = location.href;
}

PagesScripts.forum_posts.forum_title = "";
PagesScripts.forum_posts.onForumPosts = function(event) {
	PageManager.hideLoader();
	$("#posts_list").html("");
	if (event.data && event.data.success != null && event.data.success === true && event.data.posts && event.data.posts.length > 0) {
		PagesScripts.forum_posts.forum_title = event.data.name;
		PageManager.setHeader(event.data.name);
		PagesScripts.forum_posts.populatePostsList(event.data);
		Config.SetPostsList(event.data);
	}
}

PagesScripts.forum_posts.headerOptionsSet = false;
PagesScripts.forum_posts.populatePostsList = function(source, fromCache) {
	for (var i=0;i<source.posts.length;i++) {
		$("#posts_list").append(Utils.replaceVar(TemplateManager.GetTemplate("forum_post_item"), 
			{
				"FORUM_NAME":PagesScripts.forum_posts.forum_title, 
				"FORUM_ID":PageManager.hashParams["forum"], 
				"LINK_TYPE":source.posts[i].type, 
				"POST_ID":source.posts[i].id, 
				"POST_TITLE_CLASS":(source.posts[i].anchor) ? ((source.posts[i].locked) ? "post_anchor_locked" : "post_anchor") : ((source.posts[i].transferred) ? "post_regular transferred" : ((source.posts[i].emphasized) ? "post_regular emphasized" : "post_regular")),
				"POST_TITLE":source.posts[i].title, 
				"POST_TITLE_ESCAPE":source.posts[i].title.replace(/\"/ig, '\\\"').replace(/\'/ig, "\\\'"), 
				"POST_ICON":source.posts[i].icon, 
				"POST_OPENER":source.posts[i].opener, 
				"POST_LAST_TIME":source.posts[i].last_post.time, 
				"POST_LAST_DATE":source.posts[i].last_post.date, 
				"POST_LAST_POSTER":source.posts[i].last_post.poster, 
				"POST_COMMENT_COUNT":source.posts[i].comment_count.trim()
			}
		));
	}
	$("#forumPageNum").html(PagesScripts.forum_posts.page + " מתוך " + source.numPages);
	$("#forumPagingContainer").show();
	$("#forumPagePrev").css("display", (PagesScripts.forum_posts.page == 1) ? "none" : "block");
	$("#forumPageNext").css("display", (PagesScripts.forum_posts.page == source.numPages) ? "none" : "block");
	PagesScripts.forum_posts.resizeContent();
	
	var bookmarksArray = Config.getParam("bookmarks", "json");
	bookmarksArray = eval(bookmarksArray);
	if (bookmarksArray != null) {
		for (var i=0;i<bookmarksArray.length;i++) {
			$("#posts_list div.bookmark_icon").each(function() {
				if ($(this).attr("forum") == bookmarksArray[i].forum_id && $(this).attr("post") == bookmarksArray[i].post_id) {
					$(this).addClass("bookmark_icon_on");
				}
			});
		}
	}
	
	if (!PagesScripts.forum_posts.headerOptionsSet) {
		PageManager.addHeaderOptions($("#right_menu_buttons"));
		PagesScripts.forum_posts.headerOptionsSet = true;
	}
	
	if (fromCache != null && fromCache === true)
		$("body").scrollTop(PagesScripts.forum_posts.lastScroll);
	else
		$("body").scrollTop(0);		
}

PagesScripts.forum_posts.resizeContent = function() {
	$("#posts_list h3").css("width", $(window).width()-70);
	$("#posts_list h3").each(function() {
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
	$("#posts_list p").css("width", $(window).width()-70);
}

HTTPEvents.addEventListener("onForumPosts", PagesScripts.forum_posts.onForumPosts);