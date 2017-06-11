PagesScripts.new_post = {};

PagesScripts.new_post.initHandlers = function() {
	PageManager.setHeader("אשכול חדש");
	$("#post_forum_name").html(unescape(PageManager.hashParams["forum_name"]));
	PagesScripts.new_post.populateIcons();
	AdManager.track("Post-New");
}

PagesScripts.new_post.setPostState = function() {
	if (Utils.trim($("#post_title").val()) == "") {
		$("#post_send_button").attr("disabled", "disabled");
	}
	else {
		$("#post_send_button").removeAttr("disabled");
	}
}

PagesScripts.new_post.checkNewPost = function() {
	PageManager.showLoader();
	HTTPManager.LoadPrePostPage(PageManager.hashParams["forum"]);
}

PagesScripts.new_post.onPrePostPageLoaded = function(event) {
	PageManager.hideLoader();
	if (event.data && event.data.success != null && event.data.success === true) {
		PagesScripts.new_post.selectedIcon = null;
		PageManager.showPopup(TemplateManager.GetTemplate("quick_new_post"));
		PagesScripts.new_post.populateIcons();
	}
	else {
		PageManager.showPopup(TemplateManager.GetTemplate("not_connected_post"));
	}
}

PagesScripts.new_post.populateIcons = function() {
	for (var i=0;i<Config.PostIcons.length;i++) {
		$("#icon_list #icon_container").append("<li icon_src='" + Config.PostIcons[i].icon + "' icon_type='" + Config.PostIcons[i].type + "' class='button icon_popup_item'><img class='icon_popup_image' src='" + Config.PostIcons[i].icon + "' /></li>");
	}
}

PagesScripts.new_post.showIconsList = function() {
	$("#icon_list").show();
	$("#icon_container li.icon_popup_item").each(function() {
		if (PagesScripts.new_post.selectedIcon != null && $(this).attr("icon_type") == PagesScripts.new_post.selectedIcon) {
			$(this).addClass("icon_popup_item_selected");
		}
		$(this).bind("click", function() {
			PagesScripts.new_post.setSelectedIcon($(this), $(this).attr("src"), $(this).attr("icon_type"));
		});
	});
}

PagesScripts.new_post.setSelectedIcon = function (obj, src, type) {
	$("li.icon_popup_item.icon_popup_item_selected").removeClass("icon_popup_item_selected");
	obj.addClass("icon_popup_item_selected");
	PagesScripts.new_post.saveIcon();
}

PagesScripts.new_post.selectedIcon = null;
PagesScripts.new_post.saveIcon = function() {
	$("#icon_list").hide();
	if ($("li.icon_popup_item.icon_popup_item_selected").length == 1) {
		$("#post_selected_icon").attr("src", $("li.icon_popup_item.icon_popup_item_selected").attr("icon_src"));
		PagesScripts.new_post.selectedIcon = $("li.icon_popup_item.icon_popup_item_selected").attr("icon_type");
		$("#post_selected_icon").show();
		$("#post_selected_icon_caption").html("שנה אייקון");
	}
}

PagesScripts.new_post.sendPost = function() {
	if (PagesScripts.new_post.selectedIcon != null) {
		if (Utils.trim($("#post_title").val()) == "") {
			$("#post_title").addClass("input_error");
			setTimeout(function() {$("#post_title").removeClass("input_error");}, 500);
		}
		else {
			PageManager.showLoader();
			HTTPManager.SendPost(PageManager.hashParams["forum"], PagesScripts.new_post.selectedIcon, $("#post_title").val(), $("#post_body").val());
			AdManager.track("Post-Send");
		}
	}
	else {
		$("#chooseIcon").addClass("button_error");
		setTimeout(function() {$("#chooseIcon").removeClass("button_error");}, 500);
	}
}

PagesScripts.new_post.onPostSent = function() {
	PageManager.hideLoader();
	PageManager.hidePopup();
	PagesScripts.forum_posts.refresh();
}

HTTPEvents.addEventListener("onPostSent", PagesScripts.new_post.onPostSent);
HTTPEvents.addEventListener("onPrePostPageLoaded", PagesScripts.new_post.onPrePostPageLoaded);