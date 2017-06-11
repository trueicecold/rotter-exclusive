var HTTPManager = {};
var HTTPEvents = new EventTarget();

jQuery.ajaxSetup({ 
	'beforeSend': function(req) {
		req.setRequestHeader("FromApp", "true")
	} 
})

HTTPManager.init = function () {
}

HTTPManager.CheckLogin = function (username, password) {
	$.ajax({
		url:"https://rotter.name/cgi-bin/nor/dcboard.cgi",
		dataType:"text",
		success:function(data) {
			HTTPEvents.fireEvent("onCheckLogin", Parser.parseCheckLogin(data));
		},
		error:function(a,b,c,d) {
			HTTPEvents.fireEvent("onCheckLogin", {success:false});
		},
		complete:function(data) {
		}
	});
};

HTTPManager.Login = function (username, password) {
	$.ajax({
		url:"https://rotter.name/cgi-bin/nor/dcboard.cgi?az=login",
		type:"GET",
		dataType:"text",
		data:"cmd=login&" + Utils.HEBEncode("שם-משתמש") + "=" + Utils.HEBEncode(Utils.escapeLogin(username)) + "&" + Utils.HEBEncode("סיסמא") + "=" + Utils.HEBEncode(Utils.escapeLogin(password)) + "&login=" + Utils.HEBEncode("קליק"),
		success:function(data) {
			HTTPEvents.fireEvent("onLogin", Parser.parseLogin(data));
		},
		error:function(a,b,c,d) {
			HTTPEvents.fireEvent("onLogin", {success:false});
		},
		complete:function(data) {
		}
	});
};

HTTPManager.Logout = function () {
	console.log("LOGOUT!");
	PushManager.deleteTags();
	$.ajax({
		url:"https://rotter.name/cgi-bin/nor/dcboard.cgi?az=logout",
		dataType:"text",
		success:function(data) {
			HTTPEvents.fireEvent("onLogout");
		},
		error:function(a,b,c,d) {
			HTTPEvents.fireEvent("onLogout");
		}
	});
};

HTTPManager.GetForumList = function() {
	$.ajax({
		url:"https://rotter.name/cgi-bin/nor/dcboard.cgi",
		dataType:"text",
		success:function(data) {
			HTTPEvents.fireEvent("onForumList", Parser.parseForumList(data));
		},
		error:function(a,b,c,d) {
			HTTPEvents.fireEvent("onForumList", {success:false});
		},
		complete:function(data) {
		}
	});
}

HTTPManager.GetForumPosts = function(forum, page) {
	$.ajax({
		url:"https://rotter.name/cgi-bin/nor/dcboard.cgi?az=list&forum=" + forum + "&mm=" + page,
		dataType:"text",
		success:function(data) {
			HTTPEvents.fireEvent("onForumPosts", Parser.parseForumPosts(data));
		},
		error:function(a,b,c,d) {
			HTTPEvents.fireEvent("onForumPosts", {success:false});
		},
		complete:function(data) {
		}
	});
}

HTTPManager.GetPost = function(forum, id, link_type) {
	$.ajax({
		url:(link_type=="long") ? "https://rotter.name/cgi-bin/nor/dcboard.cgi?az=show_thread&om=" + id + "&forum=" + forum + "&viewmode=all" : "https://rotter.name/nor/" + forum + "/" + id + ".shtml",
		dataType:"text",
		success:function(data) {
			if (data.indexOf('<meta http-equiv="refresh" content="0') > -1) {
				var redirect = data.substr(data.indexOf("URL=") + 4);
				redirect = redirect.substr(0, redirect.indexOf('"'));
				
				if (redirect.indexOf("om=") > -1) {
					link_type = "long";
					id = redirect.substr(redirect.indexOf("om=")+3);
					id = id.substr(0, id.indexOf("&"));
					forum = redirect.substr(redirect.indexOf("&forum=")+7);
					forum = forum.substr(0, forum.indexOf("&"));
				}
				else {
					link_type = "short";
					id = redirect.substr(redirect.lastIndexOf("/")+1);
					id = id.substr(0, id.indexOf("."));
					forum = redirect.substr(redirect.indexOf("/nor/") + 5);
					forum = forum.substr(0, forum.indexOf("/"));
				}
				//HTTPManager.GetPost(forum, id, link_type);
				PageManager.changeLocation("post", {forum:forum, post:id, type:link_type}, true);
			}
			else {
				HTTPEvents.fireEvent("onPostLoaded", Parser.parsePost(data));
			}
		},
		error:function(a,b,c,d) {
			HTTPEvents.fireEvent("onPostLoaded", {success:false});
		},
		complete:function(data) {
		}
	});
}

HTTPManager.LoadInbox = function(page) {
	$.ajax({
		url:"https://rotter.name/cgi-bin/nor/dcboard.cgi?az=user&command=inbox&from=lobby&mm=" + page,
		dataType:"text",
		success:function(data) {
			HTTPEvents.fireEvent("onInboxLoaded", Parser.parseInbox(data));
		},
		error:function(a,b,c,d) {
			HTTPEvents.fireEvent("onInboxLoaded", {success:false});
		},
		complete:function(data) {
		}
	});
}

HTTPManager.SendInboxMessage = function(address, title, content) {
	$.ajax({
		url:"https://rotter.name/cgi-bin/nor/dcboard.cgi",
		type:"POST",
		data:"az=send_mesg&command=send&userid=" + Utils.HEBEncode(address) + "&subject=" + Utils.HEBEncode(title) + "&message=" + Utils.HEBEncode(content),
		dataType:"text",
		success:function(data) {
			HTTPEvents.fireEvent("onInboxMessageSent", Parser.parseInboxMessageSent(data));
		},
		error:function(a,b,c,d) {
			HTTPEvents.fireEvent("onInboxMessageSent", {success:false});
		},
		complete:function(data) {
		}
	});
}

HTTPManager.LoadInboxMessage = function(message_id) {
	$.ajax({
		url:"https://rotter.name/cgi-bin/nor/dcboard.cgi?az=user&command=show_mesg&id=" + message_id,
		dataType:"text",
		success:function(data) {
			HTTPEvents.fireEvent("onInboxMessageLoaded", Parser.parseInboxMessage(data));
		},
		error:function(a,b,c,d) {
			HTTPEvents.fireEvent("onInboxMessageLoaded", {success:false});
		},
		complete:function(data) {
		}
	});
}

HTTPManager.LoadInboxMessageForReply = function(message_id, message_sender) {
	$.ajax({
		url:"https://rotter.name/cgi-bin/nor/dcboard.cgi?az=send_mesg&userid=" + Utils.HEBEncode(message_sender) + "&id=" + message_id,
		dataType:"text",
		success:function(data) {
			HTTPEvents.fireEvent("onInboxMessageLoadedForReply", Parser.parseInboxMessageForReply(data));
		},
		error:function(a,b,c,d) {
			HTTPEvents.fireEvent("onInboxMessageLoadedForReply", {success:false});
		},
		complete:function(data) {
		}
	});
}

HTTPManager.CheckNewPrivateMessages = function(message_id, message_sender) {
	$.ajax({
		url:"https://rotter.name/cgi-bin/nor/dcboard.cgi",
		dataType:"text",
		success:function(data) {
			HTTPEvents.fireEvent("onInboxNewMessages", Parser.parseInboxNewMessages(data));
		},
		error:function(a,b,c,d) {
			HTTPEvents.fireEvent("onInboxNewMessages", {success:false});
		},
		complete:function(data) {
		}
	});
}

HTTPManager.DeleteSelectedMessages = function(messages) {
	var messagesPostString = "";
	for (var i in messages) {
		messagesPostString += "&selected=" + i;
	}
	$.ajax({
		url:"https://rotter.name/cgi-bin/nor/dcboard.cgi",
		type:"POST",
		dataType:"text",
		data:"az=user&sub_command=prune&command=inbox&sec_command=&see_command=" + messagesPostString + "&delete=" + Utils.HEBEncode("מחק").replace(/\s/g, "+"),
		success:function(data) {
			HTTPEvents.fireEvent("onInboxMessagesDeleted", {success:true});
		},
		error:function(a,b,c,d) {
			HTTPEvents.fireEvent("onInboxMessagesDeleted", {success:false});
		},
		complete:function(data) {
		}
	});
}

HTTPManager.LoadPreCommentPage = function(forum, postId, replyingTo) {
	$.ajax({
		url:"https://rotter.name/cgi-bin/nor/dcboard.cgi?az=post&forum=" + forum + "&om=" + postId + "&omm=" + replyingTo,
		dataType:"text",
		success:function(data) {
			HTTPEvents.fireEvent("onPreCommentPageLoaded", Parser.parsePreCommentPageDetails(data));
		},
		error:function(a,b,c,d) {
			HTTPEvents.fireEvent("onPreCommentPageLoaded", {success:false});
		}
	});
}

HTTPManager.LoadPreEditPage = function(forum, postId, commentNum) {
	$.ajax({
		url:"https://rotter.name/cgi-bin/nor/dcboard.cgi?az=edit&forum=" + forum + "&om=" + postId + "&omm=" + commentNum,
		dataType:"text",
		success:function(data) {
			HTTPEvents.fireEvent("onPreEditPageLoaded", Parser.parsePreEditPageDetails(data));
		},
		error:function(a,b,c,d) {
			HTTPEvents.fireEvent("onPreEditPageLoaded", {success:false});
		}
	});
}

HTTPManager.SendComment = function(forum, postId, replyingTo, title, content) {
	$.ajax({
		url:"https://rotter.name/cgi-bin/nor/dcboard.cgi",
		type:"POST",
		dataType:"text",
		data:"rand=" + Config.PostRand + "&forum=" + forum + "&om=" + postId + "&omm=" + replyingTo + "&orig_url=" + encodeURIComponent(Config.OrigURL) + "&no_signature=&az=a_mesg&name=" + Utils.HEBEncode(Config.getParam("username")).replace(/\s/g, "+") + "&subject=" + Utils.HEBEncode(title) + "&msgfont=&msgcolor=&body=" + Utils.HEBEncode(content + "\n\n אדוםםקטןןנשלח ע\"י הסלולריסוףףסוףף") + "&post=" + Utils.HEBEncode("שלח הודעה").replace(/\s/g, "+"),
		success:function(data) {
			HTTPEvents.fireEvent("onCommentSent", Parser.parsePost(data));
		},
		error:function(a,b,c,d) {
			HTTPEvents.fireEvent("onCommentSent", {success:false});
		},
		complete:function(data) {
		}
	});
}

HTTPManager.EditPost = function(forum, postId, replyId, topicType, title, content) {
	title = title.replace("+", "%2b");
	$.ajax({
		url:"https://rotter.name/cgi-bin/nor/dcboard.cgi",
		type:"POST",
		dataType:"text",
		data:"rand=" + Config.PostRand + "&forum=" + forum + "&om=" + postId + "&omm=" + replyId + "&topic_type=" + topicType + "&orig_url=" + encodeURIComponent(Config.OrigURL) + "&no_signature=&az=e_mesg&name=" + Utils.HEBEncode(Config.PosterName).replace(/\s/g, "+") + "&subject=" + Utils.HEBEncode(title) + "&msgfont=&msgcolor=&body=" + Utils.HEBEncode(content) + "&post=" + Utils.HEBEncode("עדכן הודעה").replace(/\s/g, "+"),
		success:function(data) {
			HTTPEvents.fireEvent("onEditPostSent", Parser.parsePost(data));
		},
		error:function(a,b,c,d) {
			HTTPEvents.fireEvent("onEditPostSent", {success:false});
		},
		complete:function(data) {
		}
	});
}

HTTPManager.SendPost = function(forum, type, title, content) {
	$.ajax({
		url:"https://rotter.name/cgi-bin/nor/dcboard.cgi",
		type:"POST",
		dataType:"text",
		data:"rand=" + Config.PostRand + "&forum=" + forum + "&topic_type=" + type + "&orig_url=" + encodeURIComponent(Config.OrigURL) + "&no_signature=&az=a_mesg&name=" + Utils.HEBEncode(Config.getParam("username")).replace(/\s/g, "+") + "&subject=" + Utils.HEBEncode(title) + "&msgfont=&msgcolor=&body=" + Utils.HEBEncode(content + "\n\n אדוםםקטןןנשלח ע\"י הסלולריסוףףסוףף") + "&post=" + Utils.HEBEncode("שלח הודעה").replace(/\s/g, "+"),
		success:function(data) {
			HTTPEvents.fireEvent("onPostSent", Parser.parsePost(data));
		},
		error:function(a,b,c,d) {
			HTTPEvents.fireEvent("onPostSent", {success:false});
		},
		complete:function(data) {
		}
	});
}

HTTPManager.LoadPrePostPage = function(forum) {
	$.ajax({
		url:"https://rotter.name/cgi-bin/nor/dcboard.cgi?az=post&forum=" + forum,
		dataType:"text",
		success:function(data) {
			HTTPEvents.fireEvent("onPrePostPageLoaded", Parser.parsePrePostPageDetails(data));
		},
		error:function(a,b,c,d) {
			HTTPEvents.fireEvent("onPrePostPageLoaded", {success:false});
		}
	});
}

HTTPManager.LoadPreJumpPage = function(forum, postId) {
	$.ajax({
		url:"https://rotter.name/cgi-bin/nor/dcboard.cgi?az=edit&forum=" + forum + "&om=" + postId + "&omm=0",
		dataType:"text",
		success:function(data) {
			HTTPEvents.fireEvent("onPreJumpPageLoaded", Parser.parsePreEditPageDetails(data));
		},
		error:function(a,b,c,d) {
			HTTPEvents.fireEvent("onPreJumpPageLoaded", {success:false});
		}
	});
}

HTTPManager.SendJumpPost = function(forum, postId, topicType, title, content) {
	$.ajax({
		url:"https://rotter.name/cgi-bin/nor/dcboard.cgi",
		type:"POST",
		dataType:"text",
		data:"rand=" + Config.PostRand + "&forum=" + forum + "&om=" + postId + "&omm=0&topic_type=" + topicType + "&orig_url=" + encodeURIComponent(Config.OrigURL) + "&no_signature=&az=up_mesg&name=" + Utils.HEBEncode(Config.PosterName).replace(/\s/g, "+") + "&subject=" + Utils.HEBEncode(title) + "&msgfont=&msgcolor=&body=" + Utils.HEBEncode(content) + "&post=" + Utils.HEBEncode("הקפץ הודעתך אל ראש הפורום").replace(/\s/g, "+"),
		success:function(data) {
			HTTPEvents.fireEvent("onJumpSent", Parser.parsePost(data));
		},
		error:function(a,b,c,d) {
			HTTPEvents.fireEvent("onJumpSent", {success:false});
		},
		complete:function(data) {
		}
	});
}