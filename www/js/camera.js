/* 
* camera, image and ocr functions...
*/

	B.fs_ = null;
	B.cwd_ = null;
	
	$$(".button.card-side").on("click", function(){
		$$(".button.card-side").removeClass("selected");
		$$(this).addClass("selected");
		B.card_side = ($$(this).hasClass("front") ? 'front' : 'back');
		$$("span.card-side").text(B.card_side);
		$$("#card-photo > img").addClass("hidden");
		$$("#card-photo > img."+B.card_side).removeClass("hidden");
	});

	$$("#capturePhoto").on("click", capturePhoto);
	$$("#listPhoto").on("click", listPhoto);
	$$("#savePhoto").on("click", savePhoto);
	$$("#processPhoto").on("click", processPhoto);
	
	function setOptions(srcType) {
	    var options = {
	        quality: 50,
	        targetHeight: 1024,
	        targetWidth: 1024,
	        destinationType: Camera.DestinationType.FILE_URI,
	        sourceType: srcType,
	        encodingType: Camera.EncodingType.PNG,
	        mediaType: Camera.MediaType.PICTURE,
	        allowEdit: false,
	        correctOrientation: true  //Corrects Android orientation quirks
	    }
	    return options;
	}
	
	function savePhoto() {
		
		if (B.fromfile) {
			$$('#card-photo-front').attr("src","");
			$$('#card-photo-back').attr("src","");
			$$(".button.card-side.back").trigger("click");
			$$(".button.card-side.front").trigger("click");
			return false;
		}
		var ImageUri = { 
			front:$$('#card-photo-front').attr("src"),
			back:$$('#card-photo-back').attr("src")
		}
		var now = Date.now();
		B.dirname = now.toString();

		if (ImageUri.front) {
			console.log("1 : "+ImageUri.front);
			window.resolveLocalFileSystemURL(ImageUri.front, function (fileEntry) {
				console.log("2");
				window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function(fileSys) {
					B.fs_ = fileSys;
					B.cwd_ = B.fs_.root;
					console.log("3");
					B.cwd_.getDirectory(B.dirname, {create:true, exclusive: false}, function(dirEntry) {
						B.cwd_ = dirEntry;
						fileEntry.moveTo(dirEntry, "front.png", function(){
							console.log("front.png moved!");
							$$('#card-photo-front').attr("src","");
					   	$$("#savePhoto, #processPhoto").parent().addClass("hidden");
					   	$$("#listPhoto").parent().removeClass("hidden");
						}, onFail0);
					}, onFail1);
				}, onFail2);
			}, onFail3);
			
		}
		
		if (ImageUri.back) {
			console.log("1 : "+ImageUri.back);
			window.resolveLocalFileSystemURL(ImageUri.back, function (fileEntry) {
				window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function(fileSys) {
					B.fs_ = fileSys;
					B.cwd_ = B.fs_.root;
					B.cwd_.getDirectory(B.dirname, {create:true, exclusive: false}, function(dirEntry) {
						B.cwd_ = dirEntry;
						fileEntry.moveTo(dirEntry, "back.png", function(){
							console.log("back.png moved!");
							$$('#card-photo-back').attr("src","");
					   	$$("#savePhoto, #processPhoto").parent().addClass("hidden");
					   	$$("#listPhoto").parent().removeClass("hidden");
						}, onFail0);
		         }, onFail1);
				}, onFail2);
			}, onFail3);
		}
	}
	
	function listPhoto() {
	function capturePhoto() {	
	function loadPhoto(dirname) {	
	function processPhoto() {
		console.log('processPhoto()');
	
		myApp.showPreloader('Loading...');
		setTimeout(function () {
	   	myApp.hidePreloader();
		}, 8000);
		
		function getDataUri(url, callback) {
			var image = new Image();
			
			image.onload = function () {
				console.log(this);
				var canvas = document.createElement('canvas');
				canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
				canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
				
				canvas.getContext('2d').drawImage(this, 0, 0);
				
				// Get raw image data
				callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
			};
			
			image.src = url;
		}
		
		B.dataUrl = {};
		var initd = false;
		
		if ($$('#card-photo-front').attr("src")) {
			getDataUri($$('#card-photo-front').attr("src"), function(dataUrl){
				B.dataUrl.front = dataUrl;
				socket.emit('card ocr', {photo: dataUrl, cardid: mycard.id, card_side: "front"});
				if ($$('#card-photo-back').attr("src")) {
					getDataUri($$('#card-photo-back').attr("src"), function(dataUrl){
						B.dataUrl.back = dataUrl;
						socket.emit('card ocr', {photo: dataUrl, cardid: mycard.id, card_side: "back"});
					});
				}
			});
			card_ocr_init();
		} else if ($$('#card-photo-back').attr("src")) {
			getDataUri($$('#card-photo-back').attr("src"), function(dataUrl){
				B.dataUrl.back = dataUrl;
				socket.emit('card ocr', {photo: dataUrl, cardid: mycard.id, card_side: "front"});
			});
			card_ocr_init();
		}
	}
	
	function card_ocr_init() {
		B.container="#add_card_list";
		B.list = "current";
		B.index = false;
		B.cardid = false;
		$$(".card-fields").removeClass("hidden");
		$$(B.container).html(base_tpl.replace(/lock/g,'unlock').replace(/{{unlock}}/g,'unlock').replace(/{{class}}/g, ''));
		$$(".button-photo").addClass("hidden");
		$$(".card-fields").parent().removeClass("hidden");
	}
	
	socket.on('card ocr', function(data) {
		console.log('card_ocr_process()');
		
		// Using text detection result from vision, we add a formatted list of fields...
		var ocrLines = data.description.split("\n");
		
		for (var ii=0; ii<ocrLines.length; ii++) {
			var ocrLine = ocrLines[ii].replace(/^[ ]+|[ ]+$/g,'');
			if (ocrLine.length) add_card_li_match(ii, ocrLine);
		}
		
		card_init(data.card_side);
		
		myApp.hidePreloader();
	});
	
	function delPhoto(dirname) {
		console.log('delPhoto('+dirname+')');
		B.cwd_ = B.fs_.root;		
		B.cwd_.getDirectory(dirname, {}, function(dirEntry) {
			$$("#dir_"+dirname).remove();
			dirEntry.removeRecursively();			
		}, onFail);
	}
	
	function onFail(message) {
	    myApp.alert('Failed because: ' + message);
	}
	
	function onFail0(message) {
	    myApp.alert('Failed "fileEntry.moveTo"');
	    console.log(message)
	}
	
	function onFail1(message) {
	    myApp.alert('Failed "B.cwd_.getDirectory"');
	    console.log(message)
	}
	
	function onFail2(message) {
	    myApp.alert('Failed "requestFileSystem"');
	    console.log(message)
	}
	
	function onFail3(message) {
	    myApp.alert('Failed "resolveLocalFileSystemURL"');
	    console.log(message)
	}
	
	function ls_(successCallback) {
    if (!B.fs_) {
      return;
    }
    
    var entries = [];
    var reader = B.cwd_.createReader();

    var readEntries = function() {
      reader.readEntries(function(results) {
        if (!results.length) {
          entries.sort();
          successCallback(entries);
        } else {
          entries = entries.concat(util.toArray(results));
          readEntries();
        }
      }, onFail);
    };

    readEntries();
  }
  
	var util = util || {};
	util.toArray = function(list) {
	  return Array.prototype.slice.call(list || [], 0);
	};
	
