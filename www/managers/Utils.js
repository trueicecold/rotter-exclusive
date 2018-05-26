var Utils = {};
Utils.UserInfo = {};
Utils.trim = function (str) {
    return str.replace(/^\s+|\s+$/g, "");
};

Utils.stringify = function (obj) {
	var t = typeof (obj);
    if (t != "object" || obj === null) {
        if (t == "string") obj = '"' + obj + '"';
        return String(obj);
    } else {
        var n, v, json = [],
            arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n];
            t = typeof (v);
            if (t == "string") v = '"' + v + '"';
            else if (t == "object" && v !== null) v = JSON.stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};

Utils.isAndroid = function () {
	if (!Config.DEBUG && window.device != null && window.device.platform != null)
			return (window.device.platform == "Android");
	else
		return navigator.userAgent.toLowerCase().indexOf("android") > -1;
}

Utils.navigateToLastForum = function() {
	$.mobile.changePage("forums.html?name=" + Config.GetCurrentForum().name);
}

Utils.HEBEncode = function(strText) {
    if (strText == null)
        return strText;
	strText = strText.replace(/[א-ת]/ig, function(a,b,c) {
		return escape(String.fromCharCode(a.charCodeAt(0)-1264));
	});
	return strText;
}

Utils.escapeLogin = function(str) {
	str = str.replace("&", "%26").replace("#", "%23");
	return str;
}

Utils.isLoggedIn = function(str) {
	return str.indexOf("זהו מועדון פרטי הפתוח רק לחברים רשומים") == -1;
}

Utils.getInputValue = function(str, name) {
    var loweredStr = str.toLowerCase();
	if (loweredStr.indexOf('name="' + name + '"') > -1) {
		var tmpStr = str.substr(loweredStr.indexOf('name="' + name + '"')+7+name.length);
		tmpStr = tmpStr.substr(tmpStr.toLowerCase().indexOf('value="')+7);
		tmpStr = tmpStr.substr(0, tmpStr.indexOf('"'));
		return tmpStr;
	}
	return null;
}

Utils.getTextareaValue = function(str, name) {
    var loweredStr = str.toLowerCase();
    if (loweredStr.indexOf('name="' + name + '"') > -1) {
        var tmpStr = str.substring(loweredStr.indexOf('name="' + name + '"')+7+name.length, loweredStr.indexOf('</textarea>'));
        if (tmpStr != "") {
            tmpStr = tmpStr.substr(tmpStr.indexOf('>')+1);
            return tmpStr;
        } else {
            return null;
        }
    }
    return null;
}

Utils.stripHTMLTags = function(code) {
    return $('<div />', { html: code }).text().trim();
}

Utils.replaceVar = function(str, var_names) {
	for (var i in var_names)
	{
		str = str.replace(new RegExp("\\\[" + i + "\\\]", "ig"), var_names[i]);
	}
	return str;
}

Utils.openNewBrowser = function(url) {
    if (url != null && url != "") {
		url = Utils.constructURL(url);
		if (Utils.isAndroid()) {
			window.open(url, "_system");
		}
		else {
			window.location.href = url;
		}
	}
}

Utils.constructURL = function(url) {
	return "http://redirect.viglink.com/?key=" + Config.VIGLINK + "&format=go&loc=" + encodeURIComponent(HTTPManager.post_ref_url) + "&out=" + encodeURIComponent(url) + "&cuid=MOBILE_APP";
}

Utils.writeIFrameWrapper = function(html) {
	return Utils.replaceVar(TemplateManager.GetTemplate("blank_iframe"), 
			{
				"IFRAME_CONTENT":html
			}
		);
}

Utils.lastItemTapped = null;
Utils.lastItemTimeTapped = null;
Utils.doubleTap = function(elem, threshold, callback) {
	$(elem).bind("touchstart", function() {
		if (elem == Utils.lastItemTapped && Utils.lastItemTimeTapped != null && (new Date()).getTime()-Utils.lastItemTimeTapped <= threshold) {
			eval(callback);
			Utils.lastItemTimeTapped = null;
			Utils.lastItemTapped = null;
			return;
		}
		Utils.lastItemTimeTapped = (new Date()).getTime();
		Utils.lastItemTapped = elem;
	});
}