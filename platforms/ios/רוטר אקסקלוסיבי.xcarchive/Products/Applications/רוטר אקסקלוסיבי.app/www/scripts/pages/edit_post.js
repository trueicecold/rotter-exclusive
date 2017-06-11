PagesScripts.edit_post = {};

PagesScripts.edit_post.initHandlers = function() {
	PageManager.setHeader("עריכת תגובה");
	for (var i=0;i<Config.PostIcons.length;i++) {
		$("#icon_list #icon_container").append("<li icon_src='" + Config.PostIcons[i].icon + "' icon_type='" + Config.PostIcons[i].type + "' class='button icon_popup_item'><img class='icon_popup_image' src='" + Config.PostIcons[i].icon + "' /></li>");
	}
	if (PageManager.hashParams["comment_id"] != 0) {
		$("#selectIconRow").remove();
	}
	PagesScripts.edit_post.selectedIcon = Config.CurrentSelectedIcon;
	PagesScripts.edit_post.showIconsList();
	PagesScripts.edit_post.saveIcon();
	
	$("#postEditTitle").val(Config.Subject);
	$("#postEditBody").val(Config.Body);
	PagesScripts.edit_post.setPostState();
}

PagesScripts.edit_post.setPostState = function() {
	if (Utils.trim($("#postEditTitle").val()) == "") {
		$("#post_send_button").attr("disabled", "disabled");
	}
	else {
		$("#post_send_button").removeAttr("disabled");
	}
}

PagesScripts.edit_post.setEditPost = function(postCommentNumber) {
	PageManager.showLoader();
	Config.setTempParam("EditedPostCommentNumber", postCommentNumber);
	HTTPManager.LoadPreEditPage(PageManager.hashParams["forum"], PageManager.hashParams["post"], postCommentNumber);
}

PagesScripts.edit_post.onPreEditPageLoaded = function(event) {
	PageManager.hideLoader();
	if (event.data && event.data.success != null && event.data.success === true) {
		PageManager.showPopup(TemplateManager.GetTemplate("quick_edit_post"));
		if (Config.getTempParam("EditedPostCommentNumber") != 0) {
			$("#selectIconRow").remove();
		}

		$("#postEditTitle").val(Config.Subject);
		$("#postEditBody").val(Config.Body);
		PagesScripts.edit_post.selectedIcon = Config.CurrentSelectedIcon;
 		PagesScripts.edit_post.populateIcons();
		PagesScripts.edit_post.showIconsList();
		PagesScripts.edit_post.saveIcon();
	}
	else {
		PageManager.showPopup(TemplateManager.GetTemplate("not_connected_edit"));
	}
}

PagesScripts.edit_post.onEditPostSent = function(evt) {
	PageManager.hideLoader();
	PageManager.hidePopup();
    PagesScripts.post.loadPost({fromEdit:true, editCommentId:Config.getTempParam("EditedPostCommentNumber")});
}

PagesScripts.edit_post.sendEditedPost = function() {
    var currentIcon = Config.CurrentSelectedIcon;
    if (currentIcon == null || isNaN(currentIcon))
        currentIcon = 0;
	if (Utils.trim($("#postEditTitle").val()) == "") {
		$("#postEditTitle").addClass("input_error");
		setTimeout(function() {$("#postEditTitle").removeClass("input_error");}, 500);
	}
	else {
		PageManager.showLoader();
		HTTPManager.EditPost(PageManager.hashParams["forum"], PageManager.hashParams["post"], Config.getTempParam("EditedPostCommentNumber"), PagesScripts.edit_post.selectedIcon, $("#postEditTitle").val(), $("#postEditBody").val());
		AdManager.track("Post-Edit");
	}
}

PagesScripts.edit_post.populateIcons = function() {
	for (var i=0;i<Config.PostIcons.length;i++) {
		$("#icon_list #icon_container").append("<li icon_src='" + Config.PostIcons[i].icon + "' icon_type='" + Config.PostIcons[i].type + "' class='button icon_popup_item'><img class='icon_popup_image' src='" + Config.PostIcons[i].icon + "' /></li>");
	}
}

PagesScripts.edit_post.showIconsList = function() {
	$("#icon_list").show();
	$("#icon_container li.icon_popup_item").each(function() {
		if (PagesScripts.edit_post.selectedIcon != null && $(this).attr("icon_type") == PagesScripts.edit_post.selectedIcon) {
			$(this).addClass("icon_popup_item_selected");
		}
		$(this).bind("click", function() {
			PagesScripts.edit_post.setSelectedIcon($(this), $(this).attr("src"), $(this).attr("icon_type"));
		});
	});
}

PagesScripts.edit_post.setSelectedIcon = function (obj, src, type) {
	$("li.icon_popup_item.icon_popup_item_selected").removeClass("icon_popup_item_selected");
	obj.addClass("icon_popup_item_selected");
	PagesScripts.edit_post.saveIcon();
}

PagesScripts.edit_post.selectedIcon = null;
PagesScripts.edit_post.saveIcon = function() {
	$("#icon_list").hide();
	if ($("li.icon_popup_item.icon_popup_item_selected").length == 1) {
		$("#post_selected_icon").attr("src", $("li.icon_popup_item.icon_popup_item_selected").attr("icon_src"));
		PagesScripts.edit_post.selectedIcon = $("li.icon_popup_item.icon_popup_item_selected").attr("icon_type");
		$("#post_selected_icon").show();
		$("#post_selected_icon_caption").html("שנה אייקון");
	}
}

HTTPEvents.addEventListener("onPreEditPageLoaded", PagesScripts.edit_post.onPreEditPageLoaded);
HTTPEvents.addEventListener("onEditPostSent", PagesScripts.edit_post.onEditPostSent);