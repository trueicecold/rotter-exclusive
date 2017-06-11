PagesScripts.comment_post = {};

PagesScripts.comment_post.initHandlers = function() {
	PageManager.setHeader("תגובה לאשכול");
	$("#comment_from_title").html(unescape(PageManager.hashParams["comment_from_title"]));
}

PagesScripts.comment_post.setPostState = function() {
	console.log($("#comment_title").val());
	if (Utils.trim($("#comment_title").val()) == "") {
		$("#comment_send_button").attr("disabled", "disabled");
	}
	else {
		$("#comment_send_button").removeAttr("disabled");
	}
}

PagesScripts.comment_post.commentId = "";
PagesScripts.comment_post.commentTitle = "";
PagesScripts.comment_post.checkNewComment = function(comment_id, comment_title) {
	PageManager.showLoader();
	PagesScripts.comment_post.commentId = comment_id;
	PagesScripts.comment_post.commentTitle = comment_title;
	if (PagesScripts.comment_post.commentId != 0) {
		PagesScripts.comment_post.commentTitle = PagesScripts.comment_post.commentTitle.substr(PagesScripts.comment_post.commentTitle.indexOf("%20"));
	}
	HTTPManager.LoadPreCommentPage(PageManager.hashParams["forum"], PageManager.hashParams["post"], comment_id);
}

PagesScripts.comment_post.onPreCommentPageLoaded = function(event) {
	PageManager.hideLoader();
	if (event.data && event.data.success != null && event.data.success === true) {
		PageManager.showPopup(TemplateManager.GetTemplate("quick_comment"));
		$("#comment_from_title").html(unescape(PagesScripts.comment_post.commentTitle));
	}
	else {
		PageManager.showPopup(TemplateManager.GetTemplate("not_connected_comment"));
	}
}

PagesScripts.comment_post.sendComment = function() {
		if (Utils.trim($("#comment_title").val()) == "") {
			$("#comment_title").addClass("input_error");
			setTimeout(function() {$("#comment_title").removeClass("input_error");}, 500);
		}
		else {
			PageManager.showLoader();
			HTTPManager.SendComment(PageManager.hashParams["forum"], PageManager.hashParams["post"], PagesScripts.comment_post.commentId, $("#comment_title").val(), $("#comment_body").val());
			AdManager.track("Comment-Add");
		}
}

PagesScripts.comment_post.onCommentSent = function() {
	PageManager.hideLoader();
	PageManager.hidePopup();
	PagesScripts.post.loadPost({fromNewComment:true});
}

HTTPEvents.addEventListener("onCommentSent", PagesScripts.comment_post.onCommentSent);
HTTPEvents.addEventListener("onPreCommentPageLoaded", PagesScripts.comment_post.onPreCommentPageLoaded);