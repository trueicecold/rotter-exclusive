var Parser = {};
Parser.parseForumList = function(str) {
	var forumsArray = str.split('<td align="RIGHT" valign="top" width="100"><a href="https://rotter.name/cgi-bin/nor/dcboard.cgi?az=list'); 
	forumsArray.splice(0, 1);
	for (var i=0;i<forumsArray.length;i++) {
		forumsArray[i] = {source:forumsArray[i]};
		forumsArray[i].title = forumsArray[i].source.substr(forumsArray[i].source.indexOf("<font color=red size=3><u>")+26);
		
		forumsArray[i].description = forumsArray[i].title.substr(forumsArray[i].title.indexOf('color="#000099">')+16);
		forumsArray[i].description = forumsArray[i].description.substr(0, forumsArray[i].description.indexOf("<font"));
		forumsArray[i].description = forumsArray[i].description.substr(0, forumsArray[i].description.lastIndexOf("<br>")).replace(/\<br\>/ig, " ");		
				
		forumsArray[i].title = forumsArray[i].title.substr(0, forumsArray[i].title.indexOf("</"));
		
		forumsArray[i].logo = forumsArray[i].source.substr(forumsArray[i].source.indexOf('<img src="')+10);
		forumsArray[i].logo = forumsArray[i].logo.substr(0, forumsArray[i].logo.indexOf("\""));
		
		forumsArray[i].name = forumsArray[i].source.substr(forumsArray[i].source.indexOf('az=list&forum=')+14);
		forumsArray[i].name = forumsArray[i].name.substr(0, forumsArray[i].name.indexOf("&"));
		delete forumsArray[i].source;
	}
	return {success:true, forums:forumsArray};
}

Parser.parseForumPosts = function(str) {
	if (str.indexOf("|  ... |") > -1) {
		var numPages = str.substr(str.indexOf("|  ... |", 200));
		numPages = numPages.substr(numPages.indexOf("mm=")+3);
		numPages = parseInt(numPages.substr(0, numPages.indexOf("&")));
	}
	else {
		if (str.indexOf('size="-1"></form>דף ') > -1) {
			var numPages = str.substr(str.indexOf('size="-1"></form>דף ')+22);
			
			numPages = numPages.substr(0, numPages.indexOf("</A></font><BR></td></tr></table>"));
			if (numPages.substr(-7) == "</font>") {
				numPages = numPages.substr(0, numPages.lastIndexOf("</font>"));
			}
			numPages = parseInt(Utils.trim(numPages.substr(numPages.lastIndexOf(">")+1)));
		}
		else
			var numPages = 1;
	}

	var forumName = str.substr(str.indexOf("<TITLE>")+7);
	forumName = forumName.substr(0, forumName.indexOf("</TITLE>"));
	forumName = Utils.trim(forumName);
	
	var forumPosts = str.split('<TD ALIGN="CENTER" width="5%" VALIGN="TOP">');
	forumPosts.splice(0, 1);
	for (var i=forumPosts.length-1;i>-1;i--) {
		if (forumPosts[i].indexOf('<font color="black">סקר:</font>') > -1) {
			forumPosts.splice(i, 1);
		}
	}

	for (i=0;i<forumPosts.length;i++) {
		forumPosts[i] = {source:forumPosts[i]};
		
		forumPosts[i].icon = forumPosts[i].source.substr(forumPosts[i].source.indexOf('src="')+5);
		forumPosts[i].icon = forumPosts[i].icon.substr(0, forumPosts[i].icon.indexOf('"'));
		
		forumPosts[i].title = forumPosts[i].source.substr(forumPosts[i].source.indexOf("<b>")+3);
		forumPosts[i].title = forumPosts[i].title.substr(0, forumPosts[i].title.indexOf("</b>"));
		if (forumPosts[i].title.indexOf("<img") > -1)
			forumPosts[i].title = forumPosts[i].title.substr(0, forumPosts[i].title.indexOf("<img"));
		forumPosts[i].link = forumPosts[i].source.substr(forumPosts[i].source.indexOf('<a href="')+9);
		forumPosts[i].link = forumPosts[i].link.substr(0, forumPosts[i].link.indexOf('">'));
		
		if (forumPosts[i].title.indexOf("הועבר:") > -1) {
			forumPosts[i].title = forumPosts[i].title.substr(forumPosts[i].title.indexOf('.shtml">')+8);
			forumPosts[i].title = "הועבר: " + forumPosts[i].title.substr(0, forumPosts[i].title.indexOf("</a>"));
			forumPosts[i].transferred = true;
		}
		
		if (forumPosts[i].title.indexOf("<span style='background-color:#ffff66'><font color=\"red\">") > -1) {
			forumPosts[i].title = forumPosts[i].title.substr(forumPosts[i].title.indexOf("<span style='background-color:#ffff66'><font color=\"red\">")+57);
			forumPosts[i].title = forumPosts[i].title.substr(0, forumPosts[i].title.indexOf("</a>"));
			forumPosts[i].emphasized = true;
		}
		
		forumPosts[i].anchor = forumPosts[i].icon.indexOf("anchor") > -1;
		forumPosts[i].locked = forumPosts[i].icon.indexOf("locked") > -1;
		
		if (forumPosts[i].link.indexOf("om=") > -1) {
			forumPosts[i].type = "long";
			forumPosts[i].id = forumPosts[i].link.substr(forumPosts[i].link.indexOf("om=")+3);
			forumPosts[i].id = forumPosts[i].id.substr(0, forumPosts[i].id.indexOf("&"));
		}
		else {
			forumPosts[i].type = "short";
			forumPosts[i].id = forumPosts[i].link.substr(forumPosts[i].link.lastIndexOf("/")+1);
			forumPosts[i].id = forumPosts[i].id.substr(0, forumPosts[i].id.indexOf("."));
		}
		
		forumPosts[i].opener_with_icon = forumPosts[i].source.substr(forumPosts[i].source.indexOf("<font CLASS='text13'>")+21);
		forumPosts[i].opener_with_icon = forumPosts[i].opener_with_icon.substr(0, forumPosts[i].opener_with_icon.indexOf('</font>'));
        forumPosts[i].opener = forumPosts[i].opener_with_icon.substr(0, forumPosts[i].opener_with_icon.indexOf('</'));
		
		forumPosts[i].last_post = forumPosts[i].source.substr(forumPosts[i].source.indexOf('<TD ALIGN="CENTER" VALIGN="TOP"><FONT SIZE="1"')+46);
		forumPosts[i].last_post = {source:forumPosts[i].last_post};
		forumPosts[i].last_post.date = forumPosts[i].last_post.source.substr(forumPosts[i].last_post.source.indexOf(">")+1);
		forumPosts[i].last_post.date = forumPosts[i].last_post.date.substr(0, forumPosts[i].last_post.date.indexOf("<"));
		forumPosts[i].last_post.time = forumPosts[i].last_post.source.substr(forumPosts[i].last_post.source.indexOf("<font color=red>")+16);
		forumPosts[i].last_post.time = forumPosts[i].last_post.time.substr(0, forumPosts[i].last_post.time.indexOf("<"));
		forumPosts[i].last_post.poster = forumPosts[i].last_post.source.substr(forumPosts[i].last_post.source.indexOf("מאת ")+4 );
		forumPosts[i].last_post.poster = forumPosts[i].last_post.poster.substr(0, forumPosts[i].last_post.poster.indexOf("<"));
		
		forumPosts[i].comment_count = forumPosts[i].source.substr(forumPosts[i].source.indexOf('SIZE="2" COLOR="#000099" FACE="Arial"><b>')+41);
		forumPosts[i].comment_count = forumPosts[i].comment_count.substr(0, forumPosts[i].comment_count.indexOf("</b>"));
		

		delete forumPosts[i].last_post.source;
		delete forumPosts[i].source;
	}
	var forumPostsData = {success:true, name:forumName, numPages:numPages, posts:forumPosts};
	return forumPostsData;
}

Parser.getPostLevel = function(posts, postInReplyTo) {
    if (postInReplyTo == "" || postInReplyTo == "0")
        return 0;
    for (var i = 0 ; i < posts.length ; i++) {
        if (posts[i].number == postInReplyTo)
            return Parser.getPostLevel(posts, posts[i].inreplyto)+1;
    }
    return 0;
}

Parser.parsePost = function(str) {
	if (Utils.isLoggedIn(str)) {
		var postArray = [];

		var postLocked = (str.indexOf("אשכול נעול - לקריאה בלבד") > -1);
		
		var posts = str.split(/<a name="/ig);
		posts.splice(0, 1);
		var postTitle;
		var postContent;
		var postLevel;
		
		var postName = str.substr(str.indexOf("<TITLE>")+7);
		postName = postName.substr(0, postName.indexOf("</TITLE>"));
		postName = Utils.trim(postName);
		
		for (var i=0;i<posts.length;i++) {
			postNumber = posts[i].substr(0, posts[i].indexOf('"'));
			if (!isNaN(parseInt(postNumber))) {
				postTitle = posts[i].substr(posts[i].indexOf("<FONT CLASS='text16b'>")+22);
				postTitle = postTitle.substr(0, postTitle.indexOf("</font>"));
				
				postContent = posts[i].substr(posts[i].indexOf("color=\"#000099\"><FONT CLASS='text15'><b>")+40);
				postContent = postContent.substr(0, postContent.indexOf("</font></td></tr></table>"));
				if (Config.getParam("showImages") != null && (Config.getParam("showImages") == 1 || Config.getParam("showImages") == 2)) {
					postContent = postContent.substr(0, postContent.lastIndexOf("</b>"));
				}
				
				postWriter = posts[i].substr(posts[i].indexOf("<b>")+3);
				postWriter = postWriter.substr(0, postWriter.indexOf("</b>"));
				postWriter = postWriter.replace("</a>", "");
				postWriter = postWriter.split("&nbsp;");
				
				postWriterIcon = "";
				for (var j=1;j<postWriter.length;j++) {
					postWriterIcon += (postWriter[j] != null) ? postWriter[j] : "";
				}
				
				postWriter = postWriter[0];
				
                postUsername = Utils.stripHTMLTags(postWriter);

				postTime = posts[i].substr(posts[i].indexOf("<font color=red>")+16);
				postTime = postTime.substr(0, postTime.indexOf("</font>"));		

				postDate = posts[i].substr(posts[i].indexOf('<font color="#FCF8F2" size="1">  </font>')+40);
				postDate = postDate.substr(0, postDate.indexOf("</font>"));		
				
				postInReplyTo = "";
				if (posts[i].indexOf('face="Arial" color="#000099"><A HREF="#') > -1) {
					postInReplyTo = posts[i].substr(posts[i].indexOf('face="Arial" color="#000099"><A HREF="#')+39);
					postInReplyTo = postInReplyTo.substr(0, postInReplyTo.indexOf('"'));
				}

                postLevel = Parser.getPostLevel(postArray, postInReplyTo);
				
				if (postContent.indexOf('<font size="1" color="#FF0000">') > -1) {
					postContent = postContent.substr(postContent.indexOf("</font><br>")+11);
				}

				postContent = postContent.replace(/\<img.*?src=[\"'](.+?)[\"'].*?>/ig, function (a, b, c) {
					if (b.toLowerCase().indexOf("/user_files/nor/") == 0) {
						return "<img src='https://rotter.name" + b.toString() + "'/>";
					}
					else {
						return a.toString();
					}
					return a.toString();
				});
				
				/*
				postContent = postContent.replace(/<a (.*?href\s*=\s*["\']([^"\']+)[^>]*>)(.*?)<\/a>/ig, function (a, b, c) {
				});
				*/

				if (Config.getParam("showImages") == null || Config.getParam("showImages") == 2) {
					postContent = postContent.replace(/<img/ig, "<iimg");
				}
				
				if (postContent.indexOf("<TABLE bgColor=fffaf4 border=1 cellSpacing=0 width=600 valign='middle' cellpading='0'>") > -1) {
					postContent = postContent.replace("<TABLE bgColor=fffaf4 border=1 cellSpacing=0 width=600 valign='middle' cellpading='0'>", "<TABLE bgColor=fffaf4 border=1 cellSpacing=0 width=100% valign='middle' cellpading='0'>");
				}
				
				if (postContent.indexOf('<div align="left"><FONT SIZE=-1><blockquote>') > -1 && postContent.indexOf("</FONT></div></span></blockquote>") == -1) {
					postContent += "</blockquote></FONT></div>";
				}
				
				postContent = postContent.replace('onClick="toggelSpoiler', 'onClick="PagesScripts.post.toggleSpoiler');
				
				postArray.push({number:postNumber, title:postTitle, content:postContent, writer:postWriter, writericon:postWriterIcon, username: postUsername, date:postDate, time:postTime, inreplyto:postInReplyTo, level: postLevel});
			}
		}
		
		return {success:true, name:postName, postLocked:postLocked, post:postArray};
	}
	else {
		return {success:false}
	}
}

Parser.parsePostIcons = function(str) {
    str = str.split('<td valign="top"><input type="radio" name="topic_type" value="');
    if (str.length > 1)
        str.splice(0, 1);
    PostIcons = [];
    for (var i=0;i<str.length;i++) {
        PostIcons[i] = {};
        PostIcons[i].type = str[i].substr(0, str[i].indexOf('"'));
        PostIcons[i].icon = str[i].substr(str[i].indexOf('src="')+5);
        PostIcons[i].icon = PostIcons[i].icon.substr(0, PostIcons[i].icon.indexOf('"'));
        PostIcons[i].checked = str[i].indexOf('checked') > -1;
    }
    return PostIcons;
}

Parser.parseCheckLogin = function(str) {
	if (str.indexOf('<font size="3" color="#006633"><b>שלום לך ') > -1) {
		str = str.substr(str.indexOf('<font size="3" color="#006633"><b>שלום לך ')+42);
		str = str.substr(0, str.indexOf("</b>"));
		return {success:true, username:str};
	}
	return {success:false};
}

Parser.parseLogin = function(str) {
	return {success:str.indexOf('<META HTTP-EQUIV="Refresh" CONTENT="0; URL=https://rotter.name/cgi-bin/nor/dcboard.cgi">') > -1};
}

Parser.parsePreEditPageDetails = function(str) {
    Config.PostIcons = Parser.parsePostIcons(str);
	Config.PostRand = Utils.getInputValue(str, "rand");
	Config.OrigURL = Utils.getInputValue(str, "orig_url");
	Config.PosterName = Utils.getInputValue(str, "name");
    Config.CurrentSelectedIcon = 0; // default value 0 in case of no "checked" icon
    var postIconId = 0;
    for (var i = 0 ; i < Config.PostIcons.length ; i++) {
        if (Config.PostIcons[i].checked) {
            Config.CurrentSelectedIcon  = Config.PostIcons[i].type;
            postIconId = i;
        }
    }
    Config.Subject = Utils.getInputValue(str, "subject");
    Config.Body = Utils.getTextareaValue(str, "body");
	if (Config.Subject != null && Config.Subject != "")
		return {success:true, postIconId: postIconId};

    if (str.indexOf("באפשרותך לערוך הודעה עד 45 דקות מזמן כתיבתה הראשונית.") > -1)
        return {success:false, errorType: 'time_over'};
    else if (str.indexOf("שגיאה בבקשתך - אינך מורשה לערוך הודעה זו.") > -1)
        return {success:false, errorType: 'no_authorize'}
    else if (str.indexOf("כניסה לחברים רשומים") > -1)
        return {success:false, errorType: 'not_login'}
    else
        return {success:false, errorType: 'unknown'}
}

Parser.parsePreCommentPageDetails = function(str) {
	Config.PostRand = Utils.getInputValue(str, "rand");
	Config.OrigURL = Utils.getInputValue(str, "orig_url");
	if (Config.PostRand != null && Config.PostRand != "" && !isNaN(Config.PostRand))
		return {success:true};
	
	return {success:false};
}

Parser.parsePrePostPageDetails = function(str) {
	if (str.indexOf('<td valign="top"><input type="radio" name="topic_type" value="') > -1) {
		Config.PostRand = Utils.getInputValue(str, "rand");
		Config.OrigURL = Utils.getInputValue(str, "orig_url");
		Config.PostIcons = Parser.parsePostIcons(str);
	}

	if (Config.PostRand != null && Config.PostRand != "" && !isNaN(Config.PostRand))
		return {success:true};
	
	return {success:false};
}

Parser.parseInbox = function(str) {
	var inboxMessages = str.split('<tr bgcolor="White"><td align="center">');
	inboxMessages.splice(0, 1);
	
	var numPages = str.substr(str.indexOf("ישנם <b>")+8);
	numPages = Math.ceil(parseInt(numPages.substr(0, numPages.indexOf("<")))/30);

	for (i=0;i<inboxMessages.length;i++) {
		inboxMessages[i] = {source:inboxMessages[i]};
		inboxMessages[i].source = inboxMessages[i].source.substr(0, inboxMessages[i].source.indexOf("</tr>"));
		inboxMessages[i].messageId = Utils.getInputValue(inboxMessages[i].source, "selected");
		inboxMessages[i].sender = inboxMessages[i].source.substr(inboxMessages[i].source.indexOf("<font color=red>")+16);
		inboxMessages[i].sender = inboxMessages[i].sender.substr(0, inboxMessages[i].sender.indexOf("</a>"));
		
		if (inboxMessages[i].sender.indexOf("</font") > -1)
			inboxMessages[i].sender = inboxMessages[i].sender.substr(0, inboxMessages[i].sender.indexOf("</font>"));
		inboxMessages[i].title = inboxMessages[i].source.substr(inboxMessages[i].source.indexOf("command=show_mesg"));
		inboxMessages[i].title = inboxMessages[i].title.substr(inboxMessages[i].title.indexOf('">') + 2);
		inboxMessages[i].title = inboxMessages[i].title.substr(0, inboxMessages[i].title.indexOf("</a>"));
		inboxMessages[i].date = inboxMessages[i].source.substr(inboxMessages[i].source.indexOf('<font size="1" face="Arial" color="#000099">')+44);
		inboxMessages[i].date = inboxMessages[i].date.substr(0, inboxMessages[i].date.indexOf("</font>"));
		inboxMessages[i].date = inboxMessages[i].date.split("<br>");
		inboxMessages[i].time = inboxMessages[i].date[1];
		inboxMessages[i].date = inboxMessages[i].date[0];
	}
	return {success:true, numPages:numPages, messages:inboxMessages}
}

Parser.parseInboxMessageSent = function(str) {
	if (str.indexOf("שם המשתמש שהוזן אינו משתמש רשום") > -1) {
		return {success:false};
	}
	else {
		if (str.indexOf("הודעה פרטית נשלחה בהצלחה") > -1) {
			return {success:true};
		}
		else {
			return {success:false};
		}
	}
}

Parser.parseInboxMessage = function(str) {
	if (str.indexOf("<blockquote>") > -1) {
		str = str.substr(str.indexOf("<blockquote>")+12);
		str = str.substr(0, str.indexOf("</blockquote>"));
		return {success:true, message:str}
	}
	else
		return {success:false}
}

Parser.parseInboxMessageForReply = function(str) {
	if (str.indexOf('cols="70" wrap="virtual">') > -1) {
		str = str.substr(str.indexOf('cols="70" wrap="virtual">')+25);
		str = str.substr(0, str.indexOf("</textarea>"));
		str = "\n\n" + str;
		return {success:true, message:str}
	}
	else
		return {success:false}
}

Parser.parseInboxNewMessages = function(str) {
	if (str.indexOf('inbox_flag.gif') > -1) {
		return {success:true}
	}
	else {
		return {success:false}
	}
}