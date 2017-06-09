PagesScripts.post = {};
PagesScripts.post.isLocked = {};
PagesScripts.post.currentlyReplyingTo = {};

PagesScripts.post.initHandlers = function() {
	PagesScripts.post.loadPostParams = false;
	
	if (PageManager.hashParams["forum"] == null || Utils.trim(PageManager.hashParams["forum"]) == "") {
		PageManager.changeLocation("forums", null);
		return;
	}
	if (PageManager.hashParams["post"] == null || Utils.trim(PageManager.hashParams["post"]) == "") {
		PageManager.changeLocation("forum_posts", {forum:PageManager.hashParams["forum"]});
		return;
	}	
	PageManager.setSelectedFooter("forums");
	PagesScripts.post.loadPost();
	
	PagesScripts.post.headerOptionsSet = false;
}

PagesScripts.post.loadPostParams = {};
PagesScripts.post.headerOptionsSet = false;
PagesScripts.post.loadPost = function(loadPostParams) {
	if (loadPostParams != null && typeof(loadPostParams) == "object")
		PagesScripts.post.loadPostParams = loadPostParams;
	PageManager.showLoader();
	PagesScripts.post.lastComment = 0;
	$("#postContent").html("");
	HTTPManager.GetPost(PageManager.hashParams["forum"], PageManager.hashParams["post"], PageManager.hashParams["type"]);
}

PagesScripts.post.commentFirstPost = function() {
	PagesScripts.comment_post.checkNewComment("0", PagesScripts.post.firstCommentTitle);
}

PagesScripts.post.showLastPost = function() {
	$("body").animate({
		scrollTop:parseInt($("#comment_" + PagesScripts.post.lastComment).offset().top)-48
	});
}

PagesScripts.post.lastComment = 0;
PagesScripts.post.isRotterLink = false;
PagesScripts.post.rotterLink = "";
PagesScripts.post.onPostLoaded = function(event) {
	PageManager.hideLoader();
	if (event.data && event.data.success != null && event.data.success === true && event.data.post && event.data.post.length > 0) {
		PageManager.setHeader(event.data.post[0].title);
		PagesScripts.post.firstCommentTitle = escape(event.data.post[0].title);
		for (var i=0;i<event.data.post.length;i++) {
			if (parseInt(event.data.post[i].number) > PagesScripts.post.lastComment)
				PagesScripts.post.lastComment = parseInt(event.data.post[i].number);
			
			event.data.post[i].content = event.data.post[i].content.replace(/\<iframe/ig, "<iframe2");
			event.data.post[i].content = event.data.post[i].content.replace(/\<\/iframe/ig, "</iframe2");
			$("#postContent").append(Utils.replaceVar(TemplateManager.GetTemplate("post_item"), 
				{
					"POST_COMMENT_NUMBER":event.data.post[i].number, 
					"POST_COMMENT_LEVEL":event.data.post[i].level*15, 
					"POST_COMMENT_DATE":event.data.post[i].date,
					"POST_COMMENT_TIME":event.data.post[i].time, 
					"POST_COMMENT_WRITER":event.data.post[i].writer, 
					"POST_COMMENT_WRITER_ICON":event.data.post[i].writericon, 
					"POST_COMMENT_TITLE":event.data.post[i].title, 
					"POST_COMMENT_TITLE_ESCAPE":escape(event.data.post[i].title), 
					"POST_COMMENT_IS_REPLY":(event.data.post[i].inreplyto != "") ? "block" : "none",
					"POST_COMMENT_REPLY_TO":event.data.post[i].inreplyto,
					"POST_COMMENT_CONTENT":event.data.post[i].content,
					"POST_COMMENT_IS_LOCKED":(event.data.postLocked) ? "none" : "block",
					"POST_COMMENT_IS_ME_JUMP":(event.data.post[i].inreplyto == "" && Config.getParam("username") != null && Config.getParam("username") != "" && Config.getParam("username").toLowerCase() == event.data.post[i].writer.toLowerCase()) ? "inline" : "none",
					"POST_COMMENT_IS_ME_EDIT":(Config.getParam("username") != null && Config.getParam("username") != "" && Config.getParam("username").toLowerCase() == event.data.post[i].writer.toLowerCase()) ? "inline" : "none"
				}
			));
		}
		
		$("#postContent .comment_content a").each(function() {
			PagesScripts.post.isRotterLink = false;
			if ($(this).attr("href") != null && $(this).attr("href").indexOf("rotter.name") > -1) {
				if ($(this).attr("href").indexOf("az=list&forum=") > 1) {
					PagesScripts.post.rotterLink = {};
					
					PagesScripts.post.rotterLink.forum_id = $(this).attr("href").substr($(this).attr("href").indexOf("az=list&forum=")+14);
					if (PagesScripts.post.rotterLink.forum_id.indexOf("&") > -1)
						PagesScripts.post.rotterLink.forum_id = PagesScripts.post.rotterLink.forum_id.substr(0, PagesScripts.post.rotterLink.forum_id.indexOf("&"));
						
					$(this).removeAttr("href");
					$(this).attr("onclick", "PagesScripts.forums.setCurrentForum('" + PagesScripts.post.rotterLink.forum_id + "')");
					return;
				}
				else {
					if ($(this).attr("href").indexOf("&forum=") > 1 && $(this).attr("href").indexOf("dcboard.cgi?az=show_thread&om=") > 1 || ($(this).attr("href").indexOf("/nor/") > -1 && $(this).attr("href").indexOf(".shtml") > -1)) {
						PagesScripts.post.rotterLink = {};
						
						if ($(this).attr("href").indexOf("dcboard.cgi?az=show_thread&om=") > 1) {
							PagesScripts.post.rotterLink.forum_id = $(this).attr("href").substr($(this).attr("href").indexOf("&forum=")+7);
							if (PagesScripts.post.rotterLink.forum_id.indexOf("&") > -1)
								PagesScripts.post.rotterLink.forum_id = PagesScripts.post.rotterLink.forum_id.substr(0, PagesScripts.post.rotterLink.forum_id.indexOf("&"));

							PagesScripts.post.rotterLink.post_id = $(this).attr("href").substr($(this).attr("href").indexOf("dcboard.cgi?az=show_thread&om=")+30);
							if (PagesScripts.post.rotterLink.post_id.indexOf("&") > -1)
								PagesScripts.post.rotterLink.post_id = PagesScripts.post.rotterLink.post_id.substr(0, PagesScripts.post.rotterLink.post_id.indexOf("&"));
						}
						else if ($(this).attr("href").indexOf("/nor/") > -1 && $(this).attr("href").indexOf(".shtml") > -1) {
							PagesScripts.post.rotterLink.forum_id = $(this).attr("href").substr($(this).attr("href").indexOf("/nor/") + 5);
							PagesScripts.post.rotterLink.forum_id = PagesScripts.post.rotterLink.forum_id.substr(0, PagesScripts.post.rotterLink.forum_id.indexOf("/"));

							PagesScripts.post.rotterLink.post_id = $(this).attr("href").substr($(this).attr("href").indexOf("/nor/" + PagesScripts.post.rotterLink.forum_id + "/") + 6 + PagesScripts.post.rotterLink.forum_id.length);
							PagesScripts.post.rotterLink.post_id = PagesScripts.post.rotterLink.post_id.substr(0, PagesScripts.post.rotterLink.post_id.indexOf("."));
							
						}
						else {
							PagesScripts.post.setNewWindowLink($(this));
							return;
						}
						
						$(this).removeAttr("href");
						$(this).attr("onclick", "PagesScripts.forum_posts.setCurrentPost('" + PagesScripts.post.rotterLink.forum_id + "', '" + PagesScripts.post.rotterLink.post_id + "')");
						return;
					}
					else {
						PagesScripts.post.setNewWindowLink($(this));
						return;
					}
				}
			}
			else {
				PagesScripts.post.setNewWindowLink($(this));
				return;
			}
		});		
		
		$("#postContent .comment_content img").each(function() {
			Utils.doubleTap($(this), 300, "Utils.openNewBrowser('" + $(this).attr("src") + "');");
		});
		
		if (!PagesScripts.post.headerOptionsSet) {
			PageManager.addHeaderOptions($("#right_menu_buttons"));
			PagesScripts.post.headerOptionsSet = true;
		}
	}
	else {
		PageManager.showPopup(TemplateManager.GetTemplate("not_connected_view"));
	}

	$("#postContent").css("fontSize", (parseInt(Config.getParam("postFontSize"))-1) + "px");
	$("#postContent .post_details").css("fontSize", (parseInt(Config.getParam("postFontSize"))-3) + "px");
	$("#postContent .comment_title").css("fontSize", (parseInt(Config.getParam("postFontSize"))+3) + "px");
	$("#postContent .in_reply_to").css("fontSize", (parseInt(Config.getParam("postFontSize"))+2) + "px");
	
	PagesScripts.post.resizeContent();
	PagesScripts.post.removeObjects();
	if (PagesScripts.post.loadPostParams.fromNewComment)
		PagesScripts.post.showLastPost();
	if (PagesScripts.post.loadPostParams.fromEdit) {
		PagesScripts.post.lastComment = PagesScripts.post.loadPostParams.editCommentId;
		PagesScripts.post.showLastPost();
	}
}

PagesScripts.post.setNewWindowLink = function(obj) {
	obj.attr("href_to", obj.attr("href"));
	obj.removeAttr("href");
	obj.attr("onclick", "Utils.openNewBrowser($(this).attr('href_to')); ");
}

PagesScripts.post.getCommentLevel = function(level) {
    return level*15;
}

PagesScripts.post.setJumpPost = function() {
	HTTPManager.LoadPreJumpPage(PageManager.hashParams["forum"], PageManager.hashParams["post"]);
}

PagesScripts.post.setCommentState = function(input, button) {
	if (Utils.trim(input.val()) == "") {
		button.addClass("ui-disabled");
	}
	else {
		button.removeClass("ui-disabled")
	}
}

PagesScripts.post.onPreJumpPageLoaded = function(event) {
	if (event.data && event.data.success != null && event.data.success === true) {
		PagesScripts.post.jumpPost();
	}
	else {
		PageManager.showPopup(TemplateManager.GetTemplate("not_connected_jump"));
	}
}

PagesScripts.post.onPreCommentPageLoaded = function(event) {
	if (event.data && event.data.success != null && event.data.success === true) {
		$("#postEditTitle").val("");
		$("#postEditBody").val("");
		$('#postComment').popup('open', {transition:"pop", positionTo:"window"});
	}
	else {
		PageManager.showPopup(TemplateManager.GetTemplate("not_connected_comment"));
	}
}

PagesScripts.post.onPostNewIconChanged = function(value, inst) {
	Config.CurrentSelectedIcon = Config.PostIcons[value].type;
}

PagesScripts.post.jumpPost = function() {
	PageManager.showLoader();
    // Before Jump a Post, we need to get some details: subject, body, topictype (lame forum system)
    // to get this information, we need to take it from edit page.
	HTTPManager.SendJumpPost(PageManager.hashParams["forum"], PageManager.hashParams["post"], Config.CurrentSelectedIcon, Config.Subject, Config.Body);
	AdManager.track("Post-Jump");
}

PagesScripts.post.onJumpSent = function() {
	PageManager.hideLoader();
    PageManager.changeLocation("forum_posts", {forum:PageManager.hashParams["forum"]});
}

PagesScripts.post.onImageUploaded = function(event) {
	if (event.data.success != null && event.data.success == true) {
		$("#postEditBody").val($("#postEditBody").val() + event.data.url);
		$("#post_body").val($("#post_body").val() + event.data.url);
		$("#comment_body").val($("#comment_body").val() + event.data.url);
		AdManager.track("Image-Upload-End");
	}
}

PagesScripts.post.toggleSpoiler = function(spoilerId) {
	if (document.getElementById("rand_spoiler_" + spoilerId).style.display == "none") {
		document.getElementById("rand_spoiler_" + spoilerId).style.display = "block";
		document.getElementById("spoiler_button_" + spoilerId).value = "הסתר ספוילר";
	}
	else {
		document.getElementById("rand_spoiler_" + spoilerId).style.display = "none";
		document.getElementById("spoiler_button_" + spoilerId).value = "הצג ספוילר";
	}
}

PagesScripts.post.resizeContent = function() {
	$("#postContent img").each(function() {
		$(this).css("max-width", $(this).parents(".comment_item").width());
	});

	$("#postContent blockquote").each(function() {
		var blockHTML = $(this).html();
		$(this).replaceWith(blockHTML);
	});
	
	$("#postContent a img").each(function() {
		$(this).css("max-width", $(this).parents(".comment_item").width());
	});	
}

PagesScripts.post.removeObjects = function() {
	$("#postContent object").remove();
	$("#postContent iframe").remove();
	$(".adsbygoogle").remove()
	$("script[src *= 'googlesyndication']").remove();
}

HTTPEvents.addEventListener("onPostLoaded", PagesScripts.post.onPostLoaded);
HTTPEvents.addEventListener("onPreJumpPageLoaded", PagesScripts.post.onPreJumpPageLoaded);
HTTPEvents.addEventListener("onJumpSent", PagesScripts.post.onJumpSent);
UploadEvents.addEventListener("onImageUploaded", PagesScripts.post.onImageUploaded);