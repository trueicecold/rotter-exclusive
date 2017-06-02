var UploadManager = {};
var UploadEvents = new EventTarget();

UploadManager.chooseImage = function() {
	navigator.camera.getPicture( UploadManager.onImageSelectSuccess, UploadManager.onImageSelectError, 
		{
			quality : 50,
			destinationType : Camera.DestinationType.FILE_URI, 
			sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
			targetWidth : 640,
			targetHeight : 640,
			correctOrientation: true
		}
	);
}

UploadManager.imageUploadOptions = {};
UploadManager.imageUploadParams = {}
UploadManager.imageUploadObject = "";

UploadManager.onImageSelectSuccess = function(imageURI, success) {
	if (success != null && success === true) {
		UploadManager.imageUploadOptions = new FileUploadOptions();
		UploadManager.imageUploadOptions.fileKey="Filedata";
	    UploadManager.imageUploadOptions.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
	    UploadManager.imageUploadOptions.mimeType=UploadManager.getExtensionFromFileName(UploadManager.imageUploadOptions.fileName);
	    if (UploadManager.imageUploadOptions.mimeType != "") {
			PageManager.showLoader("מעלה תמונה...");
            UploadManager.imageUploadParams.key = "1BFKOTUWc6f1323c8b92d49cea04fada35ccd7fe";
			UploadManager.imageUploadParams.optsize = "resample";
			UploadManager.imageUploadOptions.params = UploadManager.imageUploadParams;
			UploadManager.imageUploadObject = new FileTransfer();
	        UploadManager.imageUploadObject.upload(imageURI, "http://www.imageshack.us/upload_api.php", UploadManager.onImageUploadSuccess, UploadManager.onImageUploadError, UploadManager.imageUploadOptions);
	        AdManager.track("Image-Upload-Start");
	    }
	}
	else {
		window.resolveLocalFileSystemURI(imageURI, UploadManager.onImageResolveSuccess, UploadManager.onImageResolveError);
	}
}

UploadManager.onImageResolveSuccess = function(imageEntry) {
	UploadManager.onImageSelectSuccess(imageEntry.fullPath, true);
}

UploadManager.onImageResolveError = function(event) {
	alert(event.target.error.code);
}


UploadManager.imageUploadResponse = "";
UploadManager.onImageUploadSuccess = function(e) {
    PageManager.hideLoader();
	try {
		UploadManager.imageUploadResponse = $.parseXML(e.response);
		UploadManager.imageUploadResponse = $(UploadManager.imageUploadResponse);
		UploadEvents.fireEvent("onImageUploaded", {success:true, url:UploadManager.imageUploadResponse.find("image_link").text()});
	}
	catch(e) {
		alert("שגיאה בהעלאת התמונה.");
		UploadEvents.fireEvent("onImageUploaded", {success:false});
	}
}

UploadManager.onImageUploadError = function(e) {
    PageManager.hideLoader();
	alert("שגיאה בהעלאת התמונה.");
}

UploadManager.onImageSelectError = function(e) {
    PageManager.hideLoader();
	alert("שגיאה בהעלאת התמונה.");
}

UploadManager.getExtensionFromFileName = function(fileName) {
	fileName = fileName.toLowerCase().substring(fileName.lastIndexOf(".")+1);
	if (fileName.indexOf("?") > -1)
		fileName = fileName.substring(0, fileName.indexOf("?"));
	switch(fileName) {
		case "jpg":
			return "image/jpeg";
		case "png":
			return "image/png";
		default:
			return "";
	}
}