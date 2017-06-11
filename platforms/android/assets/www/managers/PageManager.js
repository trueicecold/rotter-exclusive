var PageManager = {};
var PagesScripts = {};

PageManager.cachedPages = [];
PageManager.TMPPageParams;
PageManager.PageParams;

PageManager.init = function () {
	$(window).bind('hashchange', PageManager.parseHash);

	$(document).bind("orientationchange", function(e){
		PageManager.resizeAllComponents();
	});

	$(window).bind("resize", function(e){
		PageManager.resizeAllComponents();
	});	
}

PageManager.pageInited = false;
PageManager.hashParams = {};
PageManager.parseHash = function() {
	PageManager.removeHeaderOptions();
	PageManager.hidePopup();
	PageManager.hashParams = {};
	if (document.location.hash.substring(0,1) == "#")
		hashURL = document.location.hash.substring(1);
	else
		hashURL = "";
	if (hashURL.indexOf(",") > -1) {
		hashCommand = hashURL.substring(0, hashURL.indexOf(","));
		hashParamsString = hashURL.substring(hashURL.indexOf(",")+1);
		hashParamsString = hashParamsString.split("&");
		for (var i=0;i<hashParamsString.length;i++) {
			if (hashParamsString[i].indexOf("=") > -1) {
				PageManager.hashParams[hashParamsString[i].split("=")[0]] = hashParamsString[i].split("=")[1];
			}
		}
	}
	else {
		hashCommand = hashURL;
	}
	switch (hashCommand) {
		case "forums":
			PageManager.changePage("forums");
			break;
		case "forum_posts":
			PageManager.changePage("forum_posts");
			break;
		case "post":
			PageManager.changePage("post");
			break;
		case "new_post":
			PageManager.changePage("new_post");
			break;
		case "edit_post":
			PageManager.changePage("edit_post");
			break;
		case "comment_post":
			PageManager.changePage("comment_post");
			break;
		case "bookmarks":
			PageManager.changePage("bookmarks");
			break;
		case "settings":
			PageManager.changePage("settings");
			break;
		case "login":
			PageManager.changePage("login");
			break;
		case "inbox":
			PageManager.changePage("inbox");
			break;
		case "splash":
			PageManager.changePage("splash");
			break;
		case "about":
			PageManager.changePage("about");
			break;
		default:
			PagesScripts.login.checkLogin();
			break;
	}
	PageManager.pageInited = true;
}

PageManager.goBack = function() {
	if (PageManager.isPopupShown)
		PageManager.hidePopup();
	else {
		if (Utils.isAndroid()) {
			if (history.length == 2) {
				navigator.app.exitApp();
				return;
			}
		}
		history.go(-1);
	}
}

PageManager.pageParams = "";
PageManager.changeLocation = function (pageName, pageParams, replace) {
	PageManager.pageParams = "";
	if (pageParams != null && typeof(pageParams) == "object") {
		PageManager.pageParams += ",";
		for (var key in pageParams) {
			PageManager.pageParams += key + "=" + pageParams[key] + "&";
		}
	}
	if (!replace)
		location.href = "index.html#" + pageName + PageManager.pageParams;
	else
		location.replace("index.html#" + pageName + PageManager.pageParams);
}

PageManager.changePage = function (pageName, params) {
	$("#ajax_content").html(TemplateManager.GetTemplate(pageName));
	if (PagesScripts[pageName] != null && PagesScripts[pageName]["initHandlers"] != null)
		PagesScripts[pageName].initHandlers();
	$("input, textarea").focus(function() {
		$("#footer").hide();
	});
	$("input, textarea").blur(function() {
		$("#footer").show();
	});
	PageManager.resizeAllComponents();
}

PageManager.setHeader = function(title) {
	$("#header_title").html(title);
}

PageManager.getHeader = function() {
	return $("#header_title").html();
}

PageManager.footerClick = function(evt, obj, page) {
	evt.preventDefault();
	evt.stopPropagation();
	$("#footer td").removeClass("selected");
	$(obj).addClass("selected");
	PageManager.changeLocation(page);
}

PageManager.setSelectedFooter = function(option) {
	$("#footer td").removeClass("selected");
	$("#footer_" + option).addClass("selected");
}


PageManager.isPopupShown = false;
PageManager.showPopup = function(html) {
	PageManager.isPopupShown = true;
	$("#modal_window").html(html);
	$("#modal_overlay").css("display", "block");
	$("#modal_overlay").css("height", $(window).height());
	/*$("body").css("overflow", "hidden");*/
	$("#modal_overlay").css("top", "0px");
	$("#modal_overlay").css("height", $(window).height());
	$("#modal_window").css("top", (($(window).height() - $("#modal_window").height()) /2) + "px");
	document.ontouchmove = function(e){ 
	    e.preventDefault(); 
	}
}

PageManager.hidePopup = function() {
	PageManager.isPopupShown = false;
	$("#modal_overlay").css("display", "none");
	$("#modal_window").html("");
	$("body").css("overflow", "auto");
	document.ontouchmove = null;
}

PageManager.showLoader = function(caption) {
    if (caption != null && caption != "")
        $("#loading_caption").html(caption);
    else
        $("#loading_caption").html("טוען...");
	$("#loading_overlay").show();
}

PageManager.hideLoader = function() {
	$("#loading_overlay").hide();
}


PageManager.addHeaderOptions = function(obj) {
	PageManager.removeHeaderOptions();
	$(obj).find("div[type=menu_button]").each(function() {
		$("#header_right_container").append($(this));
	});
}

PageManager.removeHeaderOptions = function() {
	$("#header_right_container").html("");
}

PageManager.resizeContent = function() {
	$("#header_title").css("left","0px");
	$("#header_title").css("right","0px");
	$("#header_title").css("width", $(window).width()-150);
	$("#modal_overlay").css("height", $(window).height());
	$("#modal_window").css("top", (($(window).height() - $("#modal_window").height()) /2) + "px");
}

PageManager.resizeAllComponents = function() {
	PageManager.resizeContent();
	PagesScripts.post.resizeContent();
	PagesScripts.forums.resizeContent();
	PagesScripts.forum_posts.resizeContent();
	PagesScripts.bookmarks.resizeContent();
	PagesScripts.inbox.resizeContent();
}