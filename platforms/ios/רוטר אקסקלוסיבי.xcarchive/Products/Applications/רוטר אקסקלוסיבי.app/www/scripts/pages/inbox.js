PagesScripts.inbox = {};

PagesScripts.inbox.initHandlers = function() {
	if (PageManager.hashParams["page"] != null && !isNaN(PageManager.hashParams["page"]))
		PagesScripts.inbox.page = parseInt(PageManager.hashParams["page"]);
	else
		PagesScripts.inbox.page = 1;

	PageManager.setHeader("תיבת דואר");
	PageManager.setSelectedFooter("inbox");
	PagesScripts.inbox.headerOptionsSet = false;
	PagesScripts.inbox.loadInbox();
	AdManager.track("Inbox-View");
}

PagesScripts.inbox.refresh = function() {
	if (PagesScripts.inbox.page != 1) {
		PagesScripts.inbox.page = 1;
		PageManager.changeLocation("inbox");
	}
	else {
		PagesScripts.inbox.loadInbox();
	}
}

PagesScripts.inbox.incPage = function(value) {
	PagesScripts.inbox.page = PagesScripts.inbox.page + value;
	PageManager.changeLocation("inbox", {page:PagesScripts.inbox.page});
}

PagesScripts.inbox.loadInbox = function(page) {
	PagesScripts.inbox.messagesToDelete = [];
	PageManager.showLoader();
	HTTPManager.LoadInbox(PagesScripts.inbox.page);
}

PagesScripts.inbox.onInboxLoaded = function(event) {
	PageManager.hideLoader();
	$("#inbox_list").html("");
	if (event.data && event.data.success != null && event.data.success === true && event.data.messages && event.data.messages.length > 0) {
		PagesScripts.inbox.populateInboxList(event.data);
	}
}

PagesScripts.inbox.headerOptionsSet = false;
PagesScripts.inbox.populateInboxList = function(source) {
	for (var i=0;i<source.messages.length;i++) {
		$("#inbox_list").append(Utils.replaceVar(TemplateManager.GetTemplate("inbox_item"), 
			{
				"MESSAGE_SENDER":source.messages[i].sender, 
				"MESSAGE_ID":source.messages[i].messageId, 
				"MESSAGE_DATE":source.messages[i].date, 
				"MESSAGE_TIME":source.messages[i].time,
				"MESSAGE_TITLE":source.messages[i].title,
				"MESSAGE_SENDER_ESCAPED":source.messages[i].sender.replace(/\'/ig, "\\\'").replace(/\"/ig, '\\\"'),
				"MESSAGE_TITLE_ESCAPED":source.messages[i].title.replace(/\'/ig, "\\\'").replace(/\"/ig, '\\\"')
			}
		));
	}
	$("#inboxPageNum").html(PagesScripts.inbox.page + " מתוך " + source.numPages);
	$("#inboxPagingContainer").show();
	$("#inboxPagePrev").css("display", (PagesScripts.inbox.page == 1) ? "none" : "block");
	$("#inboxPageNext").css("display", (PagesScripts.inbox.page == source.numPages) ? "none" : "block");
	PagesScripts.inbox.resizeContent();
	
	if (!PagesScripts.inbox.headerOptionsSet) {
		PageManager.addHeaderOptions($("#right_menu_buttons"));
		PagesScripts.inbox.headerOptionsSet = true;
	}
}

PagesScripts.inbox.messagesToDelete = [];
PagesScripts.inbox.setMessageToDelete = function(obj, messageId) {
	for (var i in PagesScripts.inbox.messagesToDelete) {
		if (i == messageId) {
			delete PagesScripts.inbox.messagesToDelete[i];
			$(obj).parent().removeClass("delete_selected");
			return;
		}
	}
	PagesScripts.inbox.messagesToDelete[messageId] = 1;
	$(obj).parent().addClass("delete_selected");		
}

PagesScripts.inbox.showDeletePopup = function() {
	PageManager.showPopup(TemplateManager.GetTemplate("confirm_delete_messages"));
}

PagesScripts.inbox.deleteSelectedMessages = function() {
	PageManager.hidePopup();
	HTTPManager.DeleteSelectedMessages(PagesScripts.inbox.messagesToDelete);
	AdManager.track("Inbox-Delete");
}

PagesScripts.inbox.onInboxMessagesDeleted = function(event) {
	if (event.data != null && event.data.success != null && event.data.success === true)
		PagesScripts.inbox.refresh();
	else
		PageManager.showPopup(TemplateManager.GetTemplate("delete_messages_error"));
}

PagesScripts.inbox.showMenuPopup = function() {
	PageManager.showPopup(TemplateManager.GetTemplate("inbox_popup_menu"));
}

PagesScripts.inbox.onImageUploaded = function(event) {
	if (event.data.success != null && event.data.success == true) {
		$("#inbox_content").val($("#inbox_content").val() + event.data.url);
	}
}

PagesScripts.inbox.newMessage = function(message_sender, message_title, message_content) {
	PageManager.showPopup(TemplateManager.GetTemplate("inbox_compose"));
	if (message_sender != null && Utils.trim(message_sender) != "") {
		$("#inbox_nickname").val(message_sender);
		$("#inbox_title").val(message_title);
		$("#inbox_content").val(message_content);
		AdManager.track("Inbox-Message-View");
	}
	else {
	    AdManager.track("Inbox-Message-New");
	}
}

PagesScripts.inbox.sendMessage = function() {
	if (Utils.trim($("#inbox_nickname").val()) == "") {
		$("#inbox_nickname").addClass("input_error");
		setTimeout(function() {$("#inbox_nickname").removeClass("input_error");}, 500);
		return;
	}
	if (Utils.trim($("#inbox_title").val()) == "") {
		$("#inbox_title").addClass("input_error");
		setTimeout(function() {$("#inbox_title").removeClass("input_error");}, 500);
		return;
	}
	PageManager.showLoader();
	HTTPManager.SendInboxMessage($("#inbox_nickname").val(), $("#inbox_title").val(), $("#inbox_content").val());
	AdManager.track("Inbox-Send");
}

PagesScripts.inbox.messageSender = "";
PagesScripts.inbox.messageTitle = "";
PagesScripts.inbox.messageId = "";
PagesScripts.inbox.readMessage = function(message_id, message_sender, message_title) {
	PageManager.showLoader();
	PagesScripts.inbox.messageId = message_id;
	PagesScripts.inbox.messageSender = message_sender;
	PagesScripts.inbox.messageTitle = message_title;
	HTTPManager.LoadInboxMessage(message_id);
	AdManager.track("Inbox-Read");
}

PagesScripts.inbox.onInboxMessageSent = function(event) {
	PageManager.hideLoader();
	if (event.data != null && event.data.success != null && event.data.success === true) {
		PageManager.hidePopup();
		PagesScripts.inbox.refresh();
	}
	else {
		alert("שם המשתמש שהוזן אינו קיים במערכת");
	}
}

PagesScripts.inbox.modalContentWidth = 0;
PagesScripts.inbox.messageScroller = null;
PagesScripts.inbox.onInboxMessageLoaded = function(event) {
	PageManager.hideLoader();
	if (event.data != null && event.data.success != null && event.data.success === true) {
		PageManager.showPopup(TemplateManager.GetTemplate("inbox_read"));
		PagesScripts.inbox.modalContentWidth = parseInt($("#modal_window").width()) - 50;
		$("#inbox_sender").html(PagesScripts.inbox.messageSender);
		$("#inbox_title").html(PagesScripts.inbox.messageTitle);
		$("#inbox_content").html(event.data.message);
		$("#inbox_content").css("width", PagesScripts.inbox.modalContentWidth);
		$("#inbox_content").find("table").removeAttr("width");
		PagesScripts.inbox.messageScroller = new iScroll("inbox_content", {checkDOMChanges:true, desktopCompatibility:true});
		setTimeout(function () { PagesScripts.inbox.messageScroller.refresh(); }, 0);
	}
	else {
		alert("שגיאה בקריאת ההודעה");
	}
}

PagesScripts.inbox.readMessageForReply = function() {
	PageManager.showLoader();
	HTTPManager.LoadInboxMessageForReply(PagesScripts.inbox.messageId, PagesScripts.inbox.messageSender);
}

PagesScripts.inbox.onInboxMessageLoadedForReply = function(event) {
	PageManager.hideLoader();
	if (event.data != null && event.data.success != null && event.data.success === true) {
		PagesScripts.inbox.newMessage(PagesScripts.inbox.messageSender, (PagesScripts.inbox.messageTitle.substr(0, 3) == "ת: ") ? PagesScripts.inbox.messageTitle : "ת: " + PagesScripts.inbox.messageTitle, event.data.message);
	}
}

PagesScripts.inbox.resizeContent = function() {
	$("#inbox_list h3").css("width", $(window).width()-60);
	$("#inbox_list h3").each(function() {
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
	$("#inbox_list p").css("width", $(window).width()-60);
}

PagesScripts.inbox.privateMessageInterval = -1;
PagesScripts.inbox.setInterval = function(start, interval) {
	if (PagesScripts.inbox.privateMessageInterval != -1) {
		clearInterval(PagesScripts.inbox.privateMessageInterval);
	}
	if (start == "1") {
		if (interval != null && !isNaN(parseInt(interval)) && parseInt(interval) > 0) {
			PagesScripts.inbox.privateMessageInterval = setInterval("PagesScripts.inbox.checkNewMessages()", interval*60*1000);
		}
	}
}

PagesScripts.inbox.checkNewMessages = function() {
	HTTPManager.CheckNewPrivateMessages();
}

PagesScripts.inbox.onInboxNewMessages = function(event) {
	if (event.data != null && event.data.success != null && event.data.success === true) {
		if (!PageManager.isPopupShown) {
			PageManager.showPopup(TemplateManager.GetTemplate("inbox_new_messages"));
		}
	}
}

HTTPEvents.addEventListener("onInboxLoaded", PagesScripts.inbox.onInboxLoaded);
HTTPEvents.addEventListener("onInboxMessagesDeleted", PagesScripts.inbox.onInboxMessagesDeleted);
HTTPEvents.addEventListener("onInboxMessageSent", PagesScripts.inbox.onInboxMessageSent);
HTTPEvents.addEventListener("onInboxMessageLoaded", PagesScripts.inbox.onInboxMessageLoaded);
HTTPEvents.addEventListener("onInboxMessageLoadedForReply", PagesScripts.inbox.onInboxMessageLoadedForReply);
HTTPEvents.addEventListener("onInboxNewMessages", PagesScripts.inbox.onInboxNewMessages);
UploadEvents.addEventListener("onImageUploaded", PagesScripts.inbox.onImageUploaded);