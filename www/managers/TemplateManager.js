var TemplateManager = {};
var TemplateEvents = new EventTarget();

TemplateManager.templates = [];
TemplateManager.templatesToLoad = [];
TemplateManager.templateIndex = 0;

TemplateManager.initTemplates = function () {
	if (TemplateManager.templateIndex < TemplateManager.templatesToLoad.length)
	{
		$.get(TemplateManager.templatesToLoad[TemplateManager.templateIndex].path + ".html?r=" + Math.random()*100000000, null, function(data) {
					TemplateManager.templates[TemplateManager.templatesToLoad[TemplateManager.templateIndex].name] = data;
					TemplateManager.templateIndex++;
					TemplateManager.initTemplates();
				},"text");
	}
	else {
		TemplateEvents.fireEvent("templateLoadComplete");
	}
}

TemplateManager.GetTemplate = function (template_name) {
	if (TemplateManager.templates[template_name] != null)
		return TemplateManager.templates[template_name];
	else {
		alert("Template " + template_name + " not found!");
		return "";
	}
}

TemplateManager.AddTemplate = function(template_path, template_name) {
	TemplateManager.templatesToLoad[TemplateManager.templatesToLoad.length] = {name:template_name, path:template_path};
}

TemplateManager.AddTemplate("pages/about", "about");
TemplateManager.AddTemplate("pages/bookmarks", "bookmarks");
TemplateManager.AddTemplate("pages/forum_posts", "forum_posts");
TemplateManager.AddTemplate("pages/forums", "forums");
TemplateManager.AddTemplate("pages/login", "login");
TemplateManager.AddTemplate("pages/inbox", "inbox");
TemplateManager.AddTemplate("pages/not_connected_comment", "not_connected_comment");
TemplateManager.AddTemplate("pages/not_connected_edit", "not_connected_edit");
TemplateManager.AddTemplate("pages/not_connected_jump", "not_connected_jump");
TemplateManager.AddTemplate("pages/not_connected_post", "not_connected_post");
TemplateManager.AddTemplate("pages/not_connected_view", "not_connected_view");
TemplateManager.AddTemplate("pages/post", "post");
TemplateManager.AddTemplate("pages/settings", "settings");
TemplateManager.AddTemplate("pages/splash", "splash");
TemplateManager.AddTemplate("pages/quick_new_post", "quick_new_post");
TemplateManager.AddTemplate("pages/quick_comment", "quick_comment");
TemplateManager.AddTemplate("pages/quick_edit_post", "quick_edit_post");
TemplateManager.AddTemplate("templates/forum_item", "forum_item");
TemplateManager.AddTemplate("templates/forum_post_item", "forum_post_item");
TemplateManager.AddTemplate("templates/post_item", "post_item");
TemplateManager.AddTemplate("templates/inbox_item", "inbox_item");
TemplateManager.AddTemplate("pages/inbox_compose", "inbox_compose");
TemplateManager.AddTemplate("pages/inbox_read", "inbox_read");
TemplateManager.AddTemplate("pages/inbox_popup_menu", "inbox_popup_menu");
TemplateManager.AddTemplate("pages/inbox_new_messages", "inbox_new_messages");
TemplateManager.AddTemplate("pages/confirm_delete_messages", "confirm_delete_messages");
TemplateManager.AddTemplate("pages/delete_messages_error", "delete_messages_error");
TemplateManager.AddTemplate("templates/bookmark_item", "bookmark_item");
TemplateManager.AddTemplate("templates/forum_bookmark_item", "forum_bookmark_item");
TemplateManager.AddTemplate("pages/blank_iframe", "blank_iframe");