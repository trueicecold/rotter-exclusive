var PushManager = {};

PushManager.init = function() {
	if (!Config.DEBUG) {
		PushManager.iosSettings = {};
	    PushManager.iosSettings["kOSSettingsKeyAutoPrompt"] = true;
	    PushManager.iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;

	    window.plugins.OneSignal.startInit( "5f25aa69-a1b2-4487-b287-d3de9a774f92", "1004527598574")
	                            .handleNotificationReceived(PushManager.didReceiveRemoteNotificationCallBack)
	                            .handleNotificationOpened(PushManager.didOpenRemoteNotificationCallBack)
	                            .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
	                            .iOSSettings(PushManager.iosSettings)
	                            .endInit();
			console.log("PUSH INIT!");
			PushManager.deleteTags();
	}
};

PushManager.deleteTags = function() {
	if (!Config.DEBUG) {
		window.plugins.OneSignal.getTags(function(tags) {
			PushManager.tags = [];
			for (var tag in tags) {
				PushManager.tags.push(tag);
			}
			window.plugins.OneSignal.deleteTags(PushManager.tags);
		});
	}
}

PushManager.registerUsername = function(username) {
	if (!Config.DEBUG) {
		window.plugins.OneSignal.sendTag("UserName", username.toLowerCase());
	}
}

PushManager.didReceiveRemoteNotificationCallBack = function() {};
PushManager.didOpenRemoteNotificationCallBack = function(message) {
    if (!Config.DEBUG) {
        if (message && message.notification && message.notification.payload && message.notification.payload.additionalData && message.notification.payload.additionalData.type) {
            console.log(message.notification.payload.additionalData.type);
            switch (message.notification.payload.additionalData.type) {
                case "inbox":
                case "post":
                    if (!PageManager.pageInited)
                        PushManager.initPage = {page:message.notification.payload.additionalData.type, params:message.notification.payload.additionalData.params};
                    else
                        PageManager.changeLocation(message.notification.payload.additionalData.type, params:message.notification.payload.additionalData.params);
                    break;
            }
        }
    }
};