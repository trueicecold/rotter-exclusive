var AdManager = {};

AdManager.init = function() {
    if (!Config.DEBUG) {
        var admobid = {};
        if( /(android)/i.test(navigator.userAgent) ) { // for android & amazon-fireos
            admobid = {
                banner: 'ca-app-pub-3239881464377321/6725726395'
            };
        } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
            admobid = {
                banner: 'ca-app-pub-1200621436361020/9407939791'
            };
        }

        if(window.AdMob) {
            window.AdMob.createBanner({
                adId: admobid.banner,
                position: window.AdMob.AD_POSITION.BOTTOM_CENTER,
                autoShow: true,
                isTesting: false,
                adSize:"CUSTOM",
                width:320,
                height:50,
                success: function(){
                },
                error: function(){
                }
            });
        }
    }
};

AdManager.startTrack = function() {
    if (!Config.DEBUG) {
        window.ga.startTrackerWithId('UA-100388995-1', 30);
        AdManager.track("Start");
    }
}

AdManager.track = function(name) {
		if (!Config.DEBUG) {
			window.ga.trackView(name);
		}
}